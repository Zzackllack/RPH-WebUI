package com.zacklack.zacklack.service;

import com.agentdid127.resourcepack.Main;
import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.repository.ResourcePackRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Manages creation and execution of asynchronous conversion jobs.
 */
@Service
public class ConverterService {

    private static final Logger logger = LoggerFactory.getLogger(
        ConverterService.class
    );

    private final ResourcePackRepository packRepo;
    private final ConversionJobRepository jobRepo;
    private final ResourcePackService packService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${conversion.default-source-version:1.19}")
    private String defaultSourceVersion;

    public ConverterService(
        ResourcePackRepository packRepo,
        ConversionJobRepository jobRepo,
        ResourcePackService packService
    ) {
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
        ResourcePack orig = packRepo
            .findById(packId)
            .orElseThrow(() ->
                new RuntimeException("Pack not found: " + packId)
            );
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
            Path inputFile = Path.of(uploadDir, orig.getStorageFilename());
            String ext = orig
                .getStorageFilename()
                .substring(orig.getStorageFilename().lastIndexOf('.'));
            Path outDir = Path.of(
                uploadDir,
                orig.getId().toString(),
                job.getTargetVersion()
            );
            Files.createDirectories(outDir);
            String base = orig.getOriginalFilename();
            if (base.contains("/")) base = base.substring(
                base.lastIndexOf('/') + 1
            );
            if (base.contains(".")) base = base.substring(
                0,
                base.lastIndexOf('.')
            );
            String outName = base + "_to_" + job.getTargetVersion() + ext;
            Path output = outDir.resolve(outName);

            // ResourcePackConverter requires a directory input; copy the pack
            // into a temporary directory for conversion.
            Path tempDir = Files.createTempDirectory("rpcv-");
            Path tempInput = tempDir.resolve(
                Path.of(orig.getStorageFilename()).getFileName()
            );
            Files.copy(inputFile, tempInput);

            String sourceVersion = defaultSourceVersion;
            if (
                orig.getMinecraftVersion() != null &&
                !orig.getMinecraftVersion().isBlank()
            ) {
                sourceVersion = orig.getMinecraftVersion().split(" ")[0];
            }

            logger.info(
                "Converting pack={} from version={} to version={} output={}",
                orig.getId(),
                sourceVersion,
                job.getTargetVersion(),
                output
            );
            java.io.ByteArrayOutputStream baos =
                new java.io.ByteArrayOutputStream();
            java.io.PrintStream ps = new java.io.PrintStream(baos);
            java.io.PrintStream oldOut = System.out;
            java.io.PrintStream oldErr = System.err;
            System.setOut(ps);
            System.setErr(ps);
            try {
                Main.main(
                    new String[] {
                        "-i",
                        tempDir.toString(),
                        "--from",
                        sourceVersion,
                        "--to",
                        job.getTargetVersion(),
                        "--debug",
                        "true",
                    }
                );
            } finally {
                System.setOut(oldOut);
                System.setErr(oldErr);
                job.setConsoleLog(
                    baos.toString(java.nio.charset.StandardCharsets.UTF_8)
                );
            }

            // Locate the converted file produced by the converter. Because the
            // input file in the temporary directory uses a generated name, the
            // converter output will also use that name. We simply search the
            // temp directory for the first file ending with "_converted" and
            // the same extension.
            Path converted = null;
            try (java.util.stream.Stream<Path> files = Files.list(tempDir)) {
                converted = files
                    .filter(p ->
                        p.getFileName().toString().endsWith("_converted" + ext)
                    )
                    .findFirst()
                    .orElse(null);
            }

            if (converted != null && Files.exists(converted)) {
                Files.move(
                    converted,
                    output,
                    StandardCopyOption.REPLACE_EXISTING
                );
            } else {
                throw new java.io.IOException(
                    "Converted file not found in " + tempDir
                );
            }

            // Cleanup temporary directory
            Files.deleteIfExists(tempInput);
            Files.deleteIfExists(tempDir);

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
                packService.populatePackMetadata(conv, output);
                packRepo.save(conv);

                job.setStatus("COMPLETED");
                job.setCompletedAt(LocalDateTime.now());
                logger.info("Conversion job={} completed successfully", jobId);
            } catch (java.security.NoSuchAlgorithmException ex) {
                job.setStatus("FAILED");
                job.setErrorMessage("Hashing failed: " + ex.getMessage());
                job.setCompletedAt(LocalDateTime.now());
                logger.error(
                    "Conversion job={} failed during hashing: {}",
                    jobId,
                    ex.getMessage(),
                    ex
                );
            }
        } catch (java.io.IOException | java.lang.RuntimeException ex) {
            job.setStatus("FAILED");
            job.setErrorMessage(ex.getMessage());
            job.setCompletedAt(LocalDateTime.now());
            logger.error(
                "Conversion job={} failed: {}",
                jobId,
                ex.getMessage(),
                ex
            );
        }
        jobRepo.save(job);
    }
}
