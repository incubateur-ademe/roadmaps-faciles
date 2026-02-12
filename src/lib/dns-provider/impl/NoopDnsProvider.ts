import { type DnsProvisionResult, type DnsRecordStatus, type IDnsProvider } from "../IDnsProvider";

export class NoopDnsProvider implements IDnsProvider {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async addRecord(subdomain: string): Promise<DnsProvisionResult> {
    console.log(`[NoopDnsProvider] addRecord: ${subdomain}`);
    return { provisioned: true, status: "active" };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async removeRecord(subdomain: string): Promise<void> {
    console.log(`[NoopDnsProvider] removeRecord: ${subdomain}`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async checkRecord(subdomain: string): Promise<DnsRecordStatus> {
    console.log(`[NoopDnsProvider] checkRecord: ${subdomain}`);
    return "active";
  }
}
