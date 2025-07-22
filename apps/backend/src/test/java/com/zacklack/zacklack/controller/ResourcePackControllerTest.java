package com.zacklack.zacklack.controller;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import org.mockito.Mockito;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import com.zacklack.zacklack.model.ConversionJob;
import com.zacklack.zacklack.model.ResourcePack;
import com.zacklack.zacklack.repository.ConversionJobRepository;
import com.zacklack.zacklack.service.ConverterService;
import com.zacklack.zacklack.service.ResourcePackService;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
class ResourcePackControllerTest {

    @Mock ResourcePackService service;
    @Mock ConverterService converterService;
    @Mock ConversionJobRepository jobRepo;

    ResourcePackController controller;

    @BeforeEach
    @SuppressWarnings("unused")
    void setup() {
        controller = new ResourcePackController(service, converterService, jobRepo);
    }

    @Test
    void getAllPacks() {
        List<ResourcePack> list = List.of(new ResourcePack());
        when(service.findAllOriginals()).thenReturn(list);
        assertEquals(list, controller.getAllPacks());
    }

    @Test
    void getPackNotFound() {
        when(service.findById(1L)).thenThrow(new RuntimeException());
        assertTrue(controller.getPack(1L).getStatusCode().is4xxClientError());
    }

    @Test
    void getHash() {
        when(service.findHashById(1L)).thenReturn("abc");
        assertEquals("abc", controller.getHash(1L).getBody());
        when(service.findHashById(2L)).thenThrow(new RuntimeException());
        assertEquals(404, controller.getHash(2L).getStatusCode().value());
    }

    private MockMultipartFile zip() throws Exception {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(bos)) {
            zos.putNextEntry(new ZipEntry("pack.mcmeta"));
            zos.write("{}".getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }
        return new MockMultipartFile("file","p.zip","application/zip", bos.toByteArray());
    }

    @Test
    void uploadPack() throws Exception {
        ResourcePack rp = new ResourcePack();
        when(service.store(any(), any())).thenReturn(rp);
        HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        ResponseEntity<ResourcePack> resp = controller.uploadPack(zip(), req, null);
        assertEquals(201, resp.getStatusCode().value());
        assertSame(rp, resp.getBody());
    }

    @Test
    void deletePack() {
        ResponseEntity<Void> resp = controller.deleteResourcePack(3L);
        assertEquals(204, resp.getStatusCode().value());
        verify(service).delete(3L);
    }

    @Test
    void convert() {
        ConversionJob job = new ConversionJob();
        when(converterService.createJob(1L, "1.20")).thenReturn(job);
        ResponseEntity<ConversionJob> resp = controller.convert(1L, "1.20");
        assertEquals(202, resp.getStatusCode().value());
        verify(converterService).runConversion(job.getId());
    }

    @Test
    void getJob() {
        ConversionJob job = new ConversionJob();
        when(jobRepo.findById(5L)).thenReturn(Optional.of(job));
        assertSame(job, controller.getJob(5L).getBody());
        when(jobRepo.findById(6L)).thenReturn(Optional.empty());
        assertEquals(404, controller.getJob(6L).getStatusCode().value());
    }
}
