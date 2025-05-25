import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, { timelineContentClasses } from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Avatar from "@mui/material/Avatar";
import { notFound } from "next/navigation";
import { type User } from "next-auth";
import { type ReactElement } from "react";
import { MarkdownAsync } from "react-markdown";

import { LikeButton } from "@/components/Board/LikeButton";
import { getMaterialAvatarProps } from "@/components/img/InitialsAvatar";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { Icon } from "@/dsfr";
import { Text } from "@/dsfr/base/Typography";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { type Activity, type Board, type Comment, type PostStatus, type PostStatusChange } from "@/prisma/client";
import { getAnonymousId } from "@/utils/anonymousId";
import { toFrenchDate, toFrenchDateHour, toFrenchRelativeDate } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";
import { type ClearObject } from "@/utils/types";

import { type EnrichedPost } from "../../board/[boardSlug]/actions";
import { DomainPageHOP } from "../../DomainPage";

export interface PostPageParams {
  postId: number;
}

type CommentActivity = ClearObject<
  Activity & {
    comment: Comment & {
      replies: Array<
        Comment & {
          user: User;
        }
      >;
      user: User;
    };
    commentId: number;
    statusChangeId: null;
    type: "COMMENT";
  }
>;

type StatusChangeActivity = ClearObject<
  Activity & {
    commentId: null;
    statusChange: PostStatusChange & {
      postStatus: PostStatus;
    };
    type: "STATUS_CHANGE";
  }
>;

type LikeFollowActivity = ClearObject<
  Activity & {
    commentId: null;
    statusChangeId: null;
    type: "FOLLOW" | "LIKE";
  }
>;

export type EnrichedActivity = CommentActivity | LikeFollowActivity | StatusChangeActivity;

function isCommentActivity(activity: Activity): activity is CommentActivity {
  return activity.type === "COMMENT" && "comment" in activity && activity.comment !== null;
}

function isStatusChangeActivity(activity: Activity): activity is StatusChangeActivity {
  return activity.type === "STATUS_CHANGE" && "statusChange" in activity && activity.statusChange !== null;
}
function isLikeFollowActivity(activity: Activity): activity is LikeFollowActivity {
  return activity.type === "LIKE" || activity.type === "FOLLOW";
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
              where: {
                parentId: null, // Only include top-level comments
              },
              include: {
                user: true,
                replies: {
                  include: {
                    user: true,
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
      <div className={fr.cx("fr-hr-or")}>
        <span className="text-nowrap">Flux d'activité</span>
      </div>

      <PostTimeline {...props} />
    </>
  );
};

export const PostPageTitle = ({ post, alreadyLiked, user }: PostPageComponentProps) => (
  <span className="flex justify-between items-center gap-[2rem]">
    <MarkdownAsync {...reactMarkdownConfig}>{post.title}</MarkdownAsync>
    <LikeButton size="small" alreadyLiked={alreadyLiked} postId={post.id} tenantId={post.tenantId} userId={user?.id}>
      {post._count.likes}
    </LikeButton>
  </span>
);

const PostTimeline = ({ post }: PostPageComponentProps) => {
  return (
    <ClientOnly>
      <Timeline
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            marginTop: "6px",
          },
          [`& .${timelineItemClasses.root}:before`]: {
            content: "none",
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0,
            textWrap: "nowrap",
            marginTop: "8px",
          },
        }}
      >
        {post.activities.map(activity => (
          <TimelineItem key={`activity-${activity.id}`}>
            <TimelineOppositeContent variant="body2">
              <Tooltip title={toFrenchDateHour(activity.startTime)}>{toFrenchRelativeDate(activity.startTime)}</Tooltip>
            </TimelineOppositeContent>
            {isCommentActivity(activity) ? (
              <>
                <TimelineSeparator>
                  <TimelineDot variant="outlined">
                    <Icon icon="fr-icon-chat-2-fill" color="text-title-blue-france" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card
                    shadow
                    horizontal
                    title={
                      <div className="flex items-center gap-[1rem]">
                        <Avatar
                          {...getMaterialAvatarProps(activity.comment.user.name!)}
                          alt={`Avatar ${activity.comment.user.name!}`}
                          src={activity.comment.user.image!}
                        />
                        <Text inline variant={["sm", "bold"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
                          {activity.comment.user.name}
                        </Text>
                      </div>
                    }
                    desc={<MarkdownAsync {...reactMarkdownConfig}>{activity.comment.body}</MarkdownAsync>}
                    footer={
                      <Button type="button" size="small" priority="secondary">
                        Répondre
                      </Button>
                    }
                  />
                </TimelineContent>
              </>
            ) : isStatusChangeActivity(activity) ? (
              <>
                <TimelineSeparator>
                  <TimelineDot variant="outlined">
                    <Icon icon="fr-icon-table-fill" color="text-title-blue-france" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <b>Le post est passé en statut</b> :{" "}
                  <span className={`fr-badge--color-${activity.statusChange.postStatus.color}`}>
                    {activity.statusChange.postStatus.name}
                  </span>
                </TimelineContent>
              </>
            ) : isLikeFollowActivity(activity) ? (
              <>
                <TimelineSeparator>
                  <TimelineDot variant="outlined">
                    <Icon
                      icon={activity.type === "LIKE" ? "fr-icon-thumb-up-fill" : "fr-icon-rss-fill"}
                      color="text-title-blue-france"
                    />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <b>{activity.count}</b> personne{activity.count > 1 ? "s ont" : " a"}{" "}
                  {activity.type === "LIKE" ? "aimé" : "suivi"} le post
                </TimelineContent>
              </>
            ) : (
              (console.warn(`Unrecognized activity type: ${activity.type}`), null)
            )}
          </TimelineItem>
        ))}
        <TimelineItem>
          <TimelineOppositeContent variant="body2">
            <Tooltip title={toFrenchDateHour(post.createdAt)}>{toFrenchRelativeDate(post.createdAt)}</Tooltip>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined">
              <Icon icon="fr-icon-star-fill" color="text-default-success" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>{post.user.name} a créé le post</TimelineContent>
        </TimelineItem>
      </Timeline>
    </ClientOnly>
  );
};
