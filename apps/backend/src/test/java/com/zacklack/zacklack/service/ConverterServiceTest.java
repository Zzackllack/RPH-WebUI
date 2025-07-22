import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.agentdid127.resourcepack.Main;
import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.repository.ResourcePackRepository;
import com.zacklack.zacklack.service.ConverterService;
import com.zacklack.zacklack.service.ResourcePackService;

@ExtendWith(MockitoExtension.class)
class ConverterServiceTest {
    @TempDir
    Path tempDir;

    @Mock
    ResourcePackRepository packRepo;
    @Mock
    ConversionJobRepository jobRepo;
    @Mock
    ResourcePackService packService;

    ConverterService service;
    ResourcePack orig;
    ConversionJob job;

    @BeforeEach
    void setup() throws Exception {
        service = new ConverterService(packRepo, jobRepo, packService);
        ReflectionTestUtils.setField(service, "uploadDir", tempDir.toString());
        ReflectionTestUtils.setField(service, "defaultSourceVersion", "1.19");

        orig = new ResourcePack("orig.zip", "input.zip", 1L, "hash", LocalDateTime.now());
        ReflectionTestUtils.setField(orig, "id", 1L);
        Path input = tempDir.resolve("input.zip");
        try (var zos = new ZipOutputStream(Files.newOutputStream(input))) {
            zos.putNextEntry(new ZipEntry("pack.mcmeta"));
            zos.write("{\"pack\":{\"pack_format\":15}}".getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }
        job = new ConversionJob();
        job.setId(2L);
        job.setResourcePack(orig);
        job.setTargetVersion("1.20");
        job.setStatus("PENDING");
    }

    @Test
    void createJobCreatesPendingJob() {
        when(packRepo.findById(1L)).thenReturn(Optional.of(orig));
        when(jobRepo.save(any(ConversionJob.class))).thenAnswer(i -> i.getArgument(0));

        ConversionJob created = service.createJob(1L, "1.20");
        assertEquals("PENDING", created.getStatus());
        assertEquals("1.20", created.getTargetVersion());
        verify(jobRepo).save(created);
    }

    @Test
    void runConversionSuccess() throws Exception {
        when(jobRepo.findById(2L)).thenReturn(Optional.of(job));
        when(jobRepo.save(any(ConversionJob.class))).thenAnswer(i -> i.getArgument(0));
        when(packService.computeHash(any(Path.class))).thenReturn("hash2");

        Path convTemp = tempDir.resolve("tmp");
        Files.createDirectory(convTemp);

        try (MockedStatic<Files> filesMock = mockStatic(Files.class, CALLS_REAL_METHODS);
             MockedStatic<Main> mainMock = mockStatic(Main.class)) {
            filesMock.when(() -> Files.createTempDirectory(any(String.class))).thenReturn(convTemp);
            mainMock.when(() -> Main.main(any(String[].class))).thenAnswer(inv -> {
                Files.write(convTemp.resolve("input_converted.zip"), new byte[]{1});
                return null;
            });
            service.runConversion(2L);
        }

        assertEquals("COMPLETED", job.getStatus());
    }

    @Test
    void runConversionFailure() throws Exception {
        when(jobRepo.findById(2L)).thenReturn(Optional.of(job));
        when(jobRepo.save(any(ConversionJob.class))).thenAnswer(i -> i.getArgument(0));

        try (MockedStatic<Main> mocked = mockStatic(Main.class)) {
            mocked.when(() -> Main.main(any(String[].class))).thenThrow(new RuntimeException("fail"));
            service.runConversion(2L);
        }

        assertEquals("FAILED", job.getStatus());
        assertNotNull(job.getErrorMessage());
    }
}
