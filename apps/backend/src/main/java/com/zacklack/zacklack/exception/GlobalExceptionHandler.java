package com.zacklack.zacklack.exception;

import java.io.EOFException;
import java.net.SocketException;
import jakarta.servlet.http.HttpServletRequest;

import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Wird geworfen, wenn der Client die Verbindung während des Lesens abbricht (z.B. Browser-Tab geschlossen).
     * Das ist kein echter Serverfehler, sondern ein normaler Abbruch durch den Client.
     */
    @ExceptionHandler(EOFException.class)
    public ResponseEntity<String> handleEOFException(EOFException ex, HttpServletRequest request) {
        logger.warn("[UPLOAD] Client closed connection (EOFException): {} | IP: {} | UA: {}", ex.getMessage(),
            request.getRemoteAddr(), request.getHeader("User-Agent"));
        // Keine Fehlerantwort nötig, Client ist schon weg
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Client closed connection (EOFException)");
    }
    @ExceptionHandler(ClientAbortException.class)
    public ResponseEntity<String> handleClientAbortException(ClientAbortException ex, HttpServletRequest request) {
        logger.warn("[UPLOAD] Client aborted connection: {} | IP: {} | UA: {}", ex.getMessage(),
            request.getRemoteAddr(), request.getHeader("User-Agent"));
        // Keine Fehlerantwort nötig, Client ist schon weg
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Client aborted connection");
    }

    /**
     * SocketException tritt auf, wenn z.B. ein Reset durch Peer oder Broken Pipe kommt.
     */
    @ExceptionHandler(SocketException.class)
    public ResponseEntity<String> handleSocketException(SocketException ex, HttpServletRequest request) {
        logger.warn("[UPLOAD] SocketException: {} | IP: {} | UA: {}", ex.getMessage(),
            request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Client socket closed (SocketException)");
    }
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        logger.error("[UPLOAD] MaxUploadSizeExceededException: {} | IP: {} | UA: {}", ex.getMessage(),
            request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body("File too large! Max allowed size: " + ex.getMaxUploadSize());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex, HttpServletRequest request) {
        logger.error("[UPLOAD] Unhandled exception: {} | IP: {} | UA: {}", ex.getMessage(),
            request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error: " + ex.getMessage());
    }
}
