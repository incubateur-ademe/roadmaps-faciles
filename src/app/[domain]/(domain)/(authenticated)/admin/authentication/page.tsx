import { connection } from "next/server";

import { tenantSettingsRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";

import { AuthenticationForm } from "./AuthenticationForm";

const AuthenticationAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
  if (!settings) throw new Error("Settings not found");

  return (
    <div>
      <h1>Paramètres d'authentification</h1>
      <AuthenticationForm tenantSettings={settings} />
    </div>
  );
};

export default AuthenticationAdminPage;
