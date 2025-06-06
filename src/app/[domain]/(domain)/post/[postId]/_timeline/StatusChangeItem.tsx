import Badge from "@codegouvfr/react-dsfr/Badge";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineSeparator from "@mui/lab/TimelineSeparator";

import { Icon } from "@/dsfr";

import { type StatusChangeActivity } from "./activityHelpers";
import { ItemDate } from "./ItemDate";

export const StatusChangeItem = ({ activity }: { activity: StatusChangeActivity }) => {
  return (
    <>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <Icon icon="fr-icon-table-fill" color="text-title-blue-france" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className="flex flex-col">
        <ItemDate activity={activity} />
        <span>
          <b>Le post est passé en statut</b> :{" "}
          <Badge className={`fr-badge--color-${activity.statusChange.postStatus.color}`}>
            {activity.statusChange.postStatus.name}
          </Badge>
        </span>
      </TimelineContent>
    </>
  );
};
