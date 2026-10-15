"use client";

import { cn } from "@/lib/utils";
import i from "@/public/company_info.json";
import Image from "next/image";
import { SettingsIcon, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "../ui/input";

const Navbar = ({ className }: { className?: string }) => {
  const loggedIn = false;

  return (
    <header
      className={cn(
        "sticky top-3 z-20 mt-3 flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
            <Image src={i.logo_url} alt="Logo" width={36} height={36} className="rounded-lg object-cover" />
            <span className="font-heading text-lg font-semibold">{i.company_name}</span>
        </Link>
      </div>

      <div className="hidden max-w-xl flex-1 items-center justify-center sm:flex">
        <Input type="search" placeholder="Search products..." aria-label="Search products" />
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          {loggedIn ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UserIcon className="mr-2 size-4" />
                  Account
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/account">Manage Account</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/settings" className={navigationMenuTriggerStyle()}>
                  <SettingsIcon className="mr-2 size-4" />
                  Settings
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/wishlist" className={navigationMenuTriggerStyle()}>
                  Wishlist
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/cart" className={navigationMenuTriggerStyle()}>
                  <ShoppingCart className="mr-2 size-4" />
                  Cart
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
                  Register
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
