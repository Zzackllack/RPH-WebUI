import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.zacklack.zacklack.controller.StatusController;

class StatusControllerTest {
    @Test
    void statusOk() {
        StatusController c = new StatusController();
        ResponseEntity<java.util.Map<String,String>> resp = c.status();
        assertEquals("ok", resp.getBody().get("status"));
    }
}
