package com.zacklack.zacklack.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
        // compute hash
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String hashHex;
        try (DigestInputStream dis = new DigestInputStream(file.getInputStream(), digest)) {
            // read to EOF to compute
            while (dis.read() != -1) {}
            byte[] hashBytes = digest.digest();
            try (Formatter fmt = new Formatter()) {
                for (byte b : hashBytes) {
                    fmt.format("%02x", b);
                }
                hashHex = fmt.toString();
            }
            logger.debug("[UPLOAD] Computed SHA-256 hash: {}", hashHex);
        } catch (Exception e) {
            logger.error("[UPLOAD] Failed to compute hash for file {}: {}", file.getOriginalFilename(), e.getMessage(), e);
            throw new IOException("Failed to compute hash", e);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf('.'))
            : "";
        String storageFilename = UUID.randomUUID() + ext;
        Path target = uploadPath.resolve(storageFilename);
        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            logger.info("[UPLOAD] File saved to: {} ({} bytes)", target, file.getSize());
        } catch (Exception e) {
            logger.error("[UPLOAD] Failed to save file {}: {}", originalFilename, e.getMessage(), e);
            throw new IOException("Failed to save file", e);
        }

        ResourcePack rp = new ResourcePack(
            originalFilename,
            storageFilename,
            file.getSize(),
            hashHex,
            LocalDateTime.now()
        );
        logger.debug("[UPLOAD] ResourcePack entity created: {}", rp);
        ResourcePack saved = repository.save(rp);
        logger.info("[UPLOAD] ResourcePack saved to DB: id={}, originalFilename={}, storageFilename={}", saved.getId(), saved.getOriginalFilename(), saved.getStorageFilename());
        return saved;
    }
}
