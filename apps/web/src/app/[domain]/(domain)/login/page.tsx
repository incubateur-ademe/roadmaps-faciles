import { Card, CardContent, CardHeader, CardTitle, Separator } from "@kokatsuna/ui";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import crypto from "node:crypto";

import { LoginForm } from "@/app/(default)/login/LoginForm";
import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { tenantDefaultOAuthRepo } from "@/lib/repo";

import { DomainPageHOP } from "../DomainPage";
import { BridgeAutoLogin } from "./BridgeAutoLogin";
import { OAuthButtons } from "./OAuthButtons";

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

  // Handle bridge token — auto sign-in from root session via client component
  const bridgeToken = searchParams?.bridge_token;
  if (bridgeToken) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <BridgeAutoLogin token={bridgeToken} />
          </CardContent>
        </Card>
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

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("tenantLogin", { name: props._data.settings.name })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm loginWithEmail defaultEmail={invitationEmail} />

          {providerNames.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t("oauthPrompt")}</p>
                <OAuthButtons providers={providerNames} />
              </div>
            </>
          )}

          <Separator />
          <p className="text-sm text-muted-foreground">
            {t("bridgePrompt", { brand: config.brand.name })}{" "}
            <Link href={bridgeUrl} className="text-primary underline hover:text-primary/80">
              {t("bridgeLink", { brand: config.brand.name })}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

export default TenantLoginPage;
