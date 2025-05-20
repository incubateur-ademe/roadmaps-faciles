import { config } from "@/config";
import { PrismaClient } from "@/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const isProd = config.env === "prod";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: !isProd
      ? [
          // "query",
          "info",
          "warn",
          "error",
        ]
      : ["error"],
  });

if (!isProd) globalForPrisma.prisma = prisma;
