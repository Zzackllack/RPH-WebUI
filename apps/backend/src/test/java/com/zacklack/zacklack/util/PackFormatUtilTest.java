package com.zacklack.zacklack.util;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class PackFormatUtilTest {
    @Test
    void knownFormatReturnsVersion() {
        assertEquals("1.20 - 1.20.1", PackFormatUtil.getVersionForFormat(15));
    }

    @Test
    void unknownFormatReturnsUnknown() {
        assertEquals("Unknown", PackFormatUtil.getVersionForFormat(999));
    }
}
