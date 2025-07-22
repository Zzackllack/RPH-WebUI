import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.context.ApplicationContext;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import com.zacklack.zacklack.config.WebMvcConfig;

import jakarta.servlet.ServletContext;

class WebMvcConfigTest {
    @TempDir
    java.nio.file.Path tempDir;

    @Test
    void addResourceHandlers() {
        WebMvcConfig cfg = new WebMvcConfig();
        org.springframework.test.util.ReflectionTestUtils.setField(cfg, "uploadDir", tempDir.toString());
        ApplicationContext ctx = org.mockito.Mockito.mock(ApplicationContext.class);
        ServletContext sc = org.mockito.Mockito.mock(ServletContext.class);
        ResourceHandlerRegistry reg = new ResourceHandlerRegistry(ctx, sc);
        cfg.addResourceHandlers(reg);
    }
}
