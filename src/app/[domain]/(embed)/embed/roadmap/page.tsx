import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import z from "zod";

import { LikeButton } from "@/components/Board/LikeButton";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { Box, Container } from "@/dsfr";
import { Heading, Text } from "@/dsfr/base/Typography";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";
import { getTenantFromDomain } from "@/utils/tenant";

const searchParamsSchema = z.object({
  hideVotes: z.coerce.boolean().default(false),
  theme: z.enum(["dark", "light"]).optional(),
});

interface EmbedRoadmapPageProps {
  params: Promise<{ domain: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const EmbedRoadmapPageInner = async ({ params, searchParams }: EmbedRoadmapPageProps) => {
  await connection();

  const { domain } = await params;
  const rawSearchParams = await searchParams;
  const parsed = searchParamsSchema.safeParse(rawSearchParams);
  const { hideVotes } = parsed.success ? parsed.data : { hideVotes: false };

  const tenant = await getTenantFromDomain(domain);
  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!tenantSettings) {
    return null;
  }

  const [t, tr, tc, session, anonymousId, dirtyDomain] = await Promise.all([
    getTranslations("embed"),
    getTranslations("roadmap"),
    getTranslations("common"),
    auth(),
    getAnonymousId(),
    getDirtyDomain(),
  ]);

  // Handle private tenants
  if (tenantSettings.isPrivate && !session?.user) {
    const tenantUrl = tenantSettings.customDomain
      ? `https://${tenantSettings.customDomain}`
      : `${config.host.replace("://", `://${tenantSettings.subdomain}.`)}`;

    return (
      <Container className={fr.cx("fr-py-4w")}>
        <Alert
          severity="warning"
          title={t("privateTenant")}
          description={
            <Link href={`${tenantUrl}/login`} target="_blank" className={fr.cx("fr-link")}>
              {t("privateTenantLogin")}
            </Link>
          }
        />
      </Container>
    );
  }

  const dirtyDomainFixer = dirtyDomain ? dirtySafePathname(dirtyDomain) : (pathname: string) => pathname;
  const userId = session?.user.id;
  const showVotes = !hideVotes && tenantSettings.allowVoting && (tenantSettings.allowAnonymousVoting || !!userId);

  const postStatuses = await prisma.postStatus.findMany({
    where: {
      tenantId: tenant.id,
      showInRoadmap: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      tenantId: tenant.id,
      postStatusId: {
        not: null,
      },
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      postStatus: true,
      board: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  return (
    <Container className="flex-1 flex flex-col overflow-x-hidden" my="2w">
      <Heading as="h2" className={fr.cx("fr-mb-2w")}>
        {tr("title")}
      </Heading>
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
                {postsInColumn.length === 0 && <Text className={fr.cx("fr-p-2w")}>{tr("emptyColumn")}</Text>}
                {postsInColumn.map(post => (
                  <Card
                    key={post.id}
                    title={post.title}
                    className={cx(fr.cx("fr-my-1w", "fr-mx-0-5v"), "snap-start scroll-mt-2")}
                    shadow
                    titleAs="h4"
                    linkProps={{
                      href: dirtyDomainFixer(`/post/${post.id}`),
                      target: "_blank",
                    }}
                    size="small"
                    horizontal
                    start={
                      showVotes ? (
                        <LikeButton
                          postId={post.id}
                          tenantId={tenant.id}
                          size="small"
                          userId={userId}
                          alreadyLiked={post.likes.some(
                            like => userId === like.userId || like.anonymousId === anonymousId,
                          )}
                        >
                          {post._count.likes}
                        </LikeButton>
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
    </Container>
  );
};

const EmbedRoadmapPage = (props: EmbedRoadmapPageProps) => (
  <Suspense>
    <EmbedRoadmapPageInner {...props} />
  </Suspense>
);

export default EmbedRoadmapPage;
