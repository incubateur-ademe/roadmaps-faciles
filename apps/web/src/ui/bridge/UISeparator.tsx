"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { Separator as ShadcnSeparator } from "@kokatsuna/ui";

import { useUI } from "@/ui";

export type UISeparatorProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export const UISeparator = ({ className, orientation = "horizontal" }: UISeparatorProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return <hr className={cx(fr.cx("fr-hr"), className)} />;
  }

  return <ShadcnSeparator orientation={orientation} className={className} />;
};
