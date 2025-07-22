package com.zacklack.zacklack.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.zacklack.zacklack.exception.InvalidPackException;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ResourcePackRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ResourcePackServiceTest {

    @TempDir
    Path tempDir;

    @Mock
    ResourcePackRepository repo;

    ResourcePackService service;

    @BeforeEach
    @SuppressWarnings("unused")
    void setup() throws Exception {
        service = new ResourcePackService(repo);
        ReflectionTestUtils.setField(service, "uploadDir", tempDir.toString());
        service.init();
    }

    private MockMultipartFile createZip(boolean withMeta) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(bos)) {
            if (withMeta) {
                zos.putNextEntry(new ZipEntry("pack.mcmeta"));
                zos.write("{\"pack\":{\"pack_format\":15}}".getBytes(StandardCharsets.UTF_8));
                zos.closeEntry();
            }
            zos.putNextEntry(new ZipEntry("dummy.txt"));
            zos.write("hello".getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }
        return new MockMultipartFile("file","pack.zip","application/zip",bos.toByteArray());
    }

    @Test
    void storeAndComputeHash() throws Exception {
        when(repo.save(any(ResourcePack.class))).thenAnswer(invocation -> invocation.getArgument(0));
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getRemoteAddr()).thenReturn("127.0.0.1");
        when(req.getHeader("User-Agent")).thenReturn("JUnit");

        ResourcePack rp = service.store(createZip(true), req);
        assertNotNull(rp.getStorageFilename());
        assertEquals("1.20 - 1.20.1", rp.getMinecraftVersion());
        Path stored = tempDir.resolve(rp.getStorageFilename());
        assertTrue(Files.exists(stored));
        String hash = service.computeHash(stored);
        assertEquals(hash, rp.getFileHash());
    }

    @Test
    void storeInvalidZipThrows() throws Exception {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getRemoteAddr()).thenReturn("127.0.0.1");
        when(req.getHeader("User-Agent")).thenReturn("JUnit");
        InvalidPackException thrown = assertThrows(InvalidPackException.class, () -> service.store(createZip(false), req));
        assertNotNull(thrown.getMessage());
    }

    @Test
    void deleteRemovesFileAndEntity() throws Exception {
        ResourcePack rp = new ResourcePack("a.zip", "stored.zip", 1L, "hash", LocalDateTime.now());
        ReflectionTestUtils.setField(rp, "id", 1L);
        Path file = tempDir.resolve("stored.zip");
        Files.writeString(file, "data");
        when(repo.findById(1L)).thenReturn(Optional.of(rp));

        service.delete(1L);

        assertFalse(Files.exists(file));
        verify(repo).deleteById(1L);
    }

    @Test
    void findMethodsDelegateToRepository() {
        when(repo.findAll()).thenReturn(List.of());
        when(repo.findByConvertedFalse()).thenReturn(List.of());
        when(repo.findByOriginalPackId(1L)).thenReturn(List.of());
        when(repo.findById(1L)).thenReturn(Optional.of(new ResourcePack()));

        service.findAll();
        service.findAllOriginals();
        service.findConversions(1L);
        service.findById(1L);
        service.findHashById(1L);

        verify(repo).findAll();
        verify(repo).findByConvertedFalse();
        verify(repo).findByOriginalPackId(1L);
        verify(repo, times(2)).findById(1L); // findById + findHashById
    }
}
