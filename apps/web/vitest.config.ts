import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/config": path.resolve(__dirname, "src/config.ts"),
      "@/dsfr/client": path.resolve(__dirname, "src/dsfr/client.ts"),
      "@/dsfr/utils": path.resolve(__dirname, "src/dsfr/utils"),
      "@/dsfr": path.resolve(__dirname, "src/dsfr/server.ts"),
      "@/prisma": path.resolve(__dirname, "src/generated/prisma"),
      "@/utils": path.resolve(__dirname, "src/lib/utils"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/testu/**/*.test.ts", "tests/testi/**/*.test.ts"],
    exclude: ["node_modules", ".next", "src/generated/**", "tests/teste2e/**"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/useCases/**", "src/lib/utils/**", "src/lib/model/**"],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 35,
        lines: 50,
      },
    },
  },
});
