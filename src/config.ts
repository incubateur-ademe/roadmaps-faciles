import { ensureApiEnvVar, ensureNextEnvVar } from "@/utils/os";
import { isTruthy } from "@/utils/string";

export const config = {
  env: ensureApiEnvVar<"dev" | "prod" | "review" | "staging">(process.env.APP_ENV, "dev"),
  _seeding: ensureApiEnvVar(process.env._SEEDING, isTruthy, false),
  _dbUrl: ensureApiEnvVar(process.env.DATABASE_URL, ""),
  seed: {
    adminName: ensureApiEnvVar(process.env.SEED_ADMIN_NAME, "Admin"),
    adminEmail: ensureApiEnvVar(process.env.SEED_ADMIN_EMAIL, "admin@example.com"),
    // adminPassword: ensureApiEnvVar(process.env.SEED_ADMIN_PASSWORD, "password"),
    adminImage: ensureApiEnvVar(process.env.SEED_ADMIN_IMAGE, ""),
    adminUsername: ensureApiEnvVar(process.env.SEED_ADMIN_USERNAME, "admin"),
    tenantName: ensureApiEnvVar(process.env.SEED_TENANT_NAME, "Le Site par Défaut"),
    tenantSubdomain: ensureApiEnvVar(process.env.SEED_TENANT_SUBDOMAIN, "default"),
    minFakeUsers: ensureApiEnvVar(process.env.SEED_MIN_FAKE_USERS, Number, 8),
    maxFakeUsers: ensureApiEnvVar(process.env.SEED_MAX_FAKE_USERS, Number, 16),
    minFakePosts: ensureApiEnvVar(process.env.SEED_MIN_FAKE_POSTS, Number, 64),
    maxFakePosts: ensureApiEnvVar(process.env.SEED_MAX_FAKE_POSTS, Number, 256),
    maxFakeLikesPerPost: ensureApiEnvVar(process.env.SEED_MAX_FAKE_LIKES_PER_POST, Number, 128),
    maxFakeCommentsPerPost: ensureApiEnvVar(process.env.SEED_MAX_FAKE_COMMENTS_PER_POST, Number, 16),
    maxRepliesPerComment: ensureApiEnvVar(process.env.SEED_MAX_REPLIES_PER_COMMENT, Number, 8),
  },
  maintenance: ensureApiEnvVar(process.env.MAINTENANCE_MODE, isTruthy, false),
  host: ensureNextEnvVar(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  get rootDomain() {
    return this.host.replace(/^(https?:\/\/)?(www\.)?/, "");
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
  oauth: {
    github: {
      clientId: ensureApiEnvVar(process.env.OAUTH_GITHUB_CLIENT_ID, ""),
      clientSecret: ensureApiEnvVar(process.env.OAUTH_GITHUB_CLIENT_SECRET, ""),
    },
    google: {
      clientId: ensureApiEnvVar(process.env.OAUTH_GOOGLE_CLIENT_ID, ""),
      clientSecret: ensureApiEnvVar(process.env.OAUTH_GOOGLE_CLIENT_SECRET, ""),
    },
    proconnect: {
      clientId: ensureApiEnvVar(process.env.OAUTH_PROCONNECT_CLIENT_ID, ""),
      clientSecret: ensureApiEnvVar(process.env.OAUTH_PROCONNECT_CLIENT_SECRET, ""),
      issuer: ensureApiEnvVar(process.env.OAUTH_PROCONNECT_ISSUER, ""),
    },
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
  domainProvider: {
    type: ensureApiEnvVar<"caddy" | "clevercloud" | "noop" | "scalingo-wildcard" | "scalingo">(
      process.env.DOMAIN_PROVIDER,
      "noop",
    ),
    scalingo: {
      apiToken: ensureApiEnvVar(process.env.DOMAIN_SCALINGO_API_TOKEN, ""),
      apiUrl: ensureApiEnvVar(process.env.DOMAIN_SCALINGO_API_URL, "https://api.osc-fr1.scalingo.com"),
      appId: ensureApiEnvVar(process.env.DOMAIN_SCALINGO_APP_ID, ""),
    },
    clevercloud: {
      consumerKey: ensureApiEnvVar(process.env.DOMAIN_CLEVERCLOUD_CONSUMER_KEY, ""),
      consumerSecret: ensureApiEnvVar(process.env.DOMAIN_CLEVERCLOUD_CONSUMER_SECRET, ""),
      token: ensureApiEnvVar(process.env.DOMAIN_CLEVERCLOUD_TOKEN, ""),
      tokenSecret: ensureApiEnvVar(process.env.DOMAIN_CLEVERCLOUD_TOKEN_SECRET, ""),
      appId: ensureApiEnvVar(process.env.DOMAIN_CLEVERCLOUD_APP_ID, ""),
    },
    caddy: {
      adminUrl: ensureApiEnvVar(process.env.DOMAIN_CADDY_ADMIN_URL, "http://localhost:2019"),
    },
  },
  observability: {
    sentryDsn: ensureNextEnvVar(process.env.NEXT_PUBLIC_SENTRY_DSN, ""),
    sentryServerDsn: ensureApiEnvVar(process.env.SENTRY_DSN, ""),
    sentryOrg: ensureApiEnvVar(process.env.SENTRY_ORG, ""),
    sentryProject: ensureApiEnvVar(process.env.SENTRY_PROJECT, ""),
    logLevel: ensureApiEnvVar<"debug" | "error" | "fatal" | "info" | "silent" | "trace" | "warn">(
      process.env.LOG_LEVEL,
      "debug",
    ),
    get sentryEnabled() {
      return !!(this.sentryDsn || this.sentryServerDsn);
    },
    get effectiveSentryDsn() {
      return this.sentryServerDsn || this.sentryDsn;
    },
  },
  dnsProvider: {
    type: ensureApiEnvVar<"cloudflare" | "manual" | "noop" | "ovh">(process.env.DNS_PROVIDER, "noop"),
    get target() {
      const target = ensureApiEnvVar(process.env.DNS_PROVIDER_TARGET, "")
        .replace("http://", "")
        .replace("https://", "");

      if (target.endsWith("/")) {
        return target.slice(0, -1);
      }
      if (!target.endsWith(".")) {
        return target + ".";
      }
      return target;
    },
    ovh: {
      endpoint: ensureApiEnvVar<"ovh-ca" | "ovh-eu">(process.env.DNS_OVH_ENDPOINT, "ovh-eu"),
      applicationKey: ensureApiEnvVar(process.env.DNS_OVH_APPLICATION_KEY, ""),
      applicationSecret: ensureApiEnvVar(process.env.DNS_OVH_APPLICATION_SECRET, ""),
      consumerKey: ensureApiEnvVar(process.env.DNS_OVH_CONSUMER_KEY, ""),
    },
    cloudflare: {
      email: ensureApiEnvVar(process.env.DNS_CLOUDFLARE_EMAIL, ""),
      apiKey: ensureApiEnvVar(process.env.DNS_CLOUDFLARE_API_KEY, ""),
    },
  },
} as const;
