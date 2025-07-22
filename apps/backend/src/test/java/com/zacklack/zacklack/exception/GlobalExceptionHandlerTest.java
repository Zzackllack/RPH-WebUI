import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.ServletException;

import org.apache.catalina.connector.ClientAbortException;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.zacklack.zacklack.exception.GlobalExceptionHandler;
import com.zacklack.zacklack.exception.InvalidPackException;

class GlobalExceptionHandlerTest {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    HttpServletRequest request = mock(HttpServletRequest.class);

    @Test
    void invalidPack() {
        ResponseEntity<String> resp = handler.handleInvalidPackException(new InvalidPackException("bad"), request);
        assertEquals(400, resp.getStatusCodeValue());
    }

    @Test
    void notFound() {
        ModelAndView mv = handler.handleNotFound(new NoHandlerFoundException("GET","/x",null), request);
        assertEquals(404, mv.getStatus().value());
    }

    @Test
    void servletForbidden() throws Exception {
        ModelAndView mv = handler.handleServletException(new ServletException("Forbidden"), request);
        assertEquals(403, mv.getStatus().value());
    }

    @Test
    void servletOtherRethrows() {
        assertThrows(ServletException.class, () -> handler.handleServletException(new ServletException("other"), request));
    }

    @Test
    void eofException() {
        ResponseEntity<String> resp = handler.handleEOFException(new java.io.EOFException(), request);
        assertEquals(204, resp.getStatusCodeValue());
    }

    @Test
    void clientAbort() {
        ResponseEntity<String> resp = handler.handleClientAbortException(new ClientAbortException(), request);
        assertEquals(204, resp.getStatusCodeValue());
    }

    @Test
    void socketException() {
        ResponseEntity<String> resp = handler.handleSocketException(new java.net.SocketException(), request);
        assertEquals(204, resp.getStatusCodeValue());
    }

    @Test
    void maxSize() {
        ResponseEntity<String> resp = handler.handleMaxSizeException(new MaxUploadSizeExceededException(1L), request);
        assertEquals(413, resp.getStatusCodeValue());
    }

    @Test
    void otherHtml() {
        when(request.getHeader("Accept")).thenReturn("text/html");
        ModelAndView mv = (ModelAndView) handler.handleOtherExceptions(new RuntimeException("err"), request);
        assertEquals(500, mv.getStatus().value());
    }

    @Test
    void otherJson() {
        when(request.getHeader("Accept")).thenReturn("application/json");
        ResponseEntity<?> resp = (ResponseEntity<?>) handler.handleOtherExceptions(new RuntimeException("err"), request);
        assertEquals(500, resp.getStatusCodeValue());
    }
}
