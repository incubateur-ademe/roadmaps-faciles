"use client";

import type DsfrCard from "@codegouvfr/react-dsfr/Card";

import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cn } from "@kokatsuna/ui";
import Link from "next/link";
import { type ComponentProps, lazy, Suspense } from "react";

import { useUI } from "@/ui";

const UICardDsfr = lazy(() => import("./UICardDsfr").then(m => ({ default: m.UICardDsfr })));

type DsfrCardProps = ComponentProps<typeof DsfrCard>;

export type UICardProps = {
  className?: string;
  desc?: React.ReactNode;
  detail?: React.ReactNode;
  endDetail?: React.ReactNode;
  horizontal?: boolean;
  linkProps?: DsfrCardProps["linkProps"];
  shadow?: boolean;
  size?: "large" | "medium" | "small";
  title: React.ReactNode;
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
};

export const UICard = ({
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
  const theme = useUI();

  if (theme === "Dsfr") {
    return (
      <Suspense>
        <UICardDsfr
          title={title}
          titleAs={TitleTag}
          desc={desc}
          detail={detail}
          endDetail={endDetail}
          linkProps={linkProps}
          horizontal={horizontal}
          size={size}
          shadow={shadow}
          className={className}
        />
      </Suspense>
    );
  }

  const cardContent = (
    <ShadcnCard
      className={cn(
        horizontal && "flex flex-row items-start",
        shadow && "shadow-md",
        size === "small" && "p-3",
        className,
      )}
    >
      <CardHeader className={cn(horizontal && "flex-1", size === "small" && "p-0 pb-1")}>
        {detail && <CardDescription>{detail}</CardDescription>}
        <CardTitle className={cn(size === "small" && "text-sm font-medium")}>
          <TitleTag className="m-0">{title}</TitleTag>
        </CardTitle>
      </CardHeader>
      {(desc || endDetail) && <CardContent className={cn(size === "small" && "p-0 pt-1")}>{desc}</CardContent>}
      {endDetail && <CardFooter className={cn(size === "small" && "p-0 pt-1")}>{endDetail}</CardFooter>}
    </ShadcnCard>
  );

  if (linkProps) {
    const { href, ...rest } = linkProps;
    return (
      <Link href={href} className="no-underline" {...rest}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
