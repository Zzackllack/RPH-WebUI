package com.zacklack.zacklack.controller;

import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.service.ConverterService;
import com.zacklack.zacklack.service.ResourcePackService;
import jakarta.servlet.http.HttpServletRequest;
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

/**
 * REST controller exposing CRUD and conversion endpoints for ResourcePacks.
 */
@RestController
@RequestMapping("/api/resourcepacks")
public class ResourcePackController {

    private static final Logger logger = LoggerFactory.getLogger(
        ResourcePackController.class
    );

    private final ResourcePackService service;
    private final ConverterService converterService;
    private final ConversionJobRepository conversionJobRepository;

    public ResourcePackController(
        ResourcePackService service,
        ConverterService converterService,
        ConversionJobRepository conversionJobRepository
    ) {
        this.service = service;
        this.converterService = converterService;
        this.conversionJobRepository = conversionJobRepository;
    }

    /**
     * List all resource packs.
     *
     * @return list of all ResourcePack entities
     */
    @GetMapping
    public List<ResourcePack> getAllPacks() {
        logger.debug("Fetching all resource packs");
        return service.findAllOriginals();
    }

    /**
     * Fetch a single ResourcePack by its ID.
     *
     * @param id ID of the pack to retrieve
     * @return 200 + ResourcePack or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourcePack> getPack(@PathVariable Long id) {
        logger.debug("Fetching resource pack with id={}", id);
        try {
            return ResponseEntity.ok(service.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * List converted versions for a given ResourcePack.
     */
    @GetMapping("/{id}/conversions")
    public List<ResourcePack> getConversions(@PathVariable Long id) {
        logger.debug("Fetching conversions for pack id={}", id);
        return service.findConversions(id);
    }

    /**
     * Get the SHA-256 hash of the stored file for a given pack.
     *
     * @param id pack ID
     * @return 200 + hash string or 404 if pack not found
     */
    @GetMapping("/{id}/hash")
    public ResponseEntity<String> getHash(@PathVariable Long id) {
        try {
            String hash = service.findHashById(id);
            logger.debug("Hash for pack {}: {}", id, hash);
            return ResponseEntity.ok(hash);
        } catch (RuntimeException e) {
            logger.warn("Hash requested for non-existent pack id={}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upload a new resource pack ZIP (must contain pack.mcmeta).
     *
     * @param file      uploaded ZIP file
     * @param request   servlet request (for client IP)
     * @param userAgent optional User-Agent header
     * @return 201 + created ResourcePack or appropriate error status
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResourcePack> uploadPack(
        @RequestParam("file") MultipartFile file,
        HttpServletRequest request,
        @RequestHeader(value = "User-Agent", required = false) String userAgent
    ) throws NoSuchAlgorithmException {
        String clientIp = request.getRemoteAddr();
        logger.info(
            "[UPLOAD] Start: filename={}, size={} bytes, clientIp={}, userAgent={}",
            file.getOriginalFilename(),
            file.getSize(),
            clientIp,
            userAgent
        );

        try {
            ResourcePack saved = service.store(file, request);
            logger.info(
                "[UPLOAD] Success: saved pack id={} ({} bytes)",
                saved.getId(),
                saved.getSize()
            );
            return ResponseEntity.status(201).body(saved);
        } catch (EOFException | ClientAbortException | SocketException e) {
            logger.warn(
                "[UPLOAD] Client aborted during upload: {} — {}",
                file.getOriginalFilename(),
                e.getMessage()
            );
            return ResponseEntity.status(204).build();
        } catch (IOException e) {
            logger.error(
                "[UPLOAD] I/O error storing file {}: {}",
                file.getOriginalFilename(),
                e.getMessage(),
                e
            );
            return ResponseEntity.status(500).build();
        } catch (RuntimeException e) {
            logger.error(
                "[UPLOAD] Unexpected runtime error: {}",
                e.getMessage(),
                e
            );
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Delete a resource pack by ID.
     *
     * @param id ID of the pack to delete
     * @return 204 if deletion successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResourcePack(@PathVariable Long id) {
        logger.debug("Deleting resource pack id={}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Trigger an asynchronous conversion job for a pack.
     *
     * @param id      pack ID
     * @param version target Minecraft version
     * @return 202 + ConversionJob info
     */
    @PostMapping("/{id}/convert")
    public ResponseEntity<ConversionJob> convert(
        @PathVariable Long id,
        @RequestParam("version") String version
    ) {
        logger.info(
            "Creating conversion job for pack={} to version={}",
            id,
            version
        );
        ConversionJob job = converterService.createJob(id, version);
        converterService.runConversion(job.getId());
        return ResponseEntity.accepted().body(job);
    }

    /**
     * Retrieve status of a conversion job.
     *
     * @param jobId conversion job ID
     * @return 200 + ConversionJob or 404 if unknown
     */
    @GetMapping("/conversions/{jobId}")
    public ResponseEntity<ConversionJob> getJob(@PathVariable Long jobId) {
        logger.debug("Fetching conversion job id={}", jobId);
        return ResponseEntity.of(conversionJobRepository.findById(jobId));
    }
}
