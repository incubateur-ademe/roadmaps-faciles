import { type ReactElement } from "react";
import { type EmptyObject } from "react-hook-form";

import { type Tenant } from "@/lib/model/Tenant";
import { type TenantSetting } from "@/lib/model/TenantSetting";
import { tenantSettingRepo } from "@/lib/repo";
import { GetTenantSettings } from "@/useCases/tenant_settings/GetTenantSettings";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { type DomainProps, getTenantFromDomainProps } from "./getTenantFromDomainParam";

type DomainRootPageOptions = {
  withSettings?: boolean;
};
export type DomainPageCombinedProps<Params extends object> = DomainProps<Params> & {
  _data: { dirtyDomainFixer: (pathname: string) => string; domain: string; settings?: TenantSetting; tenant: Tenant };
};
export type DomainPage<Params extends object = EmptyObject> = (
  props: DomainPageCombinedProps<Params>,
) => Promise<ReactElement> | ReactElement;

// This is a HOP (Higher Order Page) that wraps the page component with the tenant and settings data
export const DomainPageHOP =
  <Params extends object>(options?: DomainRootPageOptions) =>
  (page: DomainPage<Params>) =>
    (async (props: DomainPageCombinedProps<Params>) => {
      const tenant = await getTenantFromDomainProps<Params>(props);
      let settings: TenantSetting | undefined;

      if (options?.withSettings) {
        const useCase = new GetTenantSettings(tenantSettingRepo);
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
          domain: (await props.params).domain,
        },
      });
    }) as (props: unknown) => Promise<ReactElement>;
