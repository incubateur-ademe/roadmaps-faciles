"use client";

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kokatsuna/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light" | "system";

const CYCLE: Theme[] = ["light", "dark", "system"];

const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return "system";
};

const applyTheme = (theme: Theme) => {
  const isDark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme:dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
};

const iconMap = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

// Storage event listener for useSyncExternalStore
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

export const ThemeToggle = () => {
  const t = useTranslations("themeToggle");
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => "system" as Theme);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme:dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const handleClick = useCallback(() => {
    const nextIndex = (CYCLE.indexOf(theme) + 1) % CYCLE.length;
    const next = CYCLE[nextIndex];
    if (next === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
    applyTheme(next);
    // Dispatch storage event to trigger useSyncExternalStore re-render (same-tab)
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
  }, [theme]);

  const Icon = iconMap[theme];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleClick}>
            <Icon className="size-4" />
            <span className="sr-only">{t("label")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(theme)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
