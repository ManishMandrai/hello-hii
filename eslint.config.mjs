// eslint.config.mjs

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/**", ".next/**"],
  },

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    extends: [
      "next/core-web-vitals", // ✅ uses built-in Next.js ESLint rules
    ],

    rules: {
      // Disable TypeScript ANY rule
      "@typescript-eslint/no-explicit-any": "off",

      // Disable unused vars
      "@typescript-eslint/no-unused-vars": "off",

      // Disable Next.js <img> rule
      "@next/next/no-img-element": "off",
    },
  },
];
