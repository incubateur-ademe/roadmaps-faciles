"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import DsfrButton from "@codegouvfr/react-dsfr/Button";
import DsfrTable from "@codegouvfr/react-dsfr/Table";
import { type MDXComponents } from "mdx/types";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

const MdxAlert = ({
  severity = "info",
  title,
  children,
}: {
  children: NonNullable<ReactNode>;
  severity?: "error" | "info" | "success" | "warning";
  title?: string;
}) => <Alert severity={severity} small title={title ?? ""} description={children} className="fr-my-2w" />;

const MdxBadge = ({
  severity = "info",
  children,
}: {
  children: NonNullable<ReactNode>;
  severity?: "error" | "info" | "new" | "success" | "warning";
}) => (
  <Badge severity={severity} noIcon>
    {children}
  </Badge>
);

const MdxButton = ({
  children,
  ...props
}: { children: NonNullable<ReactNode> } & ComponentPropsWithoutRef<typeof DsfrButton>) => (
  <DsfrButton {...props}>{children}</DsfrButton>
);

const MdxTable = ({ data, headers }: { data: string[][]; headers: string[] }) => (
  <DsfrTable data={data} headers={headers} className="fr-my-2w" />
);

export const dsfrMdxComponents: MDXComponents = {
  Alert: MdxAlert as MDXComponents["div"],
  Badge: MdxBadge as MDXComponents["span"],
  Button: MdxButton as MDXComponents["button"],
  DsfrTable: MdxTable as MDXComponents["table"],
};
