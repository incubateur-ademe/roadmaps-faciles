import "server-only";

import { type TenantSettings } from "@/lib/model/TenantSettings";

import { type UiTheme } from "./types";

/**
 * Resolve the UI theme from tenant settings.
 * For root pages (no tenant context), always returns "Default".
 */
export const getTheme = (settings?: null | Pick<TenantSettings, "uiTheme">): UiTheme => {
  if (!settings) return "Default";
  return settings.uiTheme ?? "Default";
};
