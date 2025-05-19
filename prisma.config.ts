import { loadEnvConfig } from "@next/env";
import path from "path";
import { type PrismaConfig } from "prisma";

const ROOT = path.resolve(__dirname, "..");
loadEnvConfig(ROOT, process.env.NODE_ENV !== "production");

process.env._SEEDING = "true";

export default {
  earlyAccess: true,
} satisfies PrismaConfig;
