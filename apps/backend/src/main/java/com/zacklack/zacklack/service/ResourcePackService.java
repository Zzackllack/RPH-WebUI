
package com.zacklack.zacklack.service;
import java.io.IOException;
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ResourcePackRepository;

import jakarta.annotation.PostConstruct;

@Service
public class ResourcePackService {

    private static final Logger logger = LoggerFactory.getLogger(ResourcePackService.class);
    private final ResourcePackRepository repository;

    @Value("${file.upload-dir}")
    private String uploadDir;
    private Path uploadPath;

    public ResourcePackService(ResourcePackRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() throws IOException {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        logger.debug("[UPLOAD] Initializing upload directory: {}", uploadPath);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
            logger.info("[UPLOAD] Created upload directory: {}", uploadPath);
        } else {
            logger.info("[UPLOAD] Using existing upload directory: {}", uploadPath);
        }
    }

    public List<ResourcePack> findAll() {
        return repository.findAll();
    }

    public ResourcePack findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("ResourcePack not found: " + id));
    }

    public String findHashById(Long id) {
        ResourcePack rp = findById(id);
        return rp.getFileHash();
    }

    public ResourcePack store(MultipartFile file) throws IOException, NoSuchAlgorithmException {
        logger.debug("[UPLOAD] Storing file: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf('.'))
            : "";
        String storageFilename = UUID.randomUUID() + ext;
        Path target = uploadPath.resolve(storageFilename);
        long totalBytes = 0;
        // Hash und Kopieren in einem Durchlauf mit großem Buffer (1 MB)
        byte[] buffer = new byte[1024 * 1024];
        try (DigestInputStream dis = new DigestInputStream(file.getInputStream(), digest)) {
            int bytesRead;
            try (java.io.OutputStream os = java.nio.file.Files.newOutputStream(
                    target,
                    java.nio.file.StandardOpenOption.CREATE,
                    java.nio.file.StandardOpenOption.TRUNCATE_EXISTING)) {
                while ((bytesRead = dis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;
                }
            }
        } catch (Exception e) {
            logger.error("[UPLOAD] Failed to save file {}: {}", originalFilename, e.getMessage(), e);
            throw new IOException("Failed to save file", e);
        }
        // Hash berechnen
        String hashHex;
        byte[] hashBytes = digest.digest();
        try (Formatter fmt = new Formatter()) {
            for (byte b : hashBytes) {
                fmt.format("%02x", b);
            }
            hashHex = fmt.toString();
        }
        logger.info("[UPLOAD] File saved to: {} ({} bytes)", target, totalBytes);

        ResourcePack rp = new ResourcePack(
            originalFilename,
            storageFilename,
            totalBytes,
            hashHex,
            LocalDateTime.now()
        );
        // Nur noch ein Debug-Log für das Entity, kein Info-Log mehr im Hot Path
        logger.debug("[UPLOAD] ResourcePack entity created: {}", rp);
        ResourcePack saved = repository.save(rp);
        logger.info("[UPLOAD] ResourcePack saved to DB: id={}, originalFilename={}, storageFilename={}", saved.getId(), saved.getOriginalFilename(), saved.getStorageFilename());
        return saved;
    }

    /**
     * Delete a resource pack by ID, removing both the DB entry and the file from disk.
     * @param id ResourcePack ID
     */
    public void delete(Long id) {
        ResourcePack rp = findById(id);
        // Remove file from disk
        if (rp.getStorageFilename() != null && !rp.getStorageFilename().isEmpty()) {
            Path filePath = uploadPath.resolve(rp.getStorageFilename());
            try {
                Files.deleteIfExists(filePath);
                logger.info("[DELETE] Deleted file from disk: {}", filePath);
            } catch (IOException e) {
                logger.warn("[DELETE] Failed to delete file from disk: {}: {}", filePath, e.getMessage());
            }
        }
        // Remove DB entry
        repository.deleteById(id);
        logger.info("[DELETE] Deleted ResourcePack from DB: id={}", id);
    }
}
