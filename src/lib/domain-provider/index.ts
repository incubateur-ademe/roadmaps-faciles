import { config } from "@/config";

import { type IDomainProvider } from "./IDomainProvider";
import { CaddyDomainProvider } from "./impl/CaddyDomainProvider";
import { CleverCloudDomainProvider } from "./impl/CleverCloudDomainProvider";
import { NoopDomainProvider } from "./impl/NoopDomainProvider";
import { ScalingoDomainProvider } from "./impl/ScalingoDomainProvider";

let instance: IDomainProvider | null = null;

export const getDomainProvider = (): IDomainProvider => {
  if (instance) return instance;

  switch (config.domainProvider.type) {
    case "scalingo":
      instance = new ScalingoDomainProvider();
      break;
    case "clevercloud":
      instance = new CleverCloudDomainProvider();
      break;
    case "caddy":
      instance = new CaddyDomainProvider();
      break;
    case "noop":
    default:
      instance = new NoopDomainProvider();
      break;
  }

  return instance;
};
