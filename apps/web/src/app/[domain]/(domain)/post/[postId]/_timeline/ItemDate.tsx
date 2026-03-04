import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { getLocale } from "next-intl/server";

import { Text } from "@/dsfr/base/Typography";
import { type Activity } from "@/prisma/client";
import { formatDateHour, formatRelativeDate } from "@/utils/date";

export const ItemDate = async ({ activity }: { activity: Activity }) => {
  const locale = await getLocale();

  return (
    <Text inline variant={["xs", "light"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
      <Tooltip title={formatDateHour(activity.startTime, locale)}>
        {formatRelativeDate(activity.startTime, locale)}
      </Tooltip>
    </Text>
  );
};
