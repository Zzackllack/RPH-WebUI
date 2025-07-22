import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.ModelAndView;

import com.zacklack.zacklack.controller.CustomErrorController;

class CustomErrorControllerTest {
    @Test
    void handleErrorHtml() {
        ErrorAttributes attrs = mock(ErrorAttributes.class);
        when(attrs.getErrorAttributes(any(ServletWebRequest.class), any(ErrorAttributeOptions.class)))
            .thenReturn(Map.of("status", 404, "error", "Not Found", "message", "msg", "path", "/bad"));
        CustomErrorController c = new CustomErrorController(attrs);
        HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        ModelAndView mv = c.handleErrorHtml(req);
        assertEquals("error", mv.getViewName());
        assertEquals(404, mv.getModel().get("status"));
    }
}
