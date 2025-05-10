import { z } from "zod";

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "./i18n";

export const percentageSchema = z
  .number({ error: "Le pourcentage est obligatoire." })
  .positive("Le pourcentage doit être positif.")
  .max(100, "Le pourcentage doit être inférieur à 100.");

export const localeSchema = z.enum(AVAILABLE_LOCALES).default(DEFAULT_LOCALE);

export const subdomainSchema = z
  .string()
  .min(3, "Le sous-domaine doit contenir au moins 3 caractères.")
  .max(63, "Le sous-domaine doit contenir au maximum 63 caractères.")
  .regex(
    /^[a-z0-9-_]+$/,
    "Le sous-domaine ne doit contenir que des lettres minuscules, des chiffres, des tirets et des traits de soulignement.",
  )
  .regex(/^[a-z0-9]/, "Le sous-domaine doit commencer par une lettre ou un chiffre.")
  .regex(/[a-z0-9]$/, "Le sous-domaine doit se terminer par une lettre ou un chiffre.");
