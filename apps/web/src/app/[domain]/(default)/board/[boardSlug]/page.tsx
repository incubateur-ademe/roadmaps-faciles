import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { TrackPageView } from "@/lib/tracking-provider";
import { boardPublicViewed, boardViewed } from "@/lib/tracking-provider/trackingPlan";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { assertPublicAccess } from "@/utils/auth";
import { withValidation } from "@/utils/next";

import { type DomainPageCombinedProps, DomainPageHOP } from "../../DomainPage";
import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import { FilterAndSearch } from "./FilterAndSearch";
import { PostKanban } from "./PostKanban";
import { PostKanbanAccordion } from "./PostKanbanAccordion";
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

  const { posts, filteredCount } = await fetchPostsForBoard(1, validatedOrder, board.id, search);

  // Fetch statuses for kanban views
  const statuses =
    validatedView === "kanban" || validatedView === "kanban-accordion"
      ? await prisma.postStatus.findMany({
          where: { tenantId: _data.tenant.id },
          orderBy: { order: "asc" },
        })
      : [];

  const showSuggestionForm = _data.settings.allowAnonymousFeedback || !!session;

  const boardTrackEvent = session
    ? boardViewed({ boardId: String(board.id), tenantId: String(_data.tenant.id) })
    : boardPublicViewed({ boardId: String(board.id), tenantId: String(_data.tenant.id) });

  const sharedPostProps = {
    allowAnonymousVoting: _data.settings.allowAnonymousVoting,
    allowVoting: _data.settings.allowVoting,
    anonymousId,
    initialPosts: posts as EnrichedPost[],
    totalCount: filteredCount,
    userId: session?.user.id,
    order: validatedOrder,
    boardId: board.id,
    search,
  };

  return (
    <>
      <TrackPageView event={boardTrackEvent} />
      <div className="mx-auto my-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {showSuggestionForm && (
            <aside className="sticky top-20 hidden w-72 shrink-0 self-start lg:block">
              <SubmitPostForm boardId={board.id} />
            </aside>
          )}
          <div className="min-w-0 flex-1">
            <div className="sticky top-16 z-10 bg-background pb-3">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h1 className="mb-1 text-xl font-bold">{board.name}</h1>
                  {board.description && (
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <MDXRemote source={board.description} />
                    </div>
                  )}
                </div>
                <div className="w-80 shrink-0">
                  <FilterAndSearch order={validatedOrder} search={search} view={validatedView} />
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("common.result", { count: filteredCount })}
                {filteredCount !== board._count.posts
                  ? ` ${t("common.filteredOf", { count: filteredCount, total: board._count.posts })}`
                  : ""}
              </p>
            </div>
            <ClientAnimate className="flex flex-col gap-4">
              {validatedView === "list" ? (
                <PostListCompact key={`compact_${board.id}_${validatedOrder}_${search ?? ""}`} {...sharedPostProps} />
              ) : validatedView === "kanban" ? (
                <PostKanban
                  key={`kanban_${board.id}_${validatedOrder}_${search ?? ""}`}
                  {...sharedPostProps}
                  statuses={statuses}
                />
              ) : validatedView === "kanban-accordion" ? (
                <PostKanbanAccordion
                  key={`accordion_${board.id}_${validatedOrder}_${search ?? ""}`}
                  {...sharedPostProps}
                  statuses={statuses}
                />
              ) : (
                <PostList
                  key={`cards_${board.id}_${validatedOrder}_${search ?? ""}`}
                  {...sharedPostProps}
                  boardSlug={boardSlug}
                />
              )}
            </ClientAnimate>
          </div>
        </div>
      </div>
    </>
  );
});

export default DomainPageHOP()(BoardPage);
