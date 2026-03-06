"use client";

import DsfrCard from "@codegouvfr/react-dsfr/Card";

import { type UICardProps } from "./UICard";

export const UICardDsfr = ({
  title,
  titleAs: TitleTag = "h3",
  desc,
  detail,
  endDetail,
  linkProps,
  horizontal,
  size,
  shadow,
  className,
}: UICardProps) => {
  const commonProps = {
    title: title as NonNullable<React.ReactNode>,
    titleAs: TitleTag,
    desc,
    detail,
    endDetail,
    linkProps,
    size,
    shadow,
    className,
  } as const;

  if (horizontal) {
    return <DsfrCard {...commonProps} horizontal />;
  }
  return <DsfrCard {...commonProps} />;
};
