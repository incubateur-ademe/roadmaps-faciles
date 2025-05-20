import { type PrismaConfig } from "prisma";

if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  console.log("🚨 Prisma config loaded in dev mode.");
  const { loadEnvConfig } = await import("@next/env");
  loadEnvConfig(__dirname, true);
}

process.env._SEEDING = "true";

export default {
  earlyAccess: true,
} satisfies PrismaConfig;
