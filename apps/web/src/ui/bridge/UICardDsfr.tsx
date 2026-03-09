"use client";

import { Card as DsfrCard, type CardProps as DsfrCardProps } from "@codegouvfr/react-dsfr/Card";
import { useSyncExternalStore } from "react";

import { type UICardProps } from "./UICard";

/** Detect dark mode from `.dark` class on `<html>` — works in both themes, no DSFR provider dependency. */
function subscribeIsDark(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
function getIsDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}
function getIsDarkServerSnapshot() {
  return false;
}
function useIsDarkDOM(): boolean {
  return useSyncExternalStore(subscribeIsDark, getIsDarkSnapshot, getIsDarkServerSnapshot);
}

function useShadow(shadow: UICardProps["shadow"]): DsfrCardProps["shadow"] {
  const isDark = useIsDarkDOM();
  if (shadow === true) return true;
  if (shadow === "dark") return isDark;
  if (shadow === "light") return !isDark;
  return false;
}

const SIZE_MAP = {
  sm: "small",
  default: "medium",
  lg: "large",
} as const;

export const UICardDsfr = ({
  title,
  titleAs: TitleTag = "h3",
  description,
  subtitle,
  footer,
  href,
  linkTarget,
  horizontal,
  size,
  shadow,
  className,
}: UICardProps) => {
  const resolvedShadow = useShadow(shadow);

  const commonProps: DsfrCardProps = {
    title: title as NonNullable<React.ReactNode>,
    titleAs: TitleTag,
    desc: description,
    detail: subtitle,
    endDetail: footer,
    ...(href && { linkProps: { href, ...(linkTarget && { target: linkTarget }) } }),
    size: size ? SIZE_MAP[size] : undefined,
    shadow: resolvedShadow,
    className,
  };

  if (horizontal) {
    return <DsfrCard {...commonProps} horizontal />;
  }
  return <DsfrCard {...commonProps} />;
};
