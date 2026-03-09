import Link from "next/link";
import { type ReactNode } from "react";

import { UISeparator } from "@/ui/bridge";

import { OAuthButtons } from "./OAuthButtons";

interface TenantLoginDefaultProps {
  bridgeLink: string;
  bridgePrompt: string;
  bridgeUrl: string;
  children: ReactNode;
  oauthPrompt: string;
  providerNames: string[];
  title: string;
}

export const TenantLoginDefault = ({
  bridgeUrl,
  bridgePrompt,
  bridgeLink,
  children,
  oauthPrompt,
  providerNames,
  title,
}: TenantLoginDefaultProps) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-2xl font-semibold leading-none tracking-tight">{title}</h2>

      {children}

      {providerNames.length > 0 && (
        <>
          <UISeparator />
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{oauthPrompt}</p>
            <OAuthButtons providers={providerNames} />
          </div>
        </>
      )}

      <UISeparator />
      <p className="text-sm text-muted-foreground">
        {bridgePrompt}{" "}
        <Link href={bridgeUrl} className="text-primary underline hover:text-primary/80">
          {bridgeLink}
        </Link>
      </p>
    </div>
  </div>
);
