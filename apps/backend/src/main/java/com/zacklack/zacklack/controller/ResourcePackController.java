package com.zacklack.zacklack.controller;

import java.io.EOFException;
import java.io.IOException;
import java.net.SocketException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.service.ResourcePackService;

import jakarta.servlet.http.HttpServletRequest;

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
    public ResponseEntity<ResourcePack> uploadPack(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request,
            @RequestHeader(value = "User-Agent", required = false) String userAgent) throws NoSuchAlgorithmException {
        String clientIp = request.getRemoteAddr();
        logger.info("[UPLOAD] Received upload request: filename={}, size={} bytes, contentType={}, clientIp={}, userAgent={}",
            file.getOriginalFilename(), file.getSize(), file.getContentType(), clientIp, userAgent);
        try {
            ResourcePack saved = service.store(file);
            logger.info("[UPLOAD] Upload abgeschlossen und gespeichert: id={}, originalFilename={}, storageFilename={}, size={} bytes, clientIp={}, userAgent={}",
                saved.getId(), saved.getOriginalFilename(), saved.getStorageFilename(), saved.getSize(), clientIp, userAgent);
            return ResponseEntity.status(201).body(saved);
        } catch (EOFException | ClientAbortException | SocketException e) {
            logger.warn("[UPLOAD] Client connection aborted during upload: {}: {}, clientIp={}, userAgent={}",
                file.getOriginalFilename(), e.getMessage(), clientIp, userAgent, e);
            // Keine Fehlerantwort nötig, Client ist schon weg
            return ResponseEntity.status(204).build();
        } catch (IOException e) {
            logger.error("[UPLOAD] IOException while storing file: {}: {}, clientIp={}, userAgent={}",
                file.getOriginalFilename(), e.getMessage(), clientIp, userAgent, e);
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            logger.error("[UPLOAD] Unexpected error: {}, clientIp={}, userAgent={}", e.getMessage(), clientIp, userAgent, e);
            return ResponseEntity.status(500).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResourcePack(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
