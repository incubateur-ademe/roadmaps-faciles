import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { Suspense } from "react";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { Box, Container } from "@/dsfr";
import { Heading, Text } from "@/dsfr/base/Typography";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { POST_APPROVAL_STATUS } from "@/lib/model/Post";
import { appSettingsRepo, tenantRepo } from "@/lib/repo";

import { sharedMetadata } from "../../shared-metadata";

const url = "/roadmap";

export const metadata: Metadata = {
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const getTenantUrl = (subdomain: string, customDomain: null | string) => {
  if (customDomain) return `https://${customDomain}`;
  const hostUrl = new URL(config.host);
  return `${hostUrl.protocol}//${subdomain}.${hostUrl.host}`;
};

const RoadmapPageInner = async () => {
  await connection();

  const [t, tc] = await Promise.all([getTranslations("roadmap"), getTranslations("common")]);

  const notConfigured = (
    <DsfrPage>
      <Container my="4w">
        <Text>{t("notConfigured")}</Text>
      </Container>
    </DsfrPage>
  );

  const appSettings = await appSettingsRepo.get();
  if (!appSettings.pinnedTenantId) return notConfigured;

  const tenant = await tenantRepo.findById(appSettings.pinnedTenantId);
  if (!tenant || tenant.deletedAt) return notConfigured;

  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: { tenantId: tenant.id },
  });
  if (!tenantSettings || tenantSettings.isPrivate) return notConfigured;

  const tenantUrl = getTenantUrl(tenantSettings.subdomain, tenantSettings.customDomain);

  const [postStatuses, posts] = await Promise.all([
    prisma.postStatus.findMany({
      where: {
        tenantId: tenant.id,
        showInRoadmap: true,
      },
      orderBy: {
        order: "asc",
      },
    }),
    prisma.post.findMany({
      where: {
        tenantId: tenant.id,
        postStatusId: {
          not: null,
        },
        approvalStatus: POST_APPROVAL_STATUS.APPROVED,
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        postStatus: true,
        board: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
  ]);

  return (
    <DsfrPage>
      <Container className="flex-1 flex flex-col overflow-x-hidden" my="2w">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Heading as="h1" className={fr.cx("fr-mb-1w")}>
              {t("title")}
            </Heading>
            <Text className={cx(fr.cx("fr-mb-2w"), "text-[var(--text-mention-grey)]")}>{t("description")}</Text>
          </div>
          <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: tenantUrl }}>
            {t("submitFeedback")}
          </Button>
        </div>

        {postStatuses.length === 0 ? (
          <Text className={fr.cx("fr-py-4w")}>{t("empty")}</Text>
        ) : (
          <Box className={cx("flex flex-1 min-h-0 gap-2 w-full overflow-x-auto scrollbar-thin snap-x")}>
            {postStatuses.map(statusColumn => {
              const postsInColumn = posts.filter(post => post.postStatusId === statusColumn.id);
              return (
                <div
                  key={statusColumn.id}
                  className={cx("flex grow-0 shrink-0 flex-col overflow-hidden snap-start scroll-ml-2", {
                    "w-[24%]": postStatuses.length >= 4,
                    "w-[32%]": postStatuses.length <= 3,
                  })}
                >
                  <Text
                    variant="bold"
                    inline
                    className={cx(`fr-roadmap-column--color-${statusColumn.color}`, fr.cx("fr-p-1w"))}
                  >
                    {statusColumn.name}
                    <span className={fr.cx("fr-hint-text")}>{tc("item", { count: postsInColumn.length })}</span>
                  </Text>

                  <ClientAnimate className="flex-1 overflow-y-auto snap-y scrollbar-thin">
                    {postsInColumn.length === 0 && <Text className={fr.cx("fr-p-2w")}>{t("emptyColumn")}</Text>}
                    {postsInColumn.map(post => (
                      <Card
                        key={post.id}
                        title={post.title}
                        className={cx(fr.cx("fr-my-1w", "fr-mx-0-5v"), "snap-start scroll-mt-2")}
                        shadow
                        titleAs="h4"
                        linkProps={{
                          href: `${tenantUrl}/post/${post.id}`,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }}
                        size="small"
                        horizontal
                        start={
                          post._count.likes > 0 ? (
                            <span className={cx(fr.cx("fr-text--xs", "fr-text--bold"), "flex items-center gap-1")}>
                              <span className={fr.cx("fr-icon--sm", "fr-icon-thumb-up-line")} aria-hidden="true" />
                              {post._count.likes}
                            </span>
                          ) : undefined
                        }
                        endDetail={
                          <Tag as="span" small>
                            {post.board.name}
                          </Tag>
                        }
                      />
                    ))}
                  </ClientAnimate>
                </div>
              );
            })}
          </Box>
        )}
      </Container>
    </DsfrPage>
  );
};

const RoadmapPage = () => (
  <Suspense>
    <RoadmapPageInner />
  </Suspense>
);

export default RoadmapPage;
