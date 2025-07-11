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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ResourcePackRepository;

import jakarta.annotation.PostConstruct;

@Service
public class ResourcePackService {

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
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
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
        } catch (Exception e) {
            throw new IOException("Failed to compute hash", e);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf('.'))
            : "";
        String storageFilename = UUID.randomUUID() + ext;
        Path target = uploadPath.resolve(storageFilename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        ResourcePack rp = new ResourcePack(
            originalFilename,
            storageFilename,
            file.getSize(),
            hashHex,
            LocalDateTime.now()
        );
        return repository.save(rp);
    }
}
