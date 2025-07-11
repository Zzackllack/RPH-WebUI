package com.zacklack.zacklack.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
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

    // e.g. "uploads"
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
                .orElseThrow(() -> new RuntimeException("ResourcePack not found with id " + id));
    }

    public ResourcePack store(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : "";
        String storageFilename = UUID.randomUUID().toString() + extension;

        Path targetLocation = uploadPath.resolve(storageFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        ResourcePack rp = new ResourcePack(
                originalFilename,
                storageFilename,
                file.getSize(),
                LocalDateTime.now()
        );
        return repository.save(rp);
    }
}
