"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";

interface ThemeContextType {
    theme: "dark";
    toggleTheme: () => void; // no‐op
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Always add "dark" class to <html>
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    const toggleTheme = () => {
        // no-op
    };

    return (
        <ThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
