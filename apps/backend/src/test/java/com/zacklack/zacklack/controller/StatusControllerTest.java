package com.zacklack.zacklack.controller;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

class StatusControllerTest {
    @SuppressWarnings("null")
    @Test
    void statusOk() {
        StatusController c = new StatusController();
        ResponseEntity<java.util.Map<String,String>> resp = c.status();
        assertNotNull(resp.getBody(), "Response body should not be null");
        if (resp.getBody() != null) {
            assertEquals("ok", resp.getBody().get("status"));
        }
    }
}
