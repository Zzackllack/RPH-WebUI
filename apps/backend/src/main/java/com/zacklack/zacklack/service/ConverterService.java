package com.zacklack.zacklack.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.repository.ResourcePackRepository;
import com.agentdid127.*;

@Service
public class ConverterService {
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

    public ConversionJob createJob(Long packId, String version) {
        ResourcePack orig = packRepo.findById(packId)
            .orElseThrow(() -> new RuntimeException("Pack not found"));
        ConversionJob job = new ConversionJob();
        job.setResourcePack(orig);
        job.setTargetVersion(version);
        job.setStatus("PENDING");
        return jobRepo.save(job);
    }

    @Async
    public void runConversion(Long jobId) {
        ConversionJob job = jobRepo.findById(jobId).orElseThrow();
        job.setStatus("IN_PROGRESS");
        jobRepo.save(job);

        try {
            ResourcePack orig = job.getResourcePack();
            Path input = Path.of(uploadDir, orig.getStorageFilename());
            String ext = orig.getStorageFilename().substring(orig.getStorageFilename().lastIndexOf('.'));
            String outName = UUID.randomUUID() + ext;
            Path outPath = Path.of(uploadDir, orig.getId().toString(), job.getTargetVersion());
            Files.createDirectories(outPath);
            Path output = outPath.resolve(outName);

            // ← Call the converter
            com.agentdid127.main(new String[]{
                "-i", input.toString(),
                "-o", output.toString(),
                "-t", job.getTargetVersion()
            });

            // Store converted pack entry
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
        } catch (Exception ex) {
            job.setStatus("FAILED");
            job.setErrorMessage(ex.getMessage());
            job.setCompletedAt(LocalDateTime.now());
        }
        jobRepo.save(job);
    }
}
