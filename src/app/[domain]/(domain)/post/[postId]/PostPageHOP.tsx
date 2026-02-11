import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Input from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { type User } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type ReactElement } from "react";
import { MarkdownAsync } from "react-markdown";

import { LikeButton } from "@/components/Board/LikeButton";
import { Text } from "@/dsfr/base/Typography";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { type Activity, type Board } from "@/prisma/client";
import { UserRole } from "@/prisma/enums";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { assertPublicAccess } from "@/utils/auth";
import { formatDate } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { type EnrichedPost } from "../../board/[boardSlug]/actions";
import { DomainPageHOP } from "../../DomainPage";
import { PostTimeline } from "./_timeline/PostTimeline";
import { PostEditToggle } from "./PostEditToggle";

export interface PostPageParams {
  postId: number;
}

export const PostPageHOP = (page: (props: PostPageComponentProps) => ReactElement) =>
  DomainPageHOP<PostPageParams>()(async ({ params, _data: { settings, tenant, dirtyDomainFixer } }) => {
    const { postId } = await params;
    const id = Number(postId);
    if (isNaN(id)) {
      notFound();
    }

    await assertPublicAccess(settings, dirtyDomainFixer("/login"));

    // Parallelize independent data fetches for better performance
    const [post, session, anonymousId] = await Promise.all([
      prisma.post.findUnique({
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
      }),
      auth(),
      getAnonymousId(),
    ]);

    if (!post) {
      notFound();
    }

    const alreadyLiked = post.likes.some(like => session?.user.id === like.userId || like.anonymousId === anonymousId);

    let canEdit = false;
    if (session?.user) {
      const isAuthor = post.userId === session.user.uuid;
      if (isAuthor && settings.allowPostEdits) {
        canEdit = true;
      } else if (session.user.isSuperAdmin) {
        canEdit = true;
      } else {
        const membership = await prisma.userOnTenant.findUnique({
          where: { userId_tenantId: { userId: session.user.uuid, tenantId: tenant.id } },
          select: { role: true },
        });
        if (
          membership &&
          (membership.role === UserRole.ADMIN ||
            membership.role === UserRole.OWNER ||
            membership.role === UserRole.MODERATOR)
        ) {
          canEdit = true;
        }
      }
    }

    return page({
      post,
      user: session?.user,
      anonymousId,
      alreadyLiked,
      canEdit,
      allowVoting: settings.allowVoting,
      allowAnonymousVoting: settings.allowAnonymousVoting,
      allowComments: settings.allowComments,
    });
  });

export interface PostPageComponentProps {
  allowAnonymousVoting: boolean;
  allowComments: boolean;
  allowVoting: boolean;
  alreadyLiked: boolean;
  anonymousId: string;
  canEdit: boolean;
  isModal?: boolean;
  post: { activities: Activity[]; board: Board } & EnrichedPost;
  user?: null | User;
}

export const PostPageComponent = async (props: PostPageComponentProps) => {
  const { post, allowComments, canEdit } = props;
  const [t, locale] = await Promise.all([getTranslations("post"), getLocale()]);

  return (
    <>
      <span className="flex gap-[.5rem] items-center">
        {post.postStatus ? (
          <Badge className={`fr-badge--color-${post.postStatus.color}`}>{post.postStatus.name}</Badge>
        ) : (
          <Badge className={"fr-badge--color-grey"}>{t("unclassified")}</Badge>
        )}
        <Badge className={`fr-badge--color-blueFrance`}>{post.board.name}</Badge>
        {post.tags?.map(tag => (
          <Tag key={tag} small iconId="fr-icon-bookmark-line">
            {tag}
          </Tag>
        ))}
      </span>
      <Text mt="2w">
        {t.rich("addedBy", {
          author: post.user.name ?? "",
          date: formatDate(post.user.createdAt, locale),
          b: chunks => <b>{chunks}</b>,
        })}
      </Text>
      <PostEditToggle canEdit={canEdit} postId={post.id} title={post.title} description={post.description}>
        <Text mt="2w" variant="lg">
          <MarkdownAsync {...reactMarkdownConfig}>{post.description}</MarkdownAsync>
        </Text>
      </PostEditToggle>
      {allowComments && (
        <Input
          textArea
          label={t("addComment")}
          classes={{
            nativeInputOrTextArea: "resize-y",
          }}
        />
      )}
      {props.isModal ? (
        <>
          {post._count.comments > 0 && (
            <Tag as="span" iconId="fr-icon-discuss-line" small>
              {t.rich("comment", { count: post._count.comments, b: chunks => <b>{chunks}</b> })}
            </Tag>
          )}
        </>
      ) : (
        <>
          <div className={fr.cx("fr-hr-or")}>
            <span className="text-nowrap">{t("activityFeed")}</span>
          </div>

          <PostTimeline {...props} />
        </>
      )}
    </>
  );
};

export const PostPageTitle = ({
  post,
  alreadyLiked,
  allowVoting,
  allowAnonymousVoting,
  user,
}: PostPageComponentProps) => (
  <span className="flex justify-between items-center gap-[2rem]">
    <MarkdownAsync {...reactMarkdownConfig}>{post.title}</MarkdownAsync>
    {allowVoting && (allowAnonymousVoting || user?.id) && (
      <LikeButton alreadyLiked={alreadyLiked} postId={post.id} tenantId={post.tenantId} userId={user?.id}>
        {post._count.likes}
      </LikeButton>
    )}
  </span>
);
