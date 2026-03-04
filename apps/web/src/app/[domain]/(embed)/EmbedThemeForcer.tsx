"use client";

import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const EmbedThemeForcer = () => {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");
  const { setIsDark } = useIsDark();

  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    } else if (theme === "light") {
      setIsDark(false);
    }
  }, [theme, setIsDark]);

  return null;
};
