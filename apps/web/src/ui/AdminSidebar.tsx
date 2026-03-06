"use client";

import {
  Badge,
  cn,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@kokatsuna/ui";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubItem {
  href: string;
  label: string;
}

interface NavItem {
  badge?: number | string;
  href: string;
  icon: LucideIcon;
  label: string;
  /** Match pathname prefix instead of exact match */
  matchPrefix?: boolean;
  subItems?: SubItem[];
}

export interface NavGroup {
  items: NavItem[];
  label?: string;
}

interface ExtraItem extends NavItem {
  badgeVariant?: "default" | "destructive" | "outline" | "secondary";
}

interface AdminSidebarProps {
  /** Active section ID for IntersectionObserver-based sub-item highlighting */
  activeSection?: null | string;
  /** Extra items shown after a separator below the main nav groups */
  extraItems?: ExtraItem[];
  /** Footer content: system status */
  footer?: {
    status: string;
    version: string;
  };
  groups: NavGroup[];
  /** Header icon — ReactNode for full control (e.g. Image, SVG, or Lucide icon) */
  icon: React.ReactNode;
  subtitle?: string;
  title: string;
}

/**
 * Shared admin sidebar — root and tenant admin layouts.
 *
 * Matches Stitch wireframe: icon + app name header, labeled groups,
 * separated extra items (moderation), status footer.
 */
export const AdminSidebar = ({
  title,
  subtitle,
  icon,
  groups,
  activeSection,
  extraItems,
  footer,
}: AdminSidebarProps) => {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.matchPrefix) return pathname.startsWith(item.href);
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const isSubItemActive = (subItem: SubItem, parentItem: NavItem) => {
    if (subItem.href.includes("#")) {
      const sectionId = subItem.href.split("#")[1];
      return isItemActive(parentItem) && activeSection === sectionId;
    }
    return pathname === subItem.href;
  };

  const renderItem = (item: NavItem, badgeVariant?: "default" | "destructive" | "outline" | "secondary") => {
    const active = isItemActive(item);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <Link href={item.href}>
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
        {item.badge != null && (
          <SidebarMenuBadge>
            <Badge
              variant={badgeVariant ?? "destructive"}
              className="size-5 justify-center rounded-full p-0 text-[10px]"
            >
              {item.badge}
            </Badge>
          </SidebarMenuBadge>
        )}
        {item.subItems && active && (
          <SidebarMenuSub>
            {item.subItems.map(sub => (
              <SidebarMenuSubItem key={sub.href}>
                <SidebarMenuSubButton asChild isActive={isSubItemActive(sub, item)}>
                  <Link href={sub.href}>{sub.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header: app icon + name + subtitle */}
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            {icon}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-bold leading-tight">{title}</span>
            {subtitle && (
              <span className="truncate text-[10px] font-medium text-sidebar-foreground/50">{subtitle}</span>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* Nav groups */}
      <SidebarContent className="px-2 pt-2">
        {groups.map((group, gi) => (
          <SidebarGroup key={gi} className={cn(gi > 0 && "pt-4")}>
            {group.label && (
              <SidebarGroupLabel className="mb-1 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map(item => renderItem(item))}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Extra items (e.g. Moderation) separated by a divider */}
        {extraItems && extraItems.length > 0 && (
          <>
            <SidebarSeparator className="mx-4 my-2" />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>{extraItems.map(item => renderItem(item, item.badgeVariant))}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer: system status */}
      {footer && (
        <SidebarFooter className="mt-auto px-4 pb-4">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <div className="size-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-sidebar-foreground/70">
                {footer.status}
              </span>
            </div>
            <p className="text-[10px] text-sidebar-foreground/50">{footer.version}</p>
          </div>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
};
