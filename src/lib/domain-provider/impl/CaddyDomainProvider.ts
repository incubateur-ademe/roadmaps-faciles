import { config } from "@/config";

import { type DomainStatus, type DomainType, type IDomainProvider } from "../IDomainProvider";

export class CaddyDomainProvider implements IDomainProvider {
  private get adminUrl() {
    return config.domainProvider.caddy.adminUrl;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async addDomain(domain: string, type: DomainType): Promise<void> {
    // On-demand TLS handles certificate provisioning automatically via the `ask` endpoint.
    console.log(`[CaddyDomainProvider] addDomain: ${domain} (${type}) — on-demand TLS, no action needed`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async removeDomain(domain: string): Promise<void> {
    // Caddy's on-demand TLS will stop renewing once the `ask` endpoint returns 404.
    console.log(`[CaddyDomainProvider] removeDomain: ${domain} — domain removed from DB, cert will not renew`);
  }

  public async checkStatus(domain: string): Promise<DomainStatus> {
    try {
      const response = await fetch(`${this.adminUrl}/config/`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) return "active";
      console.warn(`[CaddyDomainProvider] checkStatus: Caddy returned ${response.status} for ${domain}`);
      return "error";
    } catch (error) {
      console.warn(`[CaddyDomainProvider] checkStatus: Caddy unreachable for ${domain}`, error);
      return "error";
    }
  }
}
