"use client";

import DsfrButton from "@codegouvfr/react-dsfr/Button";
import { type ComponentProps } from "react";

import { useUI } from "@/ui";

import { Button as ShadcnButton } from "../shadcn/button";

const VARIANT_TO_PRIORITY = {
  default: "primary",
  secondary: "secondary",
  destructive: "primary",
  outline: "tertiary",
  ghost: "tertiary no outline",
  link: "tertiary no outline",
} as const;

type ShadcnButtonProps = ComponentProps<typeof ShadcnButton>;

export type UIButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  variant?: ShadcnButtonProps["variant"];
};

export const UIButton = ({ variant = "default", children, className, ...props }: UIButtonProps) => {
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <DsfrButton priority={VARIANT_TO_PRIORITY[variant ?? "default"]} className={className} {...props}>
        {children}
      </DsfrButton>
    );
  }

  return (
    <ShadcnButton variant={variant} className={className} {...props}>
      {children}
    </ShadcnButton>
  );
};
