import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { Container } from "@/dsfr";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { getTenantFromDomain } from "@/utils/tenant";

import { type EnrichedPost, fetchPostsForBoard } from "../../../../(domain)/board/[boardSlug]/actions";
import { PostList } from "../../../../(domain)/board/[boardSlug]/PostList";
import { PostListCompact } from "../../../../(domain)/board/[boardSlug]/PostListCompact";
import { defaultOrder, defaultView, ORDER_ENUM, VIEW_ENUM } from "../../../../(domain)/board/[boardSlug]/types";

const searchParamsSchema = z.object({
  hideVotes: z.coerce.boolean().default(false),
  order: z.enum(ORDER_ENUM).default(defaultOrder),
  search: z.string().optional(),
  theme: z.enum(["dark", "light"]).optional(),
  view: z.enum(VIEW_ENUM).default(defaultView),
});

interface EmbedBoardPageProps {
  params: Promise<{ boardSlug: string; domain: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const EmbedBoardPageInner = async ({ params, searchParams }: EmbedBoardPageProps) => {
  await connection();

  const { domain, boardSlug } = await params;
  const rawSearchParams = await searchParams;
  const parsed = searchParamsSchema.safeParse(rawSearchParams);
  const { order, view, hideVotes, search } = parsed.success
    ? parsed.data
    : { order: defaultOrder, view: defaultView, hideVotes: false, search: undefined };

  const tenant = await getTenantFromDomain(domain);
  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!tenantSettings) {
    return null;
  }

  const [t, session, anonymousId] = await Promise.all([getTranslations("embed"), auth(), getAnonymousId()]);

  // Handle private tenants: show message instead of redirecting
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

  const board = await prisma.board.findUnique({
    where: {
      slug_tenantId: {
        slug: boardSlug,
        tenantId: tenant.id,
      },
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  const [tb, tc] = await Promise.all([getTranslations("board"), getTranslations("common")]);

  if (!board) {
    return (
      <Container className={fr.cx("fr-py-4w")}>
        <p>{tb("boardNotFound")}</p>
      </Container>
    );
  }

  const { posts, filteredCount } = await fetchPostsForBoard(1, order, board.id, search);

  const allowVoting = hideVotes ? false : tenantSettings.allowVoting;
  const allowAnonymousVoting = hideVotes ? false : tenantSettings.allowAnonymousVoting;

  return (
    <Container my="2w">
      <h2 className={fr.cx("fr-h4", "fr-mb-1w")}>{board.name}</h2>
      <p className={cx(fr.cx("fr-hint-text", "fr-mb-2w"))}>{tc("result", { count: filteredCount })}</p>
      <ClientAnimate className={cx("flex flex-col gap-[1rem]")}>
        {view === "list" ? (
          <PostListCompact
            key={`embed_compact_${board.id}_${order}_${search ?? ""}`}
            allowAnonymousVoting={allowAnonymousVoting}
            allowVoting={allowVoting}
            anonymousId={anonymousId}
            initialPosts={posts as EnrichedPost[]}
            totalCount={filteredCount}
            userId={session?.user.id}
            order={order}
            boardId={board.id}
            search={search}
            linkTarget="_blank"
          />
        ) : (
          <PostList
            key={`embed_cards_${board.id}_${order}_${search ?? ""}`}
            allowAnonymousVoting={allowAnonymousVoting}
            allowVoting={allowVoting}
            anonymousId={anonymousId}
            initialPosts={posts as EnrichedPost[]}
            totalCount={filteredCount}
            userId={session?.user.id}
            order={order}
            boardId={board.id}
            search={search}
            boardSlug={boardSlug}
            linkTarget="_blank"
          />
        )}
      </ClientAnimate>
    </Container>
  );
};

const EmbedBoardPage = (props: EmbedBoardPageProps) => (
  <Suspense>
    <EmbedBoardPageInner {...props} />
  </Suspense>
);

export default EmbedBoardPage;
