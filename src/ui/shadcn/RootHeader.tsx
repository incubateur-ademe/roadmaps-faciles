"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/ui/cn";

import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

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
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href={homeLinkProps.href} title={homeLinkProps.title} className="mr-8 flex items-center space-x-2">
          <span className="text-lg font-bold tracking-tight">{brandName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">{navigation}</nav>

        <div className="hidden items-center space-x-2 md:flex">{quickAccessItems}</div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto">
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-6">{navigation}</nav>
            <div className="mt-6 flex flex-col space-y-2">{quickAccessItems}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
