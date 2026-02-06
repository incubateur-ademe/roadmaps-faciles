import { type ReactElement } from "react";

import { type Tenant } from "@/lib/model/Tenant";
import { type TenantSettings } from "@/lib/model/TenantSettings";
import { tenantSettingsRepo } from "@/lib/repo";
import { GetTenantSettings } from "@/useCases/tenant_settings/GetTenantSettings";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";
import { getTenantFromDomain } from "@/utils/tenant";
import { type EmptyObject } from "@/utils/types";

import { type DomainProps } from "./layout";

type DomainRootPageOptions = {
  withSettings?: boolean;
};
export type DomainPageCombinedProps<Params extends object> = {
  _data: { dirtyDomainFixer: (pathname: string) => string; domain: string; settings?: TenantSettings; tenant: Tenant };
} & DomainProps<Params>;
export type DomainPage<Params extends object = EmptyObject> = (
  props: DomainPageCombinedProps<Params>,
) => Promise<ReactElement> | ReactElement;

// This is a HOP (Higher Order Page) that wraps the page component with the tenant and settings data
export const DomainPageHOP =
  <Params extends object>(options?: DomainRootPageOptions) =>
  (page: DomainPage<Params>) =>
    (async (props: DomainPageCombinedProps<Params>) => {
      const domain = (await props.params).domain;
      const tenant = await getTenantFromDomain(domain);
      let settings: TenantSettings | undefined;

      if (options?.withSettings) {
        const useCase = new GetTenantSettings(tenantSettingsRepo);
        settings = await useCase.execute({
          tenantId: tenant.id,
        });
      }

      const dirtyDomain = await getDirtyDomain();
      const dirtyDomainFixer = dirtyDomain ? dirtySafePathname(dirtyDomain) : (pathname: string) => pathname;

      return page({
        ...props,
        _data: {
          settings,
          tenant,
          dirtyDomainFixer,
          domain,
        },
      });
    }) as (props: unknown) => Promise<ReactElement>;
