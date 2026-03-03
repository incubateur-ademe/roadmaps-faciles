"use client";

import { useEffect } from "react";

import { type UiTheme } from "./types";

/**
 * Client component that injects `data-ui-theme` on <html>.
 * The root layout sets "Default" as the server-rendered default;
 * this component overrides it when the tenant has a different theme.
 */
export const ThemeInjector = ({ theme }: { theme: UiTheme }) => {
  useEffect(() => {
    document.documentElement.dataset.uiTheme = theme;
  }, [theme]);
  return null;
};
