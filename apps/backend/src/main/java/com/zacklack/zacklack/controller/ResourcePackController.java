package com.zacklack.zacklack.controller;

import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.service.ResourcePackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
    public ResponseEntity<ResourcePack> getPackById(@PathVariable Long id) {
        try {
            ResourcePack rp = service.findById(id);
            return ResponseEntity.ok(rp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourcePack> uploadPack(@RequestParam("file") MultipartFile file) {
        try {
            ResourcePack saved = service.store(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
