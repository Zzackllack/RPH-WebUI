package com.zacklack.zacklack.model;

import java.time.LocalDateTime;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ModelTest {
    @Test
    void resourcePackGettersAndSetters() {
        ResourcePack rp = new ResourcePack("orig.zip", "stored.zip", 2L, "hash", LocalDateTime.now());
        rp.setPackFormat(15);
        rp.setMinecraftVersion("v");
        rp.setConverted(true);
        rp.setTargetVersion("1.20");
        rp.setConversions(List.of());
        assertEquals("stored.zip", rp.getStorageFilename());
        assertTrue(rp.isConverted());
    }

    @Test
    void conversionJobGettersSetters() {
        ConversionJob job = new ConversionJob();
        job.setId(1L);
        job.setTargetVersion("1.20");
        job.setStatus("PENDING");
        job.setConsoleLog("log");
        job.setErrorMessage("err");
        assertEquals("PENDING", job.getStatus());
        assertEquals("log", job.getConsoleLog());
    }
}
