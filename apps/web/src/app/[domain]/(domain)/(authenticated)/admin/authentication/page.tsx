import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { tenantDefaultOAuthRepo } from "@/lib/repo";

import { DomainPageHOP } from "../../../DomainPage";
import { AuthenticationForm } from "./AuthenticationForm";

const AuthenticationAdminPage = DomainPageHOP()(async props => {
  const { settings, tenant } = props._data;
  const t = await getTranslations("domainAdmin.authentication");

  const enabledProviders = await tenantDefaultOAuthRepo.findByTenantId(tenant.id);

  // Determine which OAuth providers are configured globally (have client IDs)
  const availableProviders: string[] = [];
  if (config.oauth.github.clientId) availableProviders.push("github");
  if (config.oauth.google.clientId) availableProviders.push("google");
  if (config.oauth.proconnect.clientId) availableProviders.push("proconnect");

  return (
    <div>
      <h1>{t("title")}</h1>
      <AuthenticationForm
        tenantSettings={settings}
        enabledProviders={enabledProviders.map(p => p.provider)}
        availableProviders={availableProviders}
      />
    </div>
  );
});

export default AuthenticationAdminPage;
