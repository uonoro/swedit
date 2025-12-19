import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/", "src-tauri/", "node_modules/", "build/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // Setzt die Regel auf Warning statt Error
      "no-unused-vars": "warn",
      // Falls du TypeScript nutzt, musst du oft auch die TS-Variante anpassen:
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
