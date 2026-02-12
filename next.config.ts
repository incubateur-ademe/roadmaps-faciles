/* eslint-disable @typescript-eslint/require-await */

import createMDX from "@next/mdx";
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
    isDev && "http://localhost",
    isDev && localCustomDomains.map(domain => `http://${domain}`),
    isDev && localCustomDomains.map(domain => `ws://${domain}`),
  ].flat(),
  "font-src": ["'self'"],
  "media-src": ["'self'"],
  "img-src": ["'self'", "data:", "espace-membre.incubateur.net"],
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

const ContentSecurityPolicy = Object.entries(csp)
  .map(([key, value]) => `${key} ${value.filter(Boolean).join(" ")};`)
  .join(" ");

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
  serverExternalPackages: ["@prisma/client"],
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
    ],
  },

  async headers() {
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
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm", ["remark-mdx-frontmatter", { name: "metadata" }]],
  },
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withMDX(withNextIntl(config));
