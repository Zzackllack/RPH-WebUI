
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
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Central exception handler for upload errors and other failures.
 * Provides meaningful HTTP statuses and logs at appropriate levels.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Invalid resource pack ZIP (e.g., missing pack.mcmeta).
     * Logs the error with client context for security and debugging.
     */
    @ExceptionHandler(InvalidPackException.class)
    public ResponseEntity<String> handleInvalidPackException(InvalidPackException ex, HttpServletRequest request) {
        logger.warn("Invalid resource pack: {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(ex.getMessage());
    }

    /**
     * Handle 404 Not Found with custom HTML error page (see templates/error-404.html).
     * Logs the missing path, client IP, and user agent for audit and troubleshooting.
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ModelAndView handleNotFound(NoHandlerFoundException ex, HttpServletRequest request) {
        logger.warn("404 Not Found: path={} | IP={} | UA={}",
            request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        ModelAndView mav = new ModelAndView("error");
        mav.setStatus(HttpStatus.NOT_FOUND);
        mav.addObject("status", 404);
        mav.addObject("error", "Not Found");
        mav.addObject("message", "Sorry, the page you requested does not exist.");
        mav.addObject("path", request.getRequestURI());
        return mav;
    }


    /**
     * Handle 403 Forbidden (ServletException with Forbidden message) with custom HTML error page (see templates/error-403.html).
     * Logs the forbidden path, client IP, and user agent for audit and troubleshooting.
     */
    @ExceptionHandler(jakarta.servlet.ServletException.class)
    public ModelAndView handleServletException(jakarta.servlet.ServletException ex, HttpServletRequest request) throws jakarta.servlet.ServletException {
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("forbidden")) {
            logger.warn("403 Forbidden: path={} | IP={} | UA={}",
                request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
            ModelAndView mav = new ModelAndView("error");
            mav.setStatus(HttpStatus.FORBIDDEN);
            mav.addObject("status", 403);
            mav.addObject("error", "Forbidden");
            mav.addObject("message", "You are not allowed to view this page or resource.");
            mav.addObject("path", request.getRequestURI());
            return mav;
        }
        throw ex;
    }

    /**
     * Client closed the connection mid-upload (EOFException).
     * Logs the event for network troubleshooting and user experience monitoring.
     */
    @ExceptionHandler(EOFException.class)
    public ResponseEntity<String> handleEOFException(EOFException ex, HttpServletRequest request) {
        logger.warn("Client closed connection (EOFException): {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Client closed connection during upload");
    }

    /**
     * Client forcibly aborted the connection (ClientAbortException).
     * Logs the event for network troubleshooting and user experience monitoring.
     */
    @ExceptionHandler(ClientAbortException.class)
    public ResponseEntity<String> handleClientAbortException(ClientAbortException ex, HttpServletRequest request) {
        logger.warn("Client aborted connection: {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Client aborted connection");
    }

    /**
     * Underlying socket error during upload (SocketException).
     * Logs the event for network troubleshooting and user experience monitoring.
     */
    @ExceptionHandler(SocketException.class)
    public ResponseEntity<String> handleSocketException(SocketException ex, HttpServletRequest request) {
        logger.warn("SocketException: {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body("Socket closed during upload");
    }

    /**
     * File exceeds configured max size (MaxUploadSizeExceededException).
     * Logs the event with client context for security and debugging.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        logger.error("MaxUploadSizeExceeded: {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                             .body("File too large! Max allowed size: " + ex.getMaxUploadSize());
    }

    /**
     * Catch-all for uncaught exceptions.
     * Logs the error with full context and returns a generic error page or message.
     * If the request expects HTML, returns a styled error page (see templates/error.html).
     */
    @ExceptionHandler(Exception.class)
    public Object handleOtherExceptions(Exception ex, HttpServletRequest request) {
        logger.error("Unhandled exception: {} | path={} | IP={} | UA={}",
            ex.getMessage(), request.getRequestURI(), request.getRemoteAddr(), request.getHeader("User-Agent"), ex);
        // If the request expects HTML, return error page, else JSON/text
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("text/html")) {
            ModelAndView mav = new ModelAndView("error");
            mav.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            mav.addObject("status", 500);
            mav.addObject("error", "Internal Server Error");
            mav.addObject("message", ex.getMessage());
            mav.addObject("path", request.getRequestURI());
            return mav;
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Internal server error: " + ex.getMessage());
    }
}
