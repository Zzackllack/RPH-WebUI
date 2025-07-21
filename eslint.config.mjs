
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

// ESLint Flat Config for Monorepo (2025 best practices)
// See https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/
export default [
  // Global ignores for build and deployment folders
  {
    ignores: [
      "**/.next/**",
      "**/.open-next/**",
      "**/.wrangler/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/static/**",
    ],
  },
  // TypeScript + React config for source files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      react: pluginReact,
      ts: tseslint,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./apps/frontend/tsconfig.json"],
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Add recommended rules for TypeScript and React
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      // Disable legacy rule for React 17+
      "react/react-in-jsx-scope": "off",
    },
  },
];
