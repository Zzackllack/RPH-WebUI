package com.zacklack.zacklack.service;

import com.zacklack.zacklack.exception.InvalidPackException;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ResourcePackRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Formatter;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Handles validation, storage, retrieval and deletion of ResourcePack files.
 */
@Service
public class ResourcePackService {

    private static final Logger logger = LoggerFactory.getLogger(
        ResourcePackService.class
    );

    private final ResourcePackRepository repository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    public ResourcePackService(ResourcePackRepository repository) {
        this.repository = repository;
    }

    /** Initialize the upload directory on application startup. */
    @PostConstruct
    public void init() throws IOException {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        logger.debug("Initializing upload directory: {}", uploadPath);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
            logger.info("Created upload directory: {}", uploadPath);
        } else {
            logger.info("Using existing upload directory: {}", uploadPath);
        }
    }

    /**
     * List all ResourcePack records.
     *
     * @return List of persisted ResourcePack entities
     */
    public List<ResourcePack> findAll() {
        logger.debug("Listing all ResourcePacks");
        return repository.findAll();
    }

    /**
     * List only original (non-converted) ResourcePacks.
     */
    public List<ResourcePack> findAllOriginals() {
        logger.debug("Listing original ResourcePacks (non-converted)");
        return repository.findByConvertedFalse();
    }

    /**
     * List conversions of a specific ResourcePack.
     *
     * @param originalId original pack ID
     * @return list of converted packs
     */
    public List<ResourcePack> findConversions(Long originalId) {
        logger.debug("Listing conversions for pack id={}", originalId);
        return repository.findByOriginalPackId(originalId);
    }

    /**
     * Retrieve a ResourcePack by ID.
     *
     * @param id database ID of the resource pack
     * @return ResourcePack entity or throws if not found
     */
    public ResourcePack findById(Long id) {
        logger.debug("Looking up ResourcePack with id={}", id);
        return repository
            .findById(id)
            .orElseThrow(() ->
                new RuntimeException("ResourcePack not found: " + id)
            );
    }

    /**
     * Get the stored file SHA-1 hash for a pack.
     *
     * @param id pack ID
     * @return hex-encoded SHA-1 hash
     */
    public String findHashById(Long id) {
        ResourcePack rp = findById(id);
        return rp.getFileHash();
    }

    /**
     * Ensure uploaded ZIP contains at least the root-level pack.mcmeta.
     * Logs filename, size, IP, and user agent if invalid.
     *
     * @param file uploaded ZIP
     * @param request HttpServletRequest for logging client info
     * @throws IOException if reading fails
     * @throws InvalidPackException if validation fails
     */
    private void validateZip(MultipartFile file, HttpServletRequest request)
        throws IOException {
        try (ZipInputStream zis = new ZipInputStream(file.getInputStream())) {
            ZipEntry entry;
            boolean hasMeta = false;
            while ((entry = zis.getNextEntry()) != null) {
                if (
                    !entry.isDirectory() &&
                    "pack.mcmeta".equals(entry.getName())
                ) {
                    hasMeta = true;
                    break;
                }
            }
            if (!hasMeta) {
                String clientIp = request != null
                    ? request.getRemoteAddr()
                    : "unknown";
                String userAgent = request != null
                    ? request.getHeader("User-Agent")
                    : "unknown";
                logger.warn(
                    "Invalid resource pack upload attempt: pack.mcmeta missing | filename={} | size={} | IP={} | UA={}",
                    file.getOriginalFilename(),
                    file.getSize(),
                    clientIp,
                    userAgent
                );
                throw new InvalidPackException(
                    "Invalid resource pack: pack.mcmeta not found in ZIP (filename=" +
                    file.getOriginalFilename() +
                    ", IP=" +
                    clientIp +
                    ", UA=" +
                    userAgent +
                    ")"
                );
            }
        }
    }

    /**
     * Store the uploaded file to disk, compute its SHA-1 hash and persist metadata.
     *
     * @param file uploaded ZIP
     * @return persisted ResourcePack entity
     * @throws IOException if storage fails
     * @throws NoSuchAlgorithmException if SHA-1 unsupported (won’t happen)
     */
    public ResourcePack store(MultipartFile file, HttpServletRequest request)
        throws IOException, NoSuchAlgorithmException {
        validateZip(file, request);
        logger.debug(
            "Storing file {} ({} bytes) | IP={} | UA={}",
            file.getOriginalFilename(),
            file.getSize(),
            request != null ? request.getRemoteAddr() : "unknown",
            request != null ? request.getHeader("User-Agent") : "unknown"
        );

        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        String originalFilename = file.getOriginalFilename();
        String ext = (originalFilename != null &&
                originalFilename.contains("."))
            ? originalFilename.substring(originalFilename.lastIndexOf('.'))
            : "";
        String storageFilename = UUID.randomUUID() + ext;
        Path target = uploadPath.resolve(storageFilename);

        long totalBytes = 0;
        byte[] buffer = new byte[1024 * 1024];
        try (
            DigestInputStream dis = new DigestInputStream(
                file.getInputStream(),
                digest
            );
            var os = Files.newOutputStream(target);
        ) {
            int bytesRead;
            while ((bytesRead = dis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
                totalBytes += bytesRead;
            }
        } catch (Exception e) {
            logger.error(
                "Failed to save file {}: {}",
                originalFilename,
                e.getMessage(),
                e
            );
            throw new IOException("Failed to save file", e);
        }

        // Compute hash hex
        String hashHex;
        try (Formatter fmt = new Formatter()) {
            for (byte b : digest.digest()) {
                fmt.format("%02x", b);
            }
            hashHex = fmt.toString();
        }

        logger.info(
            "File saved: {} ({} bytes) hash={}",
            target,
            totalBytes,
            hashHex
        );
        ResourcePack rp = new ResourcePack(
            originalFilename,
            storageFilename,
            totalBytes,
            hashHex,
            LocalDateTime.now()
        );

        // Extract pack_format and Minecraft version
        populatePackMetadata(rp, target);
        ResourcePack saved = repository.save(rp);
        logger.debug("Persisted ResourcePack id={}", saved.getId());
        return saved;
    }

    /**
     * Parse pack.mcmeta from a zip and populate packFormat and minecraftVersion.
     *
     * @param rp       ResourcePack entity to update
     * @param zipPath  path to the resource pack zip
     */
    public void populatePackMetadata(ResourcePack rp, Path zipPath) {
        try (
            ZipInputStream zis = new ZipInputStream(
                Files.newInputStream(zipPath)
            );
        ) {
            ZipEntry e;
            while ((e = zis.getNextEntry()) != null) {
                if (!e.isDirectory() && "pack.mcmeta".equals(e.getName())) {
                    var mapper =
                        new com.fasterxml.jackson.databind.ObjectMapper();
                    var node = mapper.readTree(zis);
                    int fmt = node.path("pack").path("pack_format").asInt();
                    rp.setPackFormat(fmt);
                    rp.setMinecraftVersion(
                        com.zacklack.zacklack.util.PackFormatUtil.getVersionForFormat(
                            fmt
                        )
                    );
                    break;
                }
            }
        } catch (Exception ex) {
            logger.warn(
                "Failed to parse pack.mcmeta for {}: {}",
                zipPath.getFileName(),
                ex.getMessage()
            );
        }
    }

    /**
     * Delete both the DB entry and the file from disk.
     *
     * @param id ResourcePack ID
     */
    public void delete(Long id) {
        ResourcePack rp = findById(id);

        if (
            rp.getStorageFilename() != null &&
            !rp.getStorageFilename().isEmpty()
        ) {
            Path filePath = uploadPath.resolve(rp.getStorageFilename());
            try {
                Files.deleteIfExists(filePath);
                logger.info("Deleted file: {}", filePath);
            } catch (IOException e) {
                logger.warn(
                    "Failed to delete file {}: {}",
                    filePath,
                    e.getMessage()
                );
            }
        }

        repository.deleteById(id);
        logger.info("Deleted ResourcePack id={}", id);
    }

    /**
     * Compute SHA-1 of a file on disk.
     *
     * @param file Path to file
     * @return hex-encoded SHA-1 digest
     * @throws IOException on I/O errors
     * @throws NoSuchAlgorithmException should not happen
     */
    public String computeHash(Path file)
        throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        try (
            InputStream is = Files.newInputStream(file);
            DigestInputStream dis = new DigestInputStream(is, digest);
        ) {
            byte[] buffer = new byte[1024 * 1024];
            while (dis.read(buffer) != -1) {
                /* consume */
            }
        }
        try (Formatter fmt = new Formatter()) {
            for (byte b : digest.digest()) {
                fmt.format("%02x", b);
            }
            return fmt.toString();
        }
    }
}
