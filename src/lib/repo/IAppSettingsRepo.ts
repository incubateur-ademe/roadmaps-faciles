import { type AppSettings } from "@/prisma/client";

export interface IAppSettingsRepo {
  get(): Promise<AppSettings>;
  update(data: Partial<Pick<AppSettings, "force2FA" | "force2FAGraceDays">>): Promise<AppSettings>;
}
