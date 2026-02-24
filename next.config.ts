/* eslint-disable @typescript-eslint/require-await */

import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";
import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import packageJson from "./package.json" with { type: "json" };

const { version } = packageJson;

const isDeployment = !!process.env.SOURCE_VERSION;

const env = {
  NEXT_PUBLIC_APP_VERSION: version,
  NEXT_PUBLIC_APP_VERSION_COMMIT: isDeployment ? process.env.SOURCE_VERSION : "dev",
};

const isDev = process.env.NODE_ENV === "development";

const localCustomDomains = ["*.localhost", "mon-espace.local"];

const csp = {
  "default-src": ["'none'"],
  "connect-src": [
    "'self'",
    "https://*.gouv.fr",
    process.env.NEXT_PUBLIC_SENTRY_DSN && "https://*.ingest.sentry.io",
    isDev && "http://localhost",
    isDev && localCustomDomains.map(domain => `http://${domain}`),
    isDev && localCustomDomains.map(domain => `ws://${domain}`),
  ].flat(),
  "font-src": ["'self'"],
  "media-src": ["'self'"],
  "img-src": [
    "'self'",
    "data:",
    "espace-membre.incubateur.net",
    process.env.STORAGE_S3_PUBLIC_URL && new URL(process.env.STORAGE_S3_PUBLIC_URL).host,
  ].flat(),
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    process.env.NEXT_PUBLIC_MATOMO_URL,
    "'unsafe-eval'",
    isDev && "http://localhost",
    isDev && localCustomDomains.map(domain => `http://${domain}`),
  ].flat(),
  "style-src": ["'self'", "'unsafe-inline'"],
  "object-src": ["'self'", "data:"],
  "frame-ancestors": ["'self'"],
  "base-uri": ["'self'", "https://*.gouv.fr"],
  "form-action": ["'self'", "https://*.gouv.fr"],
  "frame-src": ["'none'"],
  ...(!isDev && {
    "block-all-mixed-content": [],
    "upgrade-insecure-requests": [],
  }),
};

const serializeCsp = (cspObj: Record<string, Array<false | string | undefined>>) =>
  Object.entries(cspObj)
    .map(([key, value]) => `${key} ${value.filter(Boolean).join(" ")};`)
    .join(" ");

const ContentSecurityPolicy = serializeCsp(csp);

const embedCsp = {
  ...csp,
  "frame-ancestors": ["*"],
};
const EmbedContentSecurityPolicy = serializeCsp(embedCsp);

const commonSecurityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer, strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "fullscreen=(), display-capture=(), camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "cross-origin",
  },
];

const config: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  allowedDevOrigins: localCustomDomains,
  experimental: {
    serverMinification: true,
    authInterrupts: true,
    optimizePackageImports: ["@/lib/repo", "@/dsfr/client", "@/dsfr"],
    taint: true,
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "pino", "pino-pretty"],
  env,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "espace-membre.incubateur.net",
        pathname: "/api/public/member/*/image",
        port: "",
        search: "",
      },
      ...(process.env.STORAGE_S3_PUBLIC_URL
        ? [
            {
              protocol: new URL(process.env.STORAGE_S3_PUBLIC_URL).protocol.replace(":", "") as "http" | "https",
              hostname: new URL(process.env.STORAGE_S3_PUBLIC_URL).hostname,
              port: new URL(process.env.STORAGE_S3_PUBLIC_URL).port,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },

  async headers() {
    // Order matters: Next.js merges ALL matching rules, last wins for duplicate keys.
    // Catch-all first, then embed override (so embed's relaxed headers take precedence).
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          ...commonSecurityHeaders,
        ],
      },
      {
        source: "/:path*/embed/:rest*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: EmbedContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
          ...commonSecurityHeaders,
        ],
      },
    ];
  },
};

const withMDX = createMDX();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const appEnv = process.env.APP_ENV || "dev";
const enableSentrySourceMaps = appEnv === "prod" || appEnv === "staging";

export default withSentryConfig(withMDX(withNextIntl(config)), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  sourcemaps: {
    disable: !enableSentrySourceMaps,
    deleteSourcemapsAfterUpload: true,
  },
  webpack: {
    autoInstrumentServerFunctions: false,
    autoInstrumentMiddleware: false,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
