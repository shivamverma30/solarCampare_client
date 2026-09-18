import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Reading from browser-only sources (localStorage, search params) and
      // signalling async/verification state inside effects is intentional here.
      // This opinionated rule flags those valid patterns, so we disable it.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
