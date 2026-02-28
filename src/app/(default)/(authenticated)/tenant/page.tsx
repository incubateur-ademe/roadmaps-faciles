import { ArrowRight, Plus, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { config } from "@/config";
import { userOnTenantRepo } from "@/lib/repo";
import { type UserOnTenantWithTenantSettings } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole } from "@/prisma/enums";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { ListMembershipsForUser } from "@/useCases/user_on_tenant/ListMembershipsForUser";
import { assertSession } from "@/utils/auth";

const MANAGED_ROLES: string[] = [UserRole.OWNER, UserRole.ADMIN, UserRole.MODERATOR];

const getRoadmapUrl = (settings: UserOnTenantWithTenantSettings["tenant"]["settings"]) => {
  if (settings.customDomain) return `https://${settings.customDomain}`;
  const hostUrl = new URL(config.host);
  return `${hostUrl.protocol}//${settings.subdomain}.${hostUrl.host}`;
};

const TenantPage = async () => {
  const session = await assertSession();
  const t = await getTranslations("tenant");

  const useCase = new ListMembershipsForUser(userOnTenantRepo);
  const memberships = await useCase.execute({ userId: session.user.id });

  const managed = memberships.filter(m => MANAGED_ROLES.includes(m.role));
  const member = memberships.filter(m => !MANAGED_ROLES.includes(m.role));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("myWorkspaces")}</h1>
          <Button asChild>
            <Link href="/tenant/new">
              <Plus className="mr-2 size-4" />
              {t("newWorkspace")}
            </Link>
          </Button>
        </div>
      </div>

      {memberships.length === 0 && <p className="text-muted-foreground">{t("noWorkspaces")}</p>}

      {managed.length > 0 && <TenantSection title={t("managedWorkspaces")} memberships={managed} showConfigure />}

      {member.length > 0 && <TenantSection title={t("memberWorkspaces")} memberships={member} />}
    </div>
  );
};

const TenantSection = async ({
  memberships,
  showConfigure,
  title,
}: {
  memberships: UserOnTenantWithTenantSettings[];
  showConfigure?: boolean;
  title: string;
}) => {
  const t = await getTranslations("tenant");
  const tRoles = await getTranslations("roles");

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-2">
        {memberships.map(membership => (
          <div key={`${membership.userId}-${membership.tenantId}`} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{membership.tenant.settings.name}</span>
                  <Badge variant="secondary">{tRoles(membership.role)}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {membership.tenant.settings.customDomain ??
                    `${membership.tenant.settings.subdomain}.${config.rootDomain}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {showConfigure && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/tenant/${membership.tenantId}`}>
                      <Settings className="mr-2 size-4" />
                      {t("configure")}
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={getRoadmapUrl(membership.tenant.settings)}>
                    {t("viewRoadmap")}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TenantPage;
