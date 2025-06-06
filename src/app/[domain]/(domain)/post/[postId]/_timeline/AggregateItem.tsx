import { type FrIconClassName } from "@codegouvfr/react-dsfr";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineSeparator from "@mui/lab/TimelineSeparator";

import { Icon } from "@/dsfr";
import { type Activity } from "@/prisma/client";

import { type AggregateActivity } from "./activityHelpers";
import { ItemDate } from "./ItemDate";

const ICONS = {
  LIKE: {
    icon: "fr-icon-thumb-up-fill",
    wordAction: "aimé",
  },
  FOLLOW: {
    icon: "fr-icon-rss-fill",
    wordAction: "suivi",
  },
} satisfies Partial<Record<Activity["type"], { icon: FrIconClassName; wordAction: string }>>;

export const AggregateItem = ({ activity }: { activity: AggregateActivity }) => {
  return (
    <>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <Icon icon={ICONS[activity.type].icon} color="text-title-blue-france" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className="flex flex-col">
        <ItemDate activity={activity} />
        <span>
          <b>{activity.count}</b> personne{activity.count > 1 ? "s ont" : " a"} {ICONS[activity.type].wordAction} le
          post
        </span>
      </TimelineContent>
    </>
  );
};
