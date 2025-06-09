import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { MDXRemote } from "next-mdx-remote/rsc";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { withValidation } from "@/utils/next";

import { type DomainPageCombinedProps, DomainPageHOP } from "../../DomainPage";
import { type EnrichedPost, fetchPostsForBoard } from "./actions";
import style from "./Board.module.scss";
import { FilterAndSearch } from "./FilterAndSearch";
import { PostList } from "./PostList";
import { defaultOrder, ORDER_ENUM } from "./types";

export interface BoardPageParams {
  boardSlug: string;
}

const searchParamsSchema = z.object({
  order: z.enum(ORDER_ENUM).default(defaultOrder),
  search: z.string().optional(),
});

const BoardPage = withValidation({
  searchParamsSchema,
})(async ({ searchParams, searchParamsError, ...rest }) => {
  const { _data, params } = rest as DomainPageCombinedProps<BoardPageParams>;
  const { order, search } = await searchParams;

  const validatedOrder = searchParamsError?.properties?.order?.errors.length ? defaultOrder : order;
  const { domain, boardSlug } = await params;
  const session = await auth();
  const board = await prisma.board.findUnique({
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
  });

  if (!board) {
    return <div>Board not found</div>;
  }

  const { posts, filteredCount } = await fetchPostsForBoard(1, validatedOrder, board.id, search);

  const anonymousId = await getAnonymousId();

  return (
    <DsfrPage>
      <Container my="2w">
        <Grid haveGutters className={style.board}>
          <GridCol base={3} className={cx("sticky self-start top-[0]", style.sidebar)}>
            <div>
              <form className={cx(fr.cx("fr-py-2w"), "flex flex-col gap-[1rem]", style.suggestionForm)}>
                <h3 className={fr.cx("fr-text--lg", "fr-mb-0")}>Soumettre une suggestion</h3>
                <Input label="Titre" />
                <Input
                  label="Description"
                  textArea
                  classes={{
                    nativeInputOrTextArea: "resize-y",
                  }}
                />
                <Button className="place-self-end">Valider</Button>
              </form>
            </div>
          </GridCol>
          <GridCol base={9}>
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
                <FilterAndSearch order={validatedOrder} search={search} />
              </GridCol>
              <GridCol base={12} className={cx(fr.cx("fr-hint-text"))}>
                {filteredCount} résultat{filteredCount > 1 ? "s" : ""}
                {filteredCount !== board._count.posts
                  ? ` filtré${filteredCount > 1 ? "s" : ""} sur ${board._count.posts} au total`
                  : ""}
              </GridCol>
            </Grid>
            <ClientAnimate className={cx("flex flex-col gap-[1rem]", style.postList)}>
              <PostList
                key={`postList_${board.id}`}
                anonymousId={anonymousId}
                initialPosts={posts as EnrichedPost[]}
                totalCount={filteredCount}
                userId={session?.user.id}
                order={validatedOrder}
                boardId={board.id}
                search={search}
                boardSlug={boardSlug}
              />
            </ClientAnimate>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
});

export default DomainPageHOP({
  withSettings: true,
})(BoardPage);
