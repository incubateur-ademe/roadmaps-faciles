"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/ui/shadcn/button";
import { clientParseError } from "@/utils/error";

export default function Error({ error: _error, reset }: { error: Error; reset: () => void }) {
  const error = clientParseError(_error);

  useEffect(() => {
    Sentry.captureException(_error);
  }, [_error]);
  const t = useTranslations("errors");

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="size-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">{t("technicalError")}</h1>
        <p className="mb-4 text-lg text-muted-foreground">{error.name}</p>
        <div className="mb-6 text-sm text-muted-foreground">
          <p>{error.message}</p>
          <Button variant="ghost" className="mt-2" onClick={() => reset()}>
            {t("retry")}
          </Button>
        </div>
        <Button asChild>
          <Link href="/">{t("homepage")}</Link>
        </Button>
      </div>
    </div>
  );
}
