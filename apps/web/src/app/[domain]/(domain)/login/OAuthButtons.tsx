"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

interface OAuthButtonsProps {
  providers: string[];
}

const PROVIDER_KEYS = {
  github: "provider.github",
  google: "provider.google",
  proconnect: "provider.proconnect",
} as const;

export const OAuthButtons = ({ providers }: OAuthButtonsProps) => {
  const t = useTranslations("auth");

  if (providers.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 fr-mt-2w">
      {providers.map(provider => (
        <Button key={provider} priority="secondary" onClick={() => void signIn(provider)} className="w-full">
          {t(PROVIDER_KEYS[provider as keyof typeof PROVIDER_KEYS] ?? "provider.github")}
        </Button>
      ))}
    </div>
  );
};
