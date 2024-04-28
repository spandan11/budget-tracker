"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const routes = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Transactions",
    href: "/transactions",
  },
  {
    label: "Manage",
    href: "/manage",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="flex h-16 items-center justify-evenly gap-4 border-b bg-background px-4 py-4 md:px-6">
      {/* Left section */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Logo />
          <span className="sr-only">Budget Tracker</span>
        </div>

        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground mr-2 py-4",
              {
                "text-foreground border-b-2 border-muted-foreground":
                  pathname === route.href,
              }
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      {/* Mobile Navbar */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <nav className="grid gap-4 text-lg font-normal text-center py-6">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground mr-2",
                  {
                    "text-foreground": pathname === route.href,
                  }
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
      <div className="md:hidden">
        <Logo />
      </div>

      {/* Right section */}
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}
        <ThemeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="icon">
              <UserIcon />
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default Navbar;
