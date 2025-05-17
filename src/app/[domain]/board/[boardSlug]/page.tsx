import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { MDXRemote } from "next-mdx-remote/rsc";
import z from "zod";

import { BoardPost } from "@/components/Board/Post";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { getAnonymousId } from "@/utils/anonymousId";
import { withValidation } from "@/utils/next";

import { type DomainPageCombinedProps, DomainPageHOP } from "../../DomainPage";
import style from "./Board.module.scss";
import { defaultOrder, FilterAndSearch, ORDER_ENUM } from "./FilterAndSearch";

export interface BoardParams {
  boardSlug: string;
}

const searchParamsSchema = z.object({
  order: z.enum(ORDER_ENUM),
});

const BoardPage = withValidation({
  searchParamsSchema,
})(async ({ searchParams, searchParamsError, ...rest }) => {
  const { _data, params } = rest as DomainPageCombinedProps<BoardParams>;
  const { order } = await searchParams;

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
  });

  if (!board) {
    return <div>Board not found</div>;
  }

  const posts =
    order === "trending"
      ? (
          await prisma.postWithHotness.findMany({
            where: {
              boardId: board.id,
            },
            orderBy: {
              hotness: "desc",
            },
            include: {
              post: {
                include: {
                  postStatus: true,
                  user: true,
                  likes: true,
                  hotness: true,
                  _count: {
                    select: {
                      comments: true,
                      follows: true,
                      likes: true,
                    },
                  },
                },
              },
            },
          })
        ).map(postWithHotness => postWithHotness.post)
      : await prisma.post.findMany({
          where: {
            boardId: board.id,
          },
          orderBy: {
            ...(order === "top"
              ? {
                  likes: {
                    _count: "desc",
                  },
                }
              : { createdAt: "desc" }),
          },
          include: {
            postStatus: true,
            user: true,
            likes: true,
            hotness: true,
            _count: {
              select: {
                comments: true,
                follows: true,
                likes: true,
              },
            },
          },
        });

  const anonymousId = await getAnonymousId();

  return (
    <Container className={fr.cx("fr-my-2w")}>
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
              <FilterAndSearch order={validatedOrder} />
            </GridCol>
          </Grid>
          <ClientAnimate className={cx("flex", "flex-col", "gap-[1rem]", style.postList)}>
            {posts.map(post => {
              const alreadyLiked = post.likes.some(
                like => session?.user?.id === like.userId || like.anonymousId === anonymousId,
              );
              return (
                <BoardPost key={`post_${post.id}`} post={post} alreadyLiked={alreadyLiked} userId={session?.user.id} />
              );
            })}
          </ClientAnimate>
        </GridCol>
      </Grid>
    </Container>
  );
});

export default DomainPageHOP({
  withSettings: true,
})(BoardPage);
