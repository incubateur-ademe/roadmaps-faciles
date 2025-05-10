import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { BoardPost } from "@/components/Board/Post";
import { Container, Grid, GridCol } from "@/dsfr";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { getAnonymousId } from "@/utils/anonymousId";

import { DomainPageHOP } from "../../DomainPage";
import style from "./Board.module.scss";

export interface BoardParams {
  boardSlug: string;
}

const BoardPage = DomainPageHOP<BoardParams>({ withSettings: true })(async ({ params, _data }) => {
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
      posts: {
        include: {
          postStatus: true,
          user: true,
          likes: true,
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
  });

  if (!board) {
    return <div>Board not found</div>;
  }

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
            <GridCol base={8} className={style.title}>
              <h1 className={fr.cx("fr-mb-1w", "fr-h3")}>{board.name}</h1>
              <h2 className={fr.cx("fr-text--md")}>{board.description}</h2>
            </GridCol>
            <GridCol base={4} className={style.actions}>
              <SegmentedControl
                legend="Trier par"
                hideLegend
                small
                className={cx(fr.cx("fr-mb-2w"), "w-full")}
                classes={{
                  elements: "grow justify-between",
                }}
                segments={[
                  {
                    iconId: "fr-icon-star-s-line",
                    label: "Tendance",
                  },
                  {
                    iconId: "fr-icon-arrow-right-up-line",
                    label: "Top",
                  },
                  {
                    iconId: "fr-icon-sparkling-2-line",
                    label: "Nouveau",
                  },
                ]}
              />
              <div className="flex gap-[1rem] justify-between">
                <Button title="Filtre" iconId="fr-icon-filter-line" priority="secondary" />
                <SearchBar className="grow" />
              </div>
            </GridCol>
          </Grid>
          <div className={cx("flex", "flex-col", "gap-[1rem]", style.postList)}>
            {board.posts.map(post => {
              const alreadyLiked = post.likes.some(
                like => session?.user?.id === like.userId || like.anonymousId === anonymousId,
              );
              return (
                <BoardPost key={`post_${post.id}`} post={post} alreadyLiked={alreadyLiked} userId={session?.user.id} />
              );
            })}
          </div>
        </GridCol>
      </Grid>
    </Container>
  );
});

export default BoardPage;
