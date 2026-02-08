import "./globals.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { fr } from "@codegouvfr/react-dsfr";
import Display from "@codegouvfr/react-dsfr/Display/Display";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { SkeletonTheme } from "react-loading-skeleton";

import { config } from "@/config";
import { DsfrProvider } from "@/dsfr-bootstrap";
import { DsfrHead, getHtmlAttributes } from "@/dsfr-bootstrap/server-only-index";

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

const lang = "fr";

const RootLayout = ({ children }: LayoutProps<"/">) => {
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
            <DsfrProvider lang={lang}>
              <MuiDsfrThemeProvider>
                <SkeletonTheme
                  baseColor={fr.colors.decisions.background.contrast.grey.default}
                  highlightColor={fr.colors.decisions.background.contrast.grey.active}
                  borderRadius={fr.spacing("1v")}
                  duration={2}
                >
                  {/* <ConsentBannerAndConsentManagement /> */}
                  <Display />
                  <SkipLinks
                    links={[
                      {
                        anchor: `#${contentId}`,
                        label: "Contenu",
                      },
                      {
                        anchor: `#${footerId}`,
                        label: "Pied de page",
                      },
                    ]}
                  />
                  <div className={styles.app}>{children}</div>
                </SkeletonTheme>
              </MuiDsfrThemeProvider>
            </DsfrProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
