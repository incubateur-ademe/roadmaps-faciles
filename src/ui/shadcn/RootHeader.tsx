"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/ui/cn";

import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";

interface RootHeaderProps {
  brandName: React.ReactNode;
  className?: string;
  homeLinkProps: { href: string; title: string };
  navigation?: React.ReactNode;
  quickAccessItems?: React.ReactNode;
}

export const RootHeader = ({ brandName, homeLinkProps, navigation, quickAccessItems, className }: RootHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link
          href={homeLinkProps.href}
          title={homeLinkProps.title}
          className="mr-8 flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          {brandName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-6 text-sm font-medium md:flex">{navigation}</nav>

        <div className="hidden items-center gap-4 md:flex">{quickAccessItems}</div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto">
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-6">{navigation}</nav>
            <div className="mt-6 flex flex-col space-y-2">{quickAccessItems}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
