package com.zacklack.zacklack.exception;

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

    @ExceptionHandler(ClientAbortException.class)
    public ResponseEntity<String> handleClientAbortException(ClientAbortException ex) {
        logger.warn("[UPLOAD] Client aborted connection: {}", ex.getMessage());
        // Keine Fehlerantwort nötig, Client ist schon weg
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Client aborted connection");
    }
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        logger.error("[UPLOAD] MaxUploadSizeExceededException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body("File too large! Max allowed size: " + ex.getMaxUploadSize());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex) {
        logger.error("[UPLOAD] Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error: " + ex.getMessage());
    }
}
