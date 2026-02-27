import Link from "next/link";

import { cn } from "@/ui/cn";

import { Badge } from "./badge";
import { Separator } from "./separator";

interface FooterColumn {
  links: Array<{ href: string; text: string }>;
  title: string;
}

interface RootFooterProps {
  badges?: React.ReactNode;
  brandIcon?: React.ReactNode;
  brandName: string;
  className?: string;
  columns?: FooterColumn[];
  contentDescription?: React.ReactNode;
  copyright?: string;
  id?: string;
  license?: React.ReactNode;
  version?: string;
}

export const RootFooter = ({
  brandName,
  brandIcon,
  contentDescription,
  columns,
  badges,
  copyright,
  license,
  version,
  className,
  id,
}: RootFooterProps) => (
  <footer id={id} className={cn("border-t bg-muted/30", className)}>
    <div className="mx-auto max-w-7xl px-6 pb-12 pt-20">
      <div className="mb-20 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand column */}
        <div className="col-span-2">
          <div className="mb-6 flex items-center gap-2 text-primary">
            {brandIcon}
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </div>
          {contentDescription && (
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{contentDescription}</p>
          )}
          {badges && <div className="mt-8 flex gap-3">{badges}</div>}
          {version && (
            <div className="mt-4">
              <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                {version}
              </Badge>
            </div>
          )}
        </div>

        {/* Link columns */}
        {columns?.map(column => (
          <div key={column.title}>
            <h4 className="mb-6 text-sm font-semibold">{column.title}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {column.links.map(link => (
                <li key={link.href + link.text}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:gap-4">
          {copyright && <p>{copyright}</p>}
          {license && <p>{license}</p>}
        </div>
      </div>
    </div>
  </footer>
);
