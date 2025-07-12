package com.zacklack.zacklack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  // ← enable @Async methods
public class RphBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(RphBackendApplication.class, args);
    }
}
