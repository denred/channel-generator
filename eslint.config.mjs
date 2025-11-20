import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      ".next",
      "coverage",
      "build",
      "out",
      "eslint.config.js",
      "eslint.config.mjs",
      "postcss.config.mjs",
    ],
  },
  next,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
        node: {
          extensions: [".js", ".ts", ".d.ts", ".tsx"],
        },
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
  },
  {
    rules: {
      curly: ["error", "all"],
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/consistent-type-imports": "error",

      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "unused-imports/no-unused-imports": "error",

      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          tabWidth: 2,
          singleQuote: false,
          trailingComma: "all",
          semi: true,
          arrowParens: "always",
          endOfLine: "lf",
        },
      ],
    },
  },
);
