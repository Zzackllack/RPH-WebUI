
package com.zacklack.zacklack.exception;

import java.io.EOFException;
import java.net.SocketException;

import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Central exception handler for upload errors and other failures.
 * Provides meaningful HTTP statuses and logs at appropriate levels.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Invalid resource pack ZIP (e.g., missing pack.mcmeta). */
    @ExceptionHandler(InvalidPackException.class)
    public ResponseEntity<String> handleInvalidPackException(InvalidPackException ex, HttpServletRequest request) {
        logger.warn("Invalid resource pack: {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(ex.getMessage());
    }

    /** Client closed the connection mid-upload. */
    @ExceptionHandler(EOFException.class)
    public ResponseEntity<String> handleEOFException(EOFException ex, HttpServletRequest request) {
        logger.warn("Client closed connection (EOFException): {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Client closed connection during upload");
    }

    /** Client forcibly aborted the connection. */
    @ExceptionHandler(ClientAbortException.class)
    public ResponseEntity<String> handleClientAbortException(ClientAbortException ex, HttpServletRequest request) {
        logger.warn("Client aborted connection: {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Client aborted connection");
    }

    /** Underlying socket error during upload. */
    @ExceptionHandler(SocketException.class)
    public ResponseEntity<String> handleSocketException(SocketException ex, HttpServletRequest request) {
        logger.warn("SocketException: {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Socket closed during upload");
    }

    /** File exceeds configured max size. */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        logger.error("MaxUploadSizeExceeded: {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                             .body("File too large! Max allowed size: " + ex.getMaxUploadSize());
    }

    /** Catch-all for uncaught exceptions. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex, HttpServletRequest request) {
        logger.error("Unhandled exception: {} | IP={} | UA={}",
            ex.getMessage(), request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Internal server error: " + ex.getMessage());
    }
}
