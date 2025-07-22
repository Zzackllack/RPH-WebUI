import org.junit.jupiter.api.Test;

import com.zacklack.zacklack.RphBackendApplication;

class RphBackendApplicationSystemInfoTest {
    @Test
    void printSystemInfoRuns() {
        new RphBackendApplication().printSystemInfo();
    }
}
