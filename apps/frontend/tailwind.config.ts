import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        minecraft: {
          grass: {
            light: "#7CB342",
            DEFAULT: "#689F38",
            dark: "#558B2F",
          },
          dirt: {
            light: "#8D6E63",
            DEFAULT: "#795548",
            dark: "#5D4037",
          },
          stone: {
            light: "#90A4AE",
            DEFAULT: "#607D8B",
            dark: "#455A64",
          },
          wood: {
            light: "#A1887F",
            DEFAULT: "#8D6E63",
            dark: "#6D4C41",
          },
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        minecraft: ["'Press Start 2P'", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
