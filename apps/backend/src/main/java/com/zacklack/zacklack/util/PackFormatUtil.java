package com.zacklack.zacklack.util;

import java.util.Map;

public class PackFormatUtil {
    public static final Map<Integer, String> PACK_FORMAT_VERSION_MAP = Map.ofEntries(
        Map.entry(1, "1.6.1 - 1.8.9"),
        Map.entry(2, "1.9 - 1.10.2"),
        Map.entry(3, "1.11 - 1.12.2"),
        Map.entry(4, "1.13 - 1.14.4"),
        Map.entry(5, "1.15 - 1.16.1"),
        Map.entry(6, "1.16.2 - 1.16.5"),
        Map.entry(7, "1.17 - 1.17.1"),
        Map.entry(8, "1.18 - 1.18.2"),
        Map.entry(9, "1.19 - 1.19.2"),
        Map.entry(12, "1.19.3"),
        Map.entry(13, "1.19.4"),
        Map.entry(15, "1.20 - 1.20.1"),
        Map.entry(18, "1.20.2"),
        Map.entry(22, "1.20.3 - 1.20.4"),
        Map.entry(32, "1.20.5 - 1.20.6"),
        Map.entry(34, "1.21 - 1.21.1")
    );

    public static String getVersionForFormat(int format) {
        return PACK_FORMAT_VERSION_MAP.getOrDefault(format, "Unknown");
    }
}
