import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";

import { LikeButton } from "@/components/Board/LikeButton";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Box, Container } from "@/dsfr";
import { Heading, Text } from "@/dsfr/base/Typography";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { POST_APPROVAL_STATUS } from "@/lib/model/Post";
import { auth } from "@/lib/next-auth/auth";
import { userOnTenantRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { assertPublicAccess } from "@/utils/auth";

import { DomainPageHOP } from "../DomainPage";

const RoadmapPage = DomainPageHOP()(async props => {
  const { tenant, settings, dirtyDomainFixer } = props._data;
  await assertPublicAccess(settings, dirtyDomainFixer("/login"));
  const anonymousId = await getAnonymousId();
  const session = await auth();
  const userId = session?.user.id;
  const showVotes = settings.allowVoting && (settings.allowAnonymousVoting || !!userId);

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
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Check if current user is tenant admin (for admin hints)
  const membership = userId ? await userOnTenantRepo.findMembership(userId, tenant.id) : null;
  const isAdmin = !!(
    session?.user.isSuperAdmin ||
    membership?.role === UserRole.ADMIN ||
    membership?.role === UserRole.OWNER
  );

  // posts is already filtered with postStatusId: { not: null }
  const showAdminHint = isAdmin && postStatuses.length === 0 && posts.length > 0;

  const [t, tc] = await Promise.all([getTranslations("roadmap"), getTranslations("common")]);

  return (
    <DsfrPage>
      <Container className="flex-1 flex flex-col overflow-x-hidden" my="2w">
        <Heading as="h2" className={fr.cx("fr-mb-2w")}>
          {t("title")}
        </Heading>
        {showAdminHint && (
          <Alert
            severity="warning"
            small
            description={
              <>
                {t("adminNoStatusHint", { count: posts.length })}{" "}
                <a href={dirtyDomainFixer("/admin/statuses")}>{t("adminNoStatusLink")}</a>
              </>
            }
            className={fr.cx("fr-mb-2w")}
          />
        )}
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
                        href: dirtyDomainFixer(`/post/${post.id}`),
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
    </DsfrPage>
  );
});
export default RoadmapPage;
