package com.zacklack.zacklack;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableAsync // ← enable @Async methods
public class RphBackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(RphBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(RphBackendApplication.class, args);
    }

    /**
     * Print system info for debugging on startup.
     */
    @PostConstruct
    public void printSystemInfo() {
        logger.info("--- System Info ---");
        String osName = System.getProperty("os.name");
        String osVersion = System.getProperty("os.version");
        String osArch = System.getProperty("os.arch");
        logger.info("OS: {} {} {}", osName, osVersion, osArch);
        if (osArch != null && osArch.toLowerCase().contains("arm")) {
            logger.warn("WARNING: ARM processor detected. This application is NOT tested or officially supported on ARM architectures.");
        }
        if (osName != null && osName.toLowerCase().contains("windows")) {
            logger.warn("NOTE: This application is only tested and recommended to run on Linux servers, macOS, or Unix-like systems. Windows is not officially supported for production.");
        }
        logger.info("Java Version: {}", System.getProperty("java.version"));
        logger.info("User: {}", System.getProperty("user.name"));
        logger.info("User Home: {}", System.getProperty("user.home"));
        logger.info("User Dir: {}", System.getProperty("user.dir"));
        logger.info("File Encoding: {}", System.getProperty("file.encoding"));
        logger.info("Timezone: {}", System.getProperty("user.timezone"));
        logger.info("Locale: {}", System.getProperty("user.language") + "-" + System.getProperty("user.country"));
        logger.info("Available processors (cores): {}", Runtime.getRuntime().availableProcessors());
        logger.info("Max memory (MB): {}", Runtime.getRuntime().maxMemory() / (1024 * 1024));
        logger.info("Total memory (MB): {}", Runtime.getRuntime().totalMemory() / (1024 * 1024));
        logger.info("Free memory (MB): {}", Runtime.getRuntime().freeMemory() / (1024 * 1024));
        logger.info("Classpath: {}", System.getProperty("java.class.path"));
        logger.info("PID: {}", ProcessHandle.current().pid());
        logger.info("Spring profiles active: {}", System.getProperty("spring.profiles.active"));
        logger.info("Java library path: {}", System.getProperty("java.library.path"));
        logger.info("Temp dir: {}", System.getProperty("java.io.tmpdir"));
        logger.info("Host name: {}", System.getenv("HOSTNAME") != null ? System.getenv("HOSTNAME") : System.getenv("COMPUTERNAME"));
        logger.info("Current thread: {}", Thread.currentThread().getName());
        logger.info("Current working directory files: {}", java.util.Arrays.toString(new java.io.File(System.getProperty("user.dir")).list()));
        try {
            logger.info("Network interfaces: {}", java.net.NetworkInterface.getNetworkInterfaces().hasMoreElements() ? "Available" : "None");
        } catch (java.net.SocketException e) {
            logger.warn("Network interfaces: Unable to determine (SocketException: {})", e.getMessage());
        }
        logger.info("Active JVM arguments: {}", java.lang.management.ManagementFactory.getRuntimeMXBean().getInputArguments());
        logger.info("Uptime (ms): {}", java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime());
        logger.info("Loaded classes: {}", java.lang.management.ManagementFactory.getClassLoadingMXBean().getLoadedClassCount());
        logger.info("-------------------");
    }
}
