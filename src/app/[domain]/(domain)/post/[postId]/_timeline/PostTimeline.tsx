import Timeline from "@mui/lab/Timeline";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Icon } from "@/dsfr";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/next-auth/auth";
import { type Activity } from "@/prisma/client";

import { type PostPageComponentProps } from "../PostPageHOP";
import { isAggregateActivity, isCommentActivity, isStatusChangeActivity } from "./activityHelpers";
import { AggregateItem } from "./AggregateItem";
import { CommentItem } from "./CommentItem";
import { ItemDate } from "./ItemDate";
import { StatusChangeItem } from "./StatusChangeItem";

export interface PostTimelineProps {
  post: PostPageComponentProps["post"];
}

export const PostTimeline = async ({ post }: PostTimelineProps) => {
  const userId = (await auth())?.user?.id;

  return (
    <ClientOnly>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {post.activities.map(activity => (
          <TimelineItem key={`activity-${activity.id}`}>
            {isCommentActivity(activity) ? (
              <CommentItem activity={activity} userId={userId} />
            ) : isStatusChangeActivity(activity) ? (
              <StatusChangeItem activity={activity} />
            ) : isAggregateActivity(activity) ? (
              <AggregateItem activity={activity} />
            ) : (
              (logger.warn({ activityType: activity.type, activityId: activity.id }, "Unrecognized activity type"),
              null)
            )}
          </TimelineItem>
        ))}
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined">
              <Icon icon="fr-icon-star-fill" color="text-default-success" />
            </TimelineDot>
          </TimelineSeparator>

          <TimelineContent className="flex flex-col gap-[.5rem]">
            <ItemDate activity={{ id: post.id, startTime: post.createdAt } as Activity} />
            {post.user.name} a créé le post
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </ClientOnly>
  );
};
