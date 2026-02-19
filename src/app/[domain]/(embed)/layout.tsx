import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { connection } from "next/server";
import { type PropsWithChildren, Suspense } from "react";

import { config } from "@/config";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { getTenantFromDomain } from "@/utils/tenant";

import { EmbedThemeForcer } from "./EmbedThemeForcer";

interface EmbedLayoutProps extends PropsWithChildren {
  params: Promise<{ domain: string }>;
}

const EmbedLayoutInner = async ({ children, params }: EmbedLayoutProps) => {
  await connection();

  const { domain } = await params;
  const tenant = await getTenantFromDomain(domain);
  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: { tenantId: tenant.id },
  });

  const t = await getTranslations("embed");

  if (!tenantSettings?.allowEmbedding) {
    return (
      <DsfrPage>
        <main className={cx(fr.cx("fr-p-3w"), "flex items-center justify-center min-h-[200px]")}>
          <Alert severity="error" small description={t("embeddingDisabled")} />
        </main>
      </DsfrPage>
    );
  }

  return (
    <DsfrPage>
      <EmbedThemeForcer />
      <main className={fr.cx("fr-pb-2w")}>{children}</main>
      <footer className={cx(fr.cx("fr-py-1w", "fr-px-2w"), "text-center")}>
        <span className={fr.cx("fr-text--xs")}>
          {t("poweredBy", { name: config.brand.name })}
          {" · "}
          <Link href={`${config.host}`} target="_blank" className={fr.cx("fr-link", "fr-text--xs")}>
            {config.host}
          </Link>
        </span>
      </footer>
    </DsfrPage>
  );
};

const EmbedLayout = (props: EmbedLayoutProps) => (
  <Suspense>
    <EmbedLayoutInner {...props} />
  </Suspense>
);

export default EmbedLayout;
