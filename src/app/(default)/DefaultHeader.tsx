import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { Badge } from "@/ui/shadcn/badge";
import { RootHeader } from "@/ui/shadcn/RootHeader";

import { ShadcnNavigation } from "./ShadcnNavigation";
import { ShadcnUserHeaderItem } from "./ShadcnUserHeaderItem";

export const DefaultHeader = async () => {
  const t = await getTranslations("navigation");

  return (
    <RootHeader
      brandName={
        <>
          {config.brand.name}{" "}
          <Badge variant="outline" className="ml-1 text-xs">
            Alpha
          </Badge>
          {config.maintenance && (
            <Badge variant="destructive" className="ml-1 text-xs">
              Maintenance
            </Badge>
          )}
        </>
      }
      homeLinkProps={{
        href: "/",
        title: `${t("home")} - ${config.brand.name}`,
      }}
      navigation={config.maintenance ? undefined : <ShadcnNavigation />}
      quickAccessItems={<ShadcnUserHeaderItem />}
    />
  );
};
