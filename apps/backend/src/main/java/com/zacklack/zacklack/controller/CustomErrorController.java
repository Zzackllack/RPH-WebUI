package com.zacklack.zacklack.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Custom error controller to render a styled error page for /error.
 */
@Controller
public class CustomErrorController implements ErrorController {
    private static final Logger logger = LoggerFactory.getLogger(CustomErrorController.class);

    private final ErrorAttributes errorAttributes;

    public CustomErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    /**
     * Handle all errors and render the error.html template with details for HTML requests only.
     */
    @RequestMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView handleErrorHtml(HttpServletRequest request) {
        ServletWebRequest webRequest = new ServletWebRequest(request);
        Map<String, Object> attrs = errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.of(ErrorAttributeOptions.Include.MESSAGE));

        int status = 500;
        String error = "Unknown Error";
        String message = "An unexpected error occurred.";
        String path = (String) attrs.getOrDefault("path", request.getRequestURI());

        Object statusObj = attrs.get("status");
        if (statusObj instanceof Integer) status = (Integer) statusObj;
        Object errorObj = attrs.get("error");
        if (errorObj instanceof String) error = (String) errorObj;
        Object msgObj = attrs.get("message");
        if (msgObj instanceof String && !((String)msgObj).isBlank()) message = (String) msgObj;

        logger.warn("Custom error page: status={} error={} message={} path={}", status, error, message, path);

        ModelAndView mav = new ModelAndView("error");
        mav.addObject("status", status);
        mav.addObject("error", error);
        mav.addObject("message", message);
        mav.addObject("path", path);
        mav.setStatus(org.springframework.http.HttpStatus.valueOf(status));
        return mav;
    }

    // Optionally, handle non-HTML errors (e.g., JSON) here if needed
}
