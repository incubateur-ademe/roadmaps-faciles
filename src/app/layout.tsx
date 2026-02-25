import "./globals.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { fr } from "@codegouvfr/react-dsfr";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { SkeletonTheme } from "react-loading-skeleton";

import { config } from "@/config";
import { ConsentBannerAndConsentManagement } from "@/consentManagement";
import { DsfrProvider, StartDsfrOnHydration } from "@/dsfr-bootstrap";
import { DsfrHead, getHtmlAttributes } from "@/dsfr-bootstrap/server-only-index";
import { getEffectiveFlags } from "@/lib/feature-flags";
import { FeatureFlagProvider } from "@/lib/feature-flags/client";
import { auth } from "@/lib/next-auth/auth";
import { IdentifyUser } from "@/lib/tracking-provider/IdentifyUser";
import { TrackingProvider } from "@/lib/tracking-provider/TrackingProvider";

import styles from "./root.module.scss";
import { sharedMetadata } from "./shared-metadata";

const contentId = "content";
const footerId = "footer";

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  ...sharedMetadata,
  title: {
    template: `${config.brand.name} - %s`,
    default: config.brand.name,
  },
  openGraph: {
    title: {
      template: `${config.brand.name} - %s`,
      default: config.brand.name,
    },
    ...sharedMetadata.openGraph,
  },
};

const RootLayout = async ({ children }: LayoutProps<"/">) => {
  const [lang, messages, t, session] = await Promise.all([
    getLocale(),
    getMessages(),
    getTranslations("skipLinks"),
    auth(),
  ]);
  const effectiveFlags = await getEffectiveFlags(session);

  return (
    <html lang={lang} {...getHtmlAttributes({ lang })} className={cx(styles.app, "snap-y")}>
      <head>
        <DsfrHead
          preloadFonts={[
            "Marianne-Light",
            "Marianne-Light_Italic",
            "Marianne-Regular",
            "Marianne-Regular_Italic",
            "Marianne-Medium",
            "Marianne-Medium_Italic",
            "Marianne-Bold",
            "Marianne-Bold_Italic",
          ]}
        />
      </head>
      <body>
        <SessionProvider refetchOnWindowFocus>
          <AppRouterCacheProvider>
            <NextIntlClientProvider messages={messages}>
              <DsfrProvider lang={lang}>
                <ConsentBannerAndConsentManagement />
                <MuiDsfrThemeProvider>
                  <TrackingProvider
                    providerType={config.tracking.provider}
                    posthog={
                      config.tracking.provider === "posthog"
                        ? { apiKey: config.tracking.posthogKey, host: config.tracking.posthogHost }
                        : undefined
                    }
                    matomo={
                      config.tracking.provider === "matomo"
                        ? { url: config.matomo.url, siteId: config.matomo.siteId }
                        : undefined
                    }
                  >
                    <IdentifyUser />
                    <SkeletonTheme
                      baseColor={fr.colors.decisions.background.contrast.grey.default}
                      highlightColor={fr.colors.decisions.background.contrast.grey.active}
                      borderRadius={fr.spacing("1v")}
                      duration={2}
                    >
                      <StartDsfrOnHydration />
                      <SkipLinks
                        links={[
                          {
                            anchor: `#${contentId}`,
                            label: t("content"),
                          },
                          {
                            anchor: `#${footerId}`,
                            label: t("footer"),
                          },
                        ]}
                      />
                      <FeatureFlagProvider value={effectiveFlags}>
                        <div className={styles.app}>{children}</div>
                      </FeatureFlagProvider>
                    </SkeletonTheme>
                  </TrackingProvider>
                </MuiDsfrThemeProvider>
              </DsfrProvider>
            </NextIntlClientProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
