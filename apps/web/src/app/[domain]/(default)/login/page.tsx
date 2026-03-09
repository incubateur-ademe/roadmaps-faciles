import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import crypto from "node:crypto";

import { LoginForm } from "@/app/(default)/login/LoginForm";
import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { tenantDefaultOAuthRepo } from "@/lib/repo";
import { UICard } from "@/ui/bridge";
import { getTheme } from "@/ui/server";

import { DomainPageHOP } from "../DomainPage";
import { BridgeAutoLogin } from "./BridgeAutoLogin";
import { TenantLoginDefault } from "./TenantLoginDefault";
import { TenantLoginDsfr } from "./TenantLoginDsfr";

const TenantLoginPage = DomainPageHOP()(async props => {
  const t = await getTranslations("auth");
  const searchParams = await (props as unknown as { searchParams: Promise<Record<string, string | undefined>> })
    .searchParams;
  let invitationEmail: string | undefined;

  const invitationToken = searchParams?.invitation;
  if (invitationToken) {
    const tokenDigest = crypto.createHash("sha256").update(invitationToken).digest("hex");
    const invitation = await prisma.invitation.findFirst({
      where: { tokenDigest, tenantId: props._data.tenant.id, acceptedAt: null },
      select: { email: true },
    });
    if (invitation) {
      invitationEmail = invitation.email;
    }
  }

  const theme = await getTheme(props._data.settings);

  // Handle bridge token — auto sign-in from root session via client component
  const bridgeToken = searchParams?.bridge_token;
  if (bridgeToken) {
    const bridgeContent = <BridgeAutoLogin token={bridgeToken} />;
    if (theme === "Dsfr") {
      return (
        <TenantLoginDsfr
          title={t("bridgeLoggingInTitle")}
          bridgeUrl=""
          bridgePrompt=""
          bridgeLink=""
          oauthPrompt=""
          providerNames={[]}
        >
          {bridgeContent}
        </TenantLoginDsfr>
      );
    }
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <UICard title={t("bridgeLoggingInTitle")} description={bridgeContent} className="w-full max-w-md" />
      </div>
    );
  }

  // Build bridge link URL
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost";
  const currentLoginUrl = `${protocol}://${host}/login`;
  const bridgeUrl = `${config.host}/api/auth-bridge?redirect=${encodeURIComponent(currentLoginUrl)}`;

  // Fetch enabled OAuth providers for this tenant
  const enabledOAuthProviders = await tenantDefaultOAuthRepo.findByTenantId(props._data.tenant.id);
  const providerNames = enabledOAuthProviders.map(p => p.provider);
  const loginForm = <LoginForm loginWithEmail defaultEmail={invitationEmail} />;
  const commonProps = {
    title: t("tenantLogin", { name: props._data.settings.name }),
    bridgeUrl,
    bridgePrompt: t("bridgePrompt", { brand: config.brand.name }),
    bridgeLink: t("bridgeLink", { brand: config.brand.name }),
    oauthPrompt: t("oauthPrompt"),
    providerNames,
  };

  if (theme === "Dsfr") {
    return <TenantLoginDsfr {...commonProps}>{loginForm}</TenantLoginDsfr>;
  }

  return <TenantLoginDefault {...commonProps}>{loginForm}</TenantLoginDefault>;
});

export default TenantLoginPage;
