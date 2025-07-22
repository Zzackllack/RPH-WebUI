import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.zacklack.zacklack.config.CorsConfig;

class CorsConfigTest {
    @Test
    void corsConfigurerNotNull() {
        CorsConfig config = new CorsConfig();
        WebMvcConfigurer conf = config.corsConfigurer();
        assertNotNull(conf);
        conf.addCorsMappings(new CorsRegistry());
    }
}
