package com.zacklack.zacklack.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.agentdid127.resourcepack.Main;
import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.repository.ResourcePackRepository;

/**
 * Manages creation and execution of asynchronous conversion jobs.
 */
@Service
public class ConverterService {
    private static final Logger logger = LoggerFactory.getLogger(ConverterService.class);

    private final ResourcePackRepository packRepo;
    private final ConversionJobRepository jobRepo;
    private final ResourcePackService packService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ConverterService(ResourcePackRepository packRepo,
                            ConversionJobRepository jobRepo,
                            ResourcePackService packService) {
        this.packRepo = packRepo;
        this.jobRepo = jobRepo;
        this.packService = packService;
    }

    /**
     * Create a new ConversionJob in PENDING state.
     *
     * @param packId  ID of the original ResourcePack
     * @param version target Minecraft version
     * @return saved ConversionJob entity
     */
    public ConversionJob createJob(Long packId, String version) {
        logger.debug("Creating job (pack={}, version={})", packId, version);
        ResourcePack orig = packRepo.findById(packId)
            .orElseThrow(() -> new RuntimeException("Pack not found: " + packId));
        ConversionJob job = new ConversionJob();
        job.setResourcePack(orig);
        job.setTargetVersion(version);
        job.setStatus("PENDING");
        ConversionJob saved = jobRepo.save(job);
        logger.info("Saved new job id={} for pack={}", saved.getId(), packId);
        return saved;
    }

    /**
     * Run the conversion in a background thread.
     *
     * @param jobId ID of the ConversionJob to execute
     */
    @Async
    public void runConversion(Long jobId) {
        logger.debug("Starting conversion for job={}", jobId);
        ConversionJob job = jobRepo.findById(jobId).orElseThrow();
        job.setStatus("IN_PROGRESS");
        jobRepo.save(job);

        try {
            ResourcePack orig = job.getResourcePack();
            Path input = Path.of(uploadDir, orig.getStorageFilename());
            String ext = orig.getStorageFilename().substring(orig.getStorageFilename().lastIndexOf('.'));
            Path outDir = Path.of(uploadDir, orig.getId().toString(), job.getTargetVersion());
            Files.createDirectories(outDir);
            String outName = UUID.randomUUID() + ext;
            Path output = outDir.resolve(outName);

            logger.info("Converting pack={} to version={} output={}", orig.getId(), job.getTargetVersion(), output);
            Main.main(new String[]{
                "-i", input.toString(),
                "-o", output.toString(),
                "-t", job.getTargetVersion()
            });

            try {
                ResourcePack conv = new ResourcePack(
                    orig.getOriginalFilename(),
                    orig.getId() + "/" + job.getTargetVersion() + "/" + outName,
                    Files.size(output),
                    packService.computeHash(output),
                    LocalDateTime.now()
                );
                conv.setConverted(true);
                conv.setOriginalPack(orig);
                conv.setTargetVersion(job.getTargetVersion());
                packRepo.save(conv);

                job.setStatus("COMPLETED");
                job.setCompletedAt(LocalDateTime.now());
                logger.info("Conversion job={} completed successfully", jobId);
            } catch (java.security.NoSuchAlgorithmException ex) {
                job.setStatus("FAILED");
                job.setErrorMessage("Hashing failed: " + ex.getMessage());
                job.setCompletedAt(LocalDateTime.now());
                logger.error("Conversion job={} failed during hashing: {}", jobId, ex.getMessage(), ex);
            }

        } catch (java.io.IOException | java.lang.RuntimeException ex) {
            job.setStatus("FAILED");
            job.setErrorMessage(ex.getMessage());
            job.setCompletedAt(LocalDateTime.now());
            logger.error("Conversion job={} failed: {}", jobId, ex.getMessage(), ex);
        }
        jobRepo.save(job);
    }
}
