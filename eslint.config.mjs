
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

// ESLint Flat Config for Monorepo
// See https://eslint.org/docs/latest/use/configure/migration-guide#ignoring-files
export default [
  // Ignore build and deployment folders
  {
    ignores: [
      '**/.next/**',
      '**/.open-next/**',
      '**/.wrangler/**',
      'node_modules/**',
    ],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
];
