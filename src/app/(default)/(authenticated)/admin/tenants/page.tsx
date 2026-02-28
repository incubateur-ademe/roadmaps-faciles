import { Pin, PinOff, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { CopyButton } from "@/components/CopyButton";
import { config } from "@/config";
import { Link } from "@/i18n/navigation";
import { appSettingsRepo, tenantRepo } from "@/lib/repo";
import { Button } from "@/ui/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/table";
import { ListAllTenants } from "@/useCases/tenant/ListAllTenants";

import { pinTenant } from "./actions";

const TenantsPage = async () => {
  await connection();

  const [useCase, appSettings, t, tc, locale] = await Promise.all([
    Promise.resolve(new ListAllTenants(tenantRepo)),
    appSettingsRepo.get(),
    getTranslations("adminTenants"),
    getTranslations("common"),
    getLocale(),
  ]);
  const tenants = await useCase.execute();
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("tenantCount", { count: tenants.length })}</p>
        <Button asChild size="sm">
          <Link href="/admin/tenants/new">
            <Plus className="mr-2 size-4" />
            {t("create")}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("url")}</TableHead>
            <TableHead>{t("owners")}</TableHead>
            <TableHead>{t("members")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead>{tc("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map(tenant => {
            const tenantUrl = `${config.host.replace("://", `://${tenant.settings.subdomain}.`)}`;
            const isPinned = tenant.id === appSettings.pinnedTenantId;

            return (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.settings.name ?? `Tenant #${tenant.id}`}</TableCell>
                <TableCell>
                  <Link href={tenantUrl} target="_blank" className="text-primary hover:underline">
                    {tenantUrl}
                  </Link>
                  {tenant.settings.customDomain && (
                    <div className="mt-1 text-xs text-muted-foreground">{tenant.settings.customDomain}</div>
                  )}
                </TableCell>
                <TableCell>
                  <ul className="list-none space-y-0.5">
                    {tenant.members.map(m => (
                      <li key={m.user.email}>
                        <CopyButton className="text-sm text-primary hover:underline" value={m.user.email}>
                          {m.user.name ?? m.user.email}
                        </CopyButton>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{tenant._count.members}</TableCell>
                <TableCell>{dateFormatter.format(new Date(tenant.createdAt))}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <form action={pinTenant.bind(null, tenant.id)}>
                      <Button type="submit" variant={isPinned ? "default" : "ghost"} size="icon" className="size-8">
                        {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                        <span className="sr-only">{isPinned ? t("unpin") : t("pin")}</span>
                      </Button>
                    </form>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/tenants/${tenant.id}`}>{tc("detail")}</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenantsPage;
