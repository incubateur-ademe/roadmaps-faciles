import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

import { Text } from "@/dsfr/base/Typography";
import { type Activity } from "@/prisma/client";
import { toFrenchDateHour, toFrenchRelativeDate } from "@/utils/date";

export const ItemDate = ({ activity }: { activity: Activity }) => {
  return (
    <Text inline variant={["xs", "light"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
      <Tooltip title={toFrenchDateHour(activity.startTime)}>{toFrenchRelativeDate(activity.startTime)}</Tooltip>
    </Text>
  );
};
