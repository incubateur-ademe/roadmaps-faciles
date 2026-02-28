"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { useUI } from "@/ui";

import { Label as ShadcnLabel } from "../shadcn/label";

export type UILabelProps = {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
};

export const UILabel = ({ children, htmlFor, className }: UILabelProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <label htmlFor={htmlFor} className={cx(fr.cx("fr-label"), className)}>
        {children}
      </label>
    );
  }

  return (
    <ShadcnLabel htmlFor={htmlFor} className={className}>
      {children}
    </ShadcnLabel>
  );
};
