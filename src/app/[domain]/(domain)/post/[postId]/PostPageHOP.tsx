import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Input from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { notFound } from "next/navigation";
import { type User } from "next-auth";
import { type ReactElement } from "react";
import { MarkdownAsync } from "react-markdown";

import { LikeButton } from "@/components/Board/LikeButton";
import { Text } from "@/dsfr/base/Typography";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { type Activity, type Board } from "@/prisma/client";
import { getAnonymousId } from "@/utils/anonymousId";
import { toFrenchDate } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { type EnrichedPost } from "../../board/[boardSlug]/actions";
import { DomainPageHOP } from "../../DomainPage";
import { PostTimeline } from "./_timeline/PostTimeline";

export interface PostPageParams {
  postId: number;
}

export const PostPageHOP = (page: (props: PostPageComponentProps) => ReactElement) =>
  DomainPageHOP<PostPageParams>()(async ({ params, _data }) => {
    const { postId } = await params;
    const id = Number(postId);
    if (isNaN(id)) {
      notFound();
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        board: true,
        likes: true,
        postStatus: true,
        user: true,
        activities: {
          orderBy: {
            startTime: "desc",
          },
          include: {
            comment: {
              include: {
                user: true,
                replies: {
                  take: 1,
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    user: true,
                  },
                },
                _count: {
                  select: {
                    replies: true,
                  },
                },
              },
            },
            statusChange: {
              include: {
                postStatus: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            follows: true,
            activities: true,
          },
        },
      },
    });

    if (!post) {
      notFound();
    }

    const session = await auth();
    const anonymousId = await getAnonymousId();
    const alreadyLiked = post.likes.some(like => session?.user.id === like.userId || like.anonymousId === anonymousId);

    return page({ post, user: session?.user, anonymousId, alreadyLiked });
  });

export interface PostPageComponentProps {
  alreadyLiked: boolean;
  anonymousId: string;
  isModal?: boolean;
  post: EnrichedPost & { activities: Activity[]; board: Board };
  user?: User | null;
}

export const PostPageComponent = (props: PostPageComponentProps) => {
  const { post } = props;
  return (
    <>
      <span className="flex gap-[.5rem] items-center">
        {post.postStatus ? (
          <Badge className={`fr-badge--color-${post.postStatus.color}`}>{post.postStatus.name}</Badge>
        ) : (
          <Badge className={"fr-badge--color-grey"}>Non classé</Badge>
        )}
        <Badge className={`fr-badge--color-blueFrance`}>{post.board.name}</Badge>
        {post.tags?.map(tag => (
          <Tag key={tag} small iconId="fr-icon-bookmark-line">
            {tag}
          </Tag>
        ))}
      </span>
      <Text mt="2w">
        Ajouté par <b>{post.user.name}</b> le {toFrenchDate(post.user.createdAt)}
      </Text>
      <Text mt="2w" variant="lg">
        <MarkdownAsync {...reactMarkdownConfig}>{post.description}</MarkdownAsync>
      </Text>
      <Input
        textArea
        label="Ajouter un commentaire"
        classes={{
          nativeInputOrTextArea: "resize-y",
        }}
      />
      {props.isModal ? (
        <>
          {post._count.comments > 0 && (
            <Tag as="span" iconId="fr-icon-discuss-line" small>
              <b>{post._count.comments}</b>&nbsp;commentaire{post._count.comments > 1 ? "s" : ""}
            </Tag>
          )}
        </>
      ) : (
        <>
          <div className={fr.cx("fr-hr-or")}>
            <span className="text-nowrap">Flux d'activité</span>
          </div>

          <PostTimeline {...props} />
        </>
      )}
    </>
  );
};

export const PostPageTitle = ({ post, alreadyLiked, user }: PostPageComponentProps) => (
  <span className="flex justify-between items-center gap-[2rem]">
    <MarkdownAsync {...reactMarkdownConfig}>{post.title}</MarkdownAsync>
    <LikeButton alreadyLiked={alreadyLiked} postId={post.id} tenantId={post.tenantId} userId={user?.id}>
      {post._count.likes}
    </LikeButton>
  </span>
);
