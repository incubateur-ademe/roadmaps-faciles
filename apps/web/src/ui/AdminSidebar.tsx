"use client";

import {
  cn,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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

interface AdminSidebarProps {
  /** Active section ID for IntersectionObserver-based sub-item highlighting (e.g. general page) */
  activeSection?: null | string;
  groups: NavGroup[];
  subtitle?: string;
  title: string;
}

/**
 * Shared admin sidebar component — used by both root and tenant admin layouts.
 *
 * Uses `@kokatsuna/ui` Sidebar compound component.
 * Nav is flat by default, sub-items only appear for pages that need them (e.g. general settings).
 */
export const AdminSidebar = ({ title, subtitle, groups, activeSection }: AdminSidebarProps) => {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.matchPrefix) return pathname.startsWith(item.href);
    // Exact segment match: /admin/boards should not match /admin/boards-something
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const isSubItemActive = (subItem: SubItem, parentItem: NavItem) => {
    // Hash-based sub-items (e.g. /admin/general#privacy)
    if (subItem.href.includes("#")) {
      const sectionId = subItem.href.split("#")[1];
      return isItemActive(parentItem) && activeSection === sectionId;
    }
    return pathname === subItem.href;
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-sm font-semibold truncate">{title}</span>
        </div>
        {subtitle && <span className="text-xs text-muted-foreground truncate">{subtitle}</span>}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {groups.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const active = isItemActive(item);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon className={cn("size-4", active && "text-primary")} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
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
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
