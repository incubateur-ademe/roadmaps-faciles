import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { appSettingsRepo } from "@/lib/repo";

import { SecurityForm } from "./SecurityForm";

const AdminSecurityPage = async () => {
  await connection();
  const [appSettings, t] = await Promise.all([appSettingsRepo.get(), getTranslations("rootAdmin.security")]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <SecurityForm force2FA={appSettings.force2FA} force2FAGraceDays={appSettings.force2FAGraceDays} />
    </div>
  );
};

export default AdminSecurityPage;
