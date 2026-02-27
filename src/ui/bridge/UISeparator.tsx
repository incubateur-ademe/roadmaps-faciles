"use client";

import { fr } from "@codegouvfr/react-dsfr";

import { useUI } from "@/ui";

import { Separator as ShadcnSeparator } from "../shadcn/separator";

export type UISeparatorProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export const UISeparator = ({ className, orientation = "horizontal" }: UISeparatorProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return <hr className={fr.cx("fr-hr", className as never)} />;
  }

  return <ShadcnSeparator orientation={orientation} className={className} />;
};
