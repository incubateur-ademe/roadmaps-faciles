import Link from "next/link";

import { cn } from "@/ui/cn";

import { Separator } from "./separator";

interface RootFooterLink {
  href: string;
  text: string;
}

interface RootFooterProps {
  bottomLinks?: RootFooterLink[];
  brandName: string;
  className?: string;
  contentDescription?: React.ReactNode;
  license?: React.ReactNode;
  version?: string;
}

export const RootFooter = ({
  brandName,
  contentDescription,
  bottomLinks,
  license,
  version,
  className,
}: RootFooterProps) => (
  <footer className={cn("border-t bg-muted/40", className)}>
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold">{brandName}</p>
          {contentDescription && <p className="mt-1 max-w-md text-sm text-muted-foreground">{contentDescription}</p>}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-4">
          {bottomLinks?.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.text}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {license && <p>{license}</p>}
          {version && <p className="text-muted-foreground/60">{version}</p>}
        </div>
      </div>
    </div>
  </footer>
);
