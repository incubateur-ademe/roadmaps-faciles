import { getTranslations } from "next-intl/server";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { config } from "@/config";
import { DomainPageHOP } from "@/lib/DomainPage";
import { tenantDefaultOAuthRepo } from "@/lib/repo";

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
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />
      <AuthenticationForm
        tenantSettings={settings}
        enabledProviders={enabledProviders.map(p => p.provider)}
        availableProviders={availableProviders}
      />
    </>
  );
});

export default AuthenticationAdminPage;
