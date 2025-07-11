package com.zacklack.zacklack.controller;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.http.ResponseEntity;
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
        try {
            ResourcePack saved = service.store(file);
            return ResponseEntity.status(201).body(saved);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
