package com.zacklack.zacklack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration to allow front-end applications (e.g. React on localhost:3000),
 * all origins, *.zacklack.de domains, and all *.workers.dev domains (including subdomains)
 * to call our REST APIs under /api/**.
 */
@Configuration
public class CorsConfig {

    /**
     * Define CORS mappings for all API endpoints.
     *
     * @return WebMvcConfigurer with CORS settings applied
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(
                @org.springframework.lang.NonNull CorsRegistry registry
            ) {
                registry
                    .addMapping("/api/**")
                    .allowedOriginPatterns(
                        "*",
                        "*.zacklack.de",
                        "https://*.zacklack.de",
                        "http://*.zacklack.de",
                        "*.workers.dev",
                        "https://*.workers.dev",
                        "http://*.workers.dev"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
