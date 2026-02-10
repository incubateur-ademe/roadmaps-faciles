import { tenantRepo } from "@/lib/repo";
import { getTenantSubdomain } from "@/utils/tenant";

const DOMAIN_RE = /^[a-z0-9.-]+$/;
const MAX_DOMAIN_LENGTH = 253;

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain");
  if (!domain || domain.length > MAX_DOMAIN_LENGTH || !DOMAIN_RE.test(domain)) {
    return new Response("Bad request", { status: 400 });
  }

  const subdomain = getTenantSubdomain(domain);

  const tenant =
    (await tenantRepo.findByCustomDomain(domain)) ?? (subdomain ? await tenantRepo.findBySubdomain(subdomain) : null);

  if (!tenant) return new Response("Not found", { status: 404 });

  return new Response("OK", { status: 200 });
}
