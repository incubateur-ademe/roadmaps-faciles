import Badge from "@codegouvfr/react-dsfr/Badge";
import Header from "@codegouvfr/react-dsfr/Header";

import { Brand } from "@/components/Brand";
import { config } from "@/config";

import { UserHeaderItem } from "../AuthHeaderItems";
import { LanguageSelectClient } from "../LanguageSelectClient";
import { Navigation } from "./Navigation";

export const DefaultHeader = () => (
  <Header
    navigation={config.maintenance ? null : <Navigation />}
    brandTop={<Brand />}
    homeLinkProps={{
      href: "/",
      title: `Accueil - ${config.brand.name}`,
    }}
    serviceTitle={
      <>
        {config.brand.name}
        &nbsp;
        <Badge as="span" noIcon severity="warning">
          Alpha
        </Badge>
        {config.maintenance && (
          <Badge as="span" noIcon severity="warning">
            Maintenance
          </Badge>
        )}
      </>
    }
    serviceTagline={config.brand.tagline}
    operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
    classes={{
      operator: "shimmer",
    }}
    quickAccessItems={
      config.maintenance
        ? [<LanguageSelectClient key="hqai-lang" />]
        : [<LanguageSelectClient key="hqai-lang" />, <UserHeaderItem key="hqai-user" variant="root" />].filter(Boolean)
    }
  />
);
