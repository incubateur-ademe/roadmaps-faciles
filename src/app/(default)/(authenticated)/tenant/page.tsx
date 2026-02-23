import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { Container } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { userOnTenantRepo } from "@/lib/repo";
import { type UserOnTenantWithTenantSettings } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole } from "@/prisma/enums";
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
    <DsfrPage>
      <Container mt="2w">
        <div className={fr.cx("fr-mb-4w")}>
          <div className="flex items-center justify-between">
            <h1 className={fr.cx("fr-mb-0")}>{t("myWorkspaces")}</h1>
            <Button linkProps={{ href: "/tenant/new" }} iconId="fr-icon-add-line">
              {t("newWorkspace")}
            </Button>
          </div>
        </div>

        {memberships.length === 0 && <p>{t("noWorkspaces")}</p>}

        {managed.length > 0 && <TenantSection title={t("managedWorkspaces")} memberships={managed} showConfigure />}

        {member.length > 0 && <TenantSection title={t("memberWorkspaces")} memberships={member} />}
      </Container>
    </DsfrPage>
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
    <section className={fr.cx("fr-mb-4w")}>
      <h2 className={fr.cx("fr-mb-2w")}>{title}</h2>
      <div>
        {memberships.map(membership => (
          <div
            key={`${membership.userId}-${membership.tenantId}`}
            className={cx(fr.cx("fr-p-2w", "fr-mb-1w"), "rounded border border-[var(--border-default-grey)]")}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={fr.cx("fr-text--bold")}>{membership.tenant.settings.name}</span>
                  <Badge severity="info" small noIcon>
                    {tRoles(membership.role)}
                  </Badge>
                </div>
                <p className={cx(fr.cx("fr-text--xs", "fr-mb-0", "fr-mt-1v"), "text-[var(--text-mention-grey)]")}>
                  {membership.tenant.settings.customDomain ??
                    `${membership.tenant.settings.subdomain}.${config.rootDomain}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {showConfigure && (
                  <Button
                    size="small"
                    priority="secondary"
                    linkProps={{ href: `/tenant/${membership.tenantId}` }}
                    iconId="fr-icon-settings-5-line"
                  >
                    {t("configure")}
                  </Button>
                )}
                <Button
                  size="small"
                  priority="tertiary no outline"
                  linkProps={{ href: getRoadmapUrl(membership.tenant.settings) }}
                  iconId="fr-icon-arrow-right-line"
                >
                  {t("viewRoadmap")}
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
