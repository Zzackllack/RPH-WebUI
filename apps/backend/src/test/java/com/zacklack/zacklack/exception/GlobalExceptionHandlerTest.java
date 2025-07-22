package com.zacklack.zacklack.exception;

import java.util.Objects;

import org.apache.catalina.connector.ClientAbortException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

class GlobalExceptionHandlerTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final HttpServletRequest request = mock(HttpServletRequest.class);

    @Test
    void invalidPack() {
        ResponseEntity<String> resp = handler.handleInvalidPackException(new InvalidPackException("bad"), request);
        assertEquals(400, resp.getStatusCode().value());
    }

    @Test
    void notFound() {
        NoHandlerFoundException ex = new NoHandlerFoundException("GET", "/x", new HttpHeaders());
        ModelAndView mv = handler.handleNotFound(ex, request);
        HttpStatusCode status = Objects.requireNonNull(mv.getStatus(), "Status should not be null");
        assertEquals(404, status.value());
    }

    @Test
    void servletForbidden() throws Exception {
        ModelAndView mv = handler.handleServletException(new ServletException("Forbidden"), request);
        HttpStatusCode status = Objects.requireNonNull(mv.getStatus(), "Status should not be null");
        assertEquals(403, status.value());
    }

    @Test
    void servletOtherRethrows() {
        ServletException thrown = assertThrows(ServletException.class,
            () -> handler.handleServletException(new ServletException("other"), request));
        assertEquals("other", thrown.getMessage());
    }

    @Test
    void eofException() {
        ResponseEntity<String> resp = handler.handleEOFException(new java.io.EOFException(), request);
        assertEquals(204, resp.getStatusCode().value());
    }

    @Test
    void clientAbort() {
        ResponseEntity<String> resp = handler.handleClientAbortException(new ClientAbortException(), request);
        assertEquals(204, resp.getStatusCode().value());
    }

    @Test
    void socketException() {
        ResponseEntity<String> resp = handler.handleSocketException(new java.net.SocketException(), request);
        assertEquals(204, resp.getStatusCode().value());
    }

    @Test
    void maxSize() {
        ResponseEntity<String> resp = handler.handleMaxSizeException(new MaxUploadSizeExceededException(1L), request);
        assertEquals(413, resp.getStatusCode().value());
    }

    @Test
    void otherHtml() {
        when(request.getHeader("Accept")).thenReturn("text/html");
        ModelAndView mv = (ModelAndView) handler.handleOtherExceptions(new RuntimeException("err"), request);
        HttpStatusCode status = Objects.requireNonNull(mv.getStatus(), "Status should not be null");
        assertEquals(500, status.value());
    }

    @Test
    void otherJson() {
        when(request.getHeader("Accept")).thenReturn("application/json");
        ResponseEntity<?> resp = (ResponseEntity<?>) handler.handleOtherExceptions(new RuntimeException("err"), request);
        assertEquals(500, resp.getStatusCode().value());
    }
}
