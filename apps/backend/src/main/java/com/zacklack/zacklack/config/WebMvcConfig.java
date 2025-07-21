package com.zacklack.zacklack.config;

import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Static resource handler configuration.
 * Serves files under 'file.upload-dir' via '/uploads/**' URL path.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Map requests to '/uploads/**' to serve files from the local filesystem.
     *
     * @param registry ResourceHandlerRegistry to configure handlers
     */
    @Override
    public void addResourceHandlers(
        @org.springframework.lang.NonNull ResourceHandlerRegistry registry
    ) {
        String absolutePath = Paths.get(uploadDir)
            .toAbsolutePath()
            .toUri()
            .toString();

        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations(absolutePath)
            .setCachePeriod(3600)
            .resourceChain(true);
    }
}
