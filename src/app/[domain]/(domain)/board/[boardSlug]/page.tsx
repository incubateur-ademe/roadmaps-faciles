import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { TrackPageView } from "@/lib/tracking-provider";
import { boardPublicViewed, boardViewed } from "@/lib/tracking-provider/trackingPlan";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { assertPublicAccess } from "@/utils/auth";
import { withValidation } from "@/utils/next";

import { type DomainPageCombinedProps, DomainPageHOP } from "../../DomainPage";
import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import style from "./Board.module.scss";
import { FilterAndSearch } from "./FilterAndSearch";
import { PostList } from "./PostList";
import { PostListCompact } from "./PostListCompact";
import { SubmitPostForm } from "./SubmitPostForm";
import { defaultOrder, defaultView, ORDER_ENUM, VIEW_ENUM } from "./types";

export interface BoardPageParams {
  boardSlug: string;
}

const searchParamsSchema = z.object({
  order: z.enum(ORDER_ENUM).default(defaultOrder),
  search: z.string().optional(),
  view: z.enum(VIEW_ENUM).default(defaultView),
});

const BoardPage = withValidation({
  searchParamsSchema,
})(async ({ searchParams, searchParamsError, ...rest }) => {
  const { _data, params } = rest as DomainPageCombinedProps<BoardPageParams>;
  const { order, search, view } = await searchParams;

  await assertPublicAccess(_data.settings, _data.dirtyDomainFixer("/login"));

  const validatedOrder = searchParamsError?.properties?.order?.errors.length ? defaultOrder : order;
  const validatedView = searchParamsError?.properties?.view?.errors.length ? defaultView : view;
  const { boardSlug } = await params;

  // Parallelize independent data fetches for better performance
  const [session, board, anonymousId] = await Promise.all([
    auth(),
    prisma.board.findUnique({
      where: {
        slug_tenantId: {
          slug: boardSlug,
          tenantId: _data.tenant.id,
        },
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    }),
    getAnonymousId(),
  ]);

  const t = await getTranslations();

  if (!board) {
    return <div>{t("board.boardNotFound")}</div>;
  }

  // Fetch posts after we have board.id
  const { posts, filteredCount } = await fetchPostsForBoard(1, validatedOrder, board.id, search);

  const showSuggestionForm = _data.settings.allowAnonymousFeedback || !!session;

  const boardTrackEvent = session
    ? boardViewed({ boardId: String(board.id), tenantId: String(_data.tenant.id) })
    : boardPublicViewed({ boardId: String(board.id), tenantId: String(_data.tenant.id) });

  return (
    <DsfrPage>
      <TrackPageView event={boardTrackEvent} />
      <Container my="2w">
        <Grid haveGutters className={style.board}>
          {showSuggestionForm && (
            <GridCol base={3} className={cx("sticky self-start top-[0]", style.sidebar)}>
              <div className={style.suggestionForm}>
                <SubmitPostForm boardId={board.id} />
              </div>
            </GridCol>
          )}
          <GridCol base={showSuggestionForm ? 9 : 12}>
            <Grid className={cx("sticky self-start top-[0] z-[501]", style.header)}>
              <GridCol base={8} className={style.title} pr="1w">
                <h1 className={fr.cx("fr-mb-1w", "fr-h3")}>{board.name}</h1>
                {board.description && (
                  <h2 className={cx(fr.cx("fr-text--md"), style.boardSubTiltle)}>
                    <MDXRemote source={board.description} />
                  </h2>
                )}
              </GridCol>
              <GridCol base={4} className={style.actions}>
                <FilterAndSearch order={validatedOrder} search={search} view={validatedView} />
              </GridCol>
              <GridCol base={12} className={cx(fr.cx("fr-hint-text"))}>
                {t("common.result", { count: filteredCount })}
                {filteredCount !== board._count.posts
                  ? ` ${t("common.filteredOf", { count: filteredCount, total: board._count.posts })}`
                  : ""}
              </GridCol>
            </Grid>
            <ClientAnimate className={cx("flex flex-col gap-[1rem]", style.postList)}>
              {validatedView === "list" ? (
                <PostListCompact
                  key={`postListCompact_${board.id}_${validatedOrder}_${search ?? ""}`}
                  allowAnonymousVoting={_data.settings.allowAnonymousVoting}
                  allowVoting={_data.settings.allowVoting}
                  anonymousId={anonymousId}
                  initialPosts={posts as EnrichedPost[]}
                  totalCount={filteredCount}
                  userId={session?.user.id}
                  order={validatedOrder}
                  boardId={board.id}
                  search={search}
                />
              ) : (
                <PostList
                  key={`postList_${board.id}_${validatedOrder}_${search ?? ""}`}
                  allowAnonymousVoting={_data.settings.allowAnonymousVoting}
                  allowVoting={_data.settings.allowVoting}
                  anonymousId={anonymousId}
                  initialPosts={posts as EnrichedPost[]}
                  totalCount={filteredCount}
                  userId={session?.user.id}
                  order={validatedOrder}
                  boardId={board.id}
                  search={search}
                  boardSlug={boardSlug}
                />
              )}
            </ClientAnimate>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
});

export default DomainPageHOP()(BoardPage);
