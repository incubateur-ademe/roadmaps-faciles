import js from "@eslint/js";
import nextConfig from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";
// @ts-expect-error — pas de types publiés pour ce plugin
import lodashPlugin from "eslint-plugin-lodash";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const nextFiles = [
  "page",
  "head",
  "error",
  "template",
  "layout",
  "route",
  "loading",
  "opengraph-image",
  "twitter-image",
  "not-found",
  "forbidden",
  "unauthorized",
  "default",
  "icon",
  "apple-icon",
  "sitemap",
  "robots",
  "global-error",
  "middleware",
  "proxy",
].join("|");

const config = [
  // ─── Ignores globaux ──────────────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "src/generated/**",
      "next-env.d.ts",
      ".next/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "public/**",
      "prisma.config.ts",
    ],
  },

  // ─── Base ─────────────────────────────────────────────────────────────────
  js.configs.recommended,
  ...nextConfig, // react, react-hooks, import, jsx-a11y, @next/next, @typescript-eslint (parser sur *.ts)

  // ─── @typescript-eslint / recommended-type-checked (TS uniquement) ────────
  // [0] skippé : base + parser — déjà fourni par nextConfig[1]
  tseslint.configs.recommendedTypeChecked[1], // règles scoped à *.ts / *.tsx par le package
  { ...tseslint.configs.recommendedTypeChecked[2], files: ["**/*.ts", "**/*.tsx"] }, // règles sans scope → on en scope

  // ─── Prettier : désactive les règles de formatting en conflit ─────────────
  prettierConfig,

  // ─── Plugins supplémentaires + règles principales ────────────────────────
  {
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      lodash: lodashPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // import/recommended — pas inclus par nextConfig, on les pose manuellement
      "import/no-unresolved": ["error", { commonjs: true }],
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",

      "@next/next/no-html-link-for-pages": ["error", ["src/app", "src/pages"]],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": [
        "error",
        {
          forbid: [">", "}"],
        },
      ],
      // Enable only for CSP inline-style
      // "react/forbid-component-props": [
      //   "error",
      //   {
      //     forbid: [
      //       {
      //         propName: "style",
      //         message: "Utiliser className à la place de style (react-dsfr ou global.css).",
      //       },
      //     ],
      //   },
      // ],
      // "react/forbid-dom-props": [
      //   "error",
      //   {
      //     forbid: [
      //       {
      //         propName: "style",
      //         message: "Utiliser className à la place de style (react-dsfr ou global.css).",
      //       },
      //     ],
      //   },
      // ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: 'Import "React" par défaut déjà géré par Next.',
            },
          ],
        },
      ],
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/order": "off",
      "import/no-default-export": "error",
      "import/no-extraneous-dependencies": "off",
      "import/no-internal-modules": "off",
      "import/newline-after-import": "error",
      "import/export": "off",
      "import/no-useless-path-segments": "warn",
      "import/no-absolute-path": "warn",
      "import/no-named-as-default": "off",
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],
      "import/no-duplicates": [
        "error",
        {
          "prefer-inline": true,
        },
      ],
      "lodash/import-scope": ["error", "member"],
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          trailingComma: "all",
          printWidth: 120,
          singleQuote: false,
          parser: "typescript",
          arrowParens: "avoid",
        },
      ],
    },
  },

  // ─── TypeScript ───────────────────────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "import/named": "off",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple",
        },
      ],
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: 'Import "React" par défaut déjà géré par Next.',
              allowTypeImports: true,
            },
          ],
        },
      ],
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
          overrides: {
            accessors: "no-public",
            constructors: "no-public",
          },
        },
      ],
      "@typescript-eslint/member-delimiter-style": [
        "off",
        {
          multiline: {
            delimiter: "none",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
    },
  },

  // ─── Fichiers Next.js / configs — default export autorisé ────────────────
  {
    files: [
      "src/pages/**/*.ts",
      "src/pages/**/*.tsx",
      `src/app/**/+(${nextFiles}).ts`,
      `src/app/**/+(${nextFiles}).tsx`,
      "next.config.ts",
      "eslint.config.ts",
      "prisma.config.ts",
      "tailwind.config.ts",
      "next-sitemap.config.js",
      "postcss.config.js",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },

  // ─── Scripts — tsconfig séparé ────────────────────────────────────────────
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./scripts/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ─── Perfectionist ────────────────────────────────────────────────────────
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-exports": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "perfectionist/sort-interfaces": "error",
      "perfectionist/sort-enums": "error",
      "perfectionist/sort-union-types": "warn",
      "perfectionist/sort-intersection-types": "warn",
    },
  },
];

export default config;
