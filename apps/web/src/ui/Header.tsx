"use client";

import { Button, cn, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@kokatsuna/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

export interface HeaderProps {
  brandName?: React.ReactNode;
  className?: string;
  homeLinkProps: { href: string; title: string };
  navigation?: React.ReactNode;
  quickAccessItems?: React.ReactNode;
  serviceName?: string;
  variant?: "root" | "tenant";
}

/**
 * Unified header — root and tenant variants.
 *
 * Root: h-16, max-w-7xl, brandName ReactNode (icon + name + badge).
 * Tenant: h-14, container, serviceName string.
 */
export const Header = ({
  homeLinkProps,
  serviceName,
  brandName,
  navigation,
  quickAccessItems,
  className,
  variant = "tenant",
}: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRoot = variant === "root";

  return (
    <header
      className={cn(
        "z-50 w-full border-b",
        isRoot
          ? "sticky top-0 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background",
        className,
      )}
    >
      <div className={cn("mx-auto flex items-center", isRoot ? "h-16 max-w-7xl px-6" : "h-14 px-4 sm:px-6 lg:px-8")}>
        <Link
          href={homeLinkProps.href}
          title={homeLinkProps.title}
          className={cn("flex items-center", isRoot ? "mr-8 gap-2 text-lg font-bold tracking-tight" : "mr-6 space-x-2")}
        >
          {isRoot && brandName ? brandName : <span className="font-bold">{serviceName}</span>}
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className={cn("hidden flex-1 items-center text-sm font-medium md:flex", isRoot ? "gap-6" : "space-x-6")}
        >
          {navigation}
        </nav>

        <div className={cn("hidden items-center md:flex", isRoot ? "gap-4" : "space-x-2")}>
          <ThemeToggle />
          {quickAccessItems}
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-6">{navigation}</nav>
            <div className="mt-6 flex flex-col space-y-2">
              <ThemeToggle />
              {quickAccessItems}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
