import { prisma } from "@/lib/db/prisma";
import { type AppSettings } from "@/prisma/client";

import { type IAppSettingsRepo } from "../IAppSettingsRepo";

export class AppSettingsRepoPrisma implements IAppSettingsRepo {
  public get(): Promise<AppSettings> {
    return prisma.appSettings.upsert({
      where: { id: 0 },
      create: { id: 0 },
      update: {},
    });
  }

  public update(data: Partial<Pick<AppSettings, "force2FA" | "force2FAGraceDays">>): Promise<AppSettings> {
    return prisma.appSettings.upsert({
      where: { id: 0 },
      create: { id: 0, ...data },
      update: data,
    });
  }
}
