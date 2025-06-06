import { type Activity, type Comment, type PostStatus, type PostStatusChange, type User } from "@/prisma/client";
import { type ClearObject } from "@/utils/types";

export type CommentActivity = ClearObject<
  Activity & {
    comment: Comment & {
      _count: {
        replies: number;
      };
      replies: [
        firstComment?: Comment & {
          user: User;
        },
      ];
      user: User;
    };
    commentId: number;
    statusChangeId: null;
    type: "COMMENT";
  }
>;

export type StatusChangeActivity = ClearObject<
  Activity & {
    commentId: null;
    statusChange: PostStatusChange & {
      postStatus: PostStatus;
    };
    type: "STATUS_CHANGE";
  }
>;

export type AggregateActivity = ClearObject<
  Activity & {
    commentId: null;
    statusChangeId: null;
    type: "COMMENT_COUNT" | "FOLLOW" | "LIKE";
  }
>;

export type EnrichedActivity = AggregateActivity | CommentActivity | StatusChangeActivity;

export function isCommentActivity(activity: Activity): activity is CommentActivity {
  return activity.type === "COMMENT" && "comment" in activity && activity.comment !== null;
}

export function isStatusChangeActivity(activity: Activity): activity is StatusChangeActivity {
  return activity.type === "STATUS_CHANGE" && "statusChange" in activity && activity.statusChange !== null;
}
export function isAggregateActivity(activity: Activity): activity is AggregateActivity {
  return activity.type === "LIKE" || activity.type === "FOLLOW";
}
