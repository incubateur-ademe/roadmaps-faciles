import { type DomainStatus, type DomainType, type IDomainProvider } from "../IDomainProvider";

export class NoopDomainProvider implements IDomainProvider {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async addDomain(domain: string, type: DomainType): Promise<void> {
    console.log(`[NoopDomainProvider] addDomain: ${domain} (${type})`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async removeDomain(domain: string): Promise<void> {
    console.log(`[NoopDomainProvider] removeDomain: ${domain}`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async checkStatus(domain: string): Promise<DomainStatus> {
    console.log(`[NoopDomainProvider] checkStatus: ${domain}`);
    return "active";
  }
}
