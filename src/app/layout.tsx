import "./globals.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SkeletonTheme } from "react-loading-skeleton";

import { config } from "@/config";
import { ConsentBannerAndConsentManagement } from "@/consentManagement";
import { DsfrProvider } from "@/dsfr-bootstrap";
import { getHtmlAttributes } from "@/dsfr-bootstrap/server-only-index";
import { getEffectiveFlags } from "@/lib/feature-flags";
import { FeatureFlagProvider } from "@/lib/feature-flags/client";
import { auth } from "@/lib/next-auth/auth";
import { IdentifyUser } from "@/lib/tracking-provider/IdentifyUser";
import { TrackingProvider } from "@/lib/tracking-provider/TrackingProvider";
import { UIProvider } from "@/ui";
import { SkipLinks } from "@/ui/shadcn/SkipLinks";

import styles from "./root.module.scss";
import { sharedMetadata } from "./shared-metadata";

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
  const [lang, messages, session] = await Promise.all([getLocale(), getMessages(), auth()]);
  const effectiveFlags = await getEffectiveFlags(session);

  return (
    <html lang={lang} {...getHtmlAttributes({ lang })} data-ui-theme="Default" className={cx(styles.app, "snap-y")}>
      <body>
        <SessionProvider refetchOnWindowFocus>
          <NextIntlClientProvider messages={messages}>
            <DsfrProvider lang={lang}>
              <ConsentBannerAndConsentManagement />
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
                  <SkipLinks />
                  <FeatureFlagProvider value={effectiveFlags}>
                    <UIProvider value="Default">
                      <div className={styles.app}>{children}</div>
                    </UIProvider>
                  </FeatureFlagProvider>
                </SkeletonTheme>
              </TrackingProvider>
            </DsfrProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
