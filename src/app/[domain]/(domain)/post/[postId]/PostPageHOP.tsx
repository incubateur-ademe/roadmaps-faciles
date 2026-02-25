import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { type User } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type ReactElement } from "react";
import { MarkdownAsync } from "react-markdown";

import { LikeButton } from "@/components/Board/LikeButton";
import { Text } from "@/dsfr/base/Typography";
import { prisma } from "@/lib/db/prisma";
import { POST_APPROVAL_STATUS } from "@/lib/model/Post";
import { auth } from "@/lib/next-auth/auth";
import { type Activity, type Board } from "@/prisma/client";
import { UserRole } from "@/prisma/enums";
import { getAnonymousId } from "@/utils/anonymousId/getAnonymousId";
import { assertPublicAccess } from "@/utils/auth";
import { formatDate } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { type EnrichedPost } from "../../board/[boardSlug]/actions";
import { DomainPageHOP } from "../../DomainPage";
import { uploadImage } from "../../upload-image";
import { PostTimeline } from "./_timeline/PostTimeline";
import { CommentForm } from "./CommentForm";
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
          editedBy: true,
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

    // Check membership once — used for both approval access and edit permissions
    const membership = session?.user
      ? await prisma.userOnTenant.findUnique({
          where: { userId_tenantId: { userId: session.user.uuid, tenantId: tenant.id } },
          select: { role: true },
        })
      : null;

    const isAdmin =
      session?.user?.isSuperAdmin ||
      (membership &&
        (membership.role === UserRole.ADMIN ||
          membership.role === UserRole.OWNER ||
          membership.role === UserRole.MODERATOR));

    // Non-approved posts are only visible to admins/moderators and the post author
    if (post.approvalStatus !== POST_APPROVAL_STATUS.APPROVED) {
      const isAuthor =
        (session?.user && post.userId && post.userId === session.user.uuid) ||
        (post.anonymousId && post.anonymousId === anonymousId);
      if (!isAdmin && !isAuthor) {
        notFound();
      }
    }

    const alreadyLiked = post.likes.some(like => session?.user.id === like.userId || like.anonymousId === anonymousId);

    let canEdit = false;
    let canDelete = false;
    if (session?.user) {
      const isAuthor = post.userId && post.userId === session.user.uuid;
      if (isAuthor && settings.allowPostEdits) {
        canEdit = true;
      } else if (isAdmin) {
        canEdit = true;
      }
      if (isAdmin) {
        canDelete = true;
      } else if (isAuthor && settings.allowPostDeletion) {
        canDelete = true;
      }
    }

    return page({
      post,
      user: session?.user,
      userId: session?.user.uuid,
      anonymousId,
      alreadyLiked,
      canEdit,
      canDelete,
      isAdmin: Boolean(isAdmin),
      boardSlug: post.board.slug ?? "",
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
  boardSlug: string;
  canDelete: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  isModal?: boolean;
  post: { activities: Activity[]; board: Board; editedBy?: { name: null | string } | null } & EnrichedPost;
  user?: null | User;
  userId?: string;
}

export const PostPageComponent = async (props: PostPageComponentProps) => {
  const { post, allowComments, canEdit, canDelete, boardSlug, isModal } = props;
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
          author: post.user?.name ?? t("anonymous"),
          date: formatDate(post.createdAt, locale),
          b: chunks => <b>{chunks}</b>,
        })}
        {post.editedAt && (
          <>
            {" "}
            <span className={fr.cx("fr-text--sm", "fr-text--light")}>
              {post.editedBy?.name ? t("editedBy", { editor: post.editedBy.name }) : t("edited")}
            </span>
          </>
        )}
      </Text>
      <PostEditToggle
        canEdit={canEdit}
        canDelete={canDelete}
        boardSlug={boardSlug}
        isModal={isModal}
        postId={post.id}
        title={post.title}
        description={post.description}
      >
        <Text mt="2w" variant="lg">
          <MarkdownAsync {...reactMarkdownConfig}>{post.description}</MarkdownAsync>
        </Text>
      </PostEditToggle>
      {allowComments && (
        <CommentForm postId={post.id} tenantId={post.tenantId} userId={props.userId} uploadImageAction={uploadImage} />
      )}
      {isModal ? (
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
