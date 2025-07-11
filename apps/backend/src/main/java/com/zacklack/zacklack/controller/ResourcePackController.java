package com.zacklack.zacklack.controller;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.service.ResourcePackService;

@RestController
@RequestMapping("/api/resourcepacks")
public class ResourcePackController {

    private static final Logger logger = LoggerFactory.getLogger(ResourcePackController.class);
    private final ResourcePackService service;

    public ResourcePackController(ResourcePackService service) {
        this.service = service;
    }

    @GetMapping
    public List<ResourcePack> getAllPacks() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourcePack> getPack(@PathVariable Long id) {
        return ResponseEntity.of(
            service.findAll().stream().filter(p->p.getId().equals(id)).findFirst()
        );
    }

    @GetMapping("/{id}/hash")
    public ResponseEntity<String> getHash(@PathVariable Long id) {
        try {
            String hash = service.findHashById(id);
            return ResponseEntity.ok(hash);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResourcePack> uploadPack(@RequestParam("file") MultipartFile file) throws NoSuchAlgorithmException {
        logger.info("[UPLOAD] Received upload request: filename={}, size={} bytes, contentType={}",
            file.getOriginalFilename(), file.getSize(), file.getContentType());
        try {
            ResourcePack saved = service.store(file);
            logger.info("[UPLOAD] Successfully stored file: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
            return ResponseEntity.status(201).body(saved);
        } catch (IOException e) {
            logger.error("[UPLOAD] IOException while storing file: {}: {}", file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            logger.error("[UPLOAD] Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResourcePack(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
