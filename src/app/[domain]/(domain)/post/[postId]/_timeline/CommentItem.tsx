import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineSeparator from "@mui/lab/TimelineSeparator";

import { Icon } from "@/dsfr";
import { type UserRole } from "@/prisma/enums";

import { type CommentActivity } from "./activityHelpers";
import { CommentContent } from "./CommentContent";
import { ItemDate } from "./ItemDate";

interface CommentItemProps {
  activity: CommentActivity;
  isAdmin: boolean;
  postAuthorId?: string;
  roleMap: Record<string, UserRole>;
  userId?: string;
  userImage?: string;
  userName?: string;
}

export const CommentItem = ({
  activity,
  userId,
  userName,
  userImage,
  roleMap,
  postAuthorId,
  isAdmin,
}: CommentItemProps) => {
  return (
    <>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <Icon icon="fr-icon-chat-2-fill" color="text-title-blue-france" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className="flex flex-col">
        <ItemDate activity={activity} />
        <CommentContent
          activity={activity}
          userId={userId}
          userName={userName}
          userImage={userImage}
          roleMap={roleMap}
          postAuthorId={postAuthorId}
          isAdmin={isAdmin}
        />
      </TimelineContent>
    </>
  );
};
