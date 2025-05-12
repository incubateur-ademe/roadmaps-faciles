import { inspect } from "util";

import { ensureApiEnvVar, ensureNextEnvVar } from "@/utils/os";
import { isTruthy } from "@/utils/string";

export const config = {
  env: ensureApiEnvVar<"dev" | "prod" | "review" | "staging">(process.env.APP_ENV, "dev"),
  _seeding: ensureApiEnvVar(process.env._SEEDING, isTruthy, false),
  maintenance: ensureApiEnvVar(process.env.MAINTENANCE_MODE, isTruthy, false),
  siteUrl: ensureNextEnvVar(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  hostname: ensureApiEnvVar(process.env.HOSTNAME, "localhost"),
  port: ensureApiEnvVar(process.env.PORT, Number, 3000),
  get rootDomain() {
    return this.hostname.replace(/^(https?:\/\/)?(www\.)?/, "");
  },
  get mainHostURL() {
    const protocol = this.hostname === "localhost" ? "http" : "https";
    const url = new URL(`${protocol}://${this.hostname}`);
    url.port = this.port.toString();
    return url;
  },
  appVersion: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION, "dev"),
  appVersionCommit: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION_COMMIT, "unknown"),
  repositoryUrl: ensureNextEnvVar(
    process.env.NEXT_PUBLIC_REPOSITORY_URL,
    "https://github.com/incubateur-ademe/roadmaps-faciles",
  ),
  matomo: {
    url: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_URL, ""),
    siteId: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_SITE_ID, ""),
  },
  admins: ensureApiEnvVar(
    process.env.ADMINS,
    v =>
      v
        .trim()
        .split(",")
        .map(a => a.trim())
        .filter(Boolean),
    ["lilian.sagetlethias", "julien.bouqillon"],
  ),
  brand: {
    name: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_NAME, "Roadmaps Faciles"),
    tagline: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_TAGLINE, "Créez vos roadmaps en quelques clics"),
    ministry: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_MINISTRY, "République\nFrançaise"),
    operator: {
      enable: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_OPERATOR_ENABLE, isTruthy, true),
      logo: {
        imgUrl: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_URL, "/img/roadmaps-faciles.png"),
        alt: ensureNextEnvVar(process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ALT, "Roadmaps Faciles"),
        orientation: ensureNextEnvVar<"horizontal" | "vertical">(
          process.env.NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ORIENTATION,
          "vertical",
        ),
      },
    },
  },
  mailer: {
    host: ensureApiEnvVar(process.env.MAILER_SMTP_HOST, "127.0.0.1"),
    smtp: {
      port: ensureApiEnvVar(process.env.MAILER_SMTP_PORT, Number, 1025),
      password: ensureApiEnvVar(process.env.MAILER_SMTP_PASSWORD, ""),
      login: ensureApiEnvVar(process.env.MAILER_SMTP_LOGIN, ""),
      ssl: ensureApiEnvVar(process.env.MAILER_SMTP_SSL, isTruthy, false),
    },
    // TODO: change
    from: ensureApiEnvVar(process.env.MAILER_FROM_EMAIL, "Roadmaps <noreply@roadmap.beta.gouv.fr>"),
  },
  security: {
    auth: {
      secret: ensureApiEnvVar(process.env.SECURITY_JWT_SECRET, "secret"),
    },
    webhook: {
      secret: ensureApiEnvVar(process.env.SECURITY_WEBHOOK_SECRET, "secret"),
    },
  },
  espaceMembre: {
    apiKey: ensureApiEnvVar(process.env.ESPACE_MEMBRE_API_KEY, ""),
    url: ensureApiEnvVar(process.env.ESPACE_MEMBRE_URL, "https://espace-membre.incubateur.net"),
  },
  redis: {
    url: ensureApiEnvVar(process.env.REDIS_URL, ""),
    base: ensureApiEnvVar(process.env.REDIS_BASE, "roadmaps-faciles"),
    host: ensureApiEnvVar(process.env.REDIS_HOST, "localhost"),
    port: ensureApiEnvVar(process.env.REDIS_PORT, Number, 6379),
    tls: ensureApiEnvVar(process.env.REDIS_TLS, isTruthy, false),
    password: ensureApiEnvVar(process.env.REDIS_PASSWORD, ""),
  },
} as const;

if (config.env !== "prod") {
  // log with emoji
  console.log("🚧", "Config loaded in non prod env");
  inspect(config, { depth: Infinity, colors: true });
  console.log("🚧", "==========================");
}
