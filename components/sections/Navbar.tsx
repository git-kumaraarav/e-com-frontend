"use client";

import { cn } from "@/lib/utils";
import i from "@/public/company_info.json";
import Image from "next/image";
import { ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import SearchBox from "@/components/SearchBox";
import { useStore } from "@/lib/store";
import ThemeChanger from "@/components/ThemeChanger";
import { logoutAction } from "@/components/actions/logout";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
const Navbar = ({ className }: { className?: string }) => {
  const { user, cartCount, clearUserData } = useStore();
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const logout = () => {
    setLogoutError(null);
    startLogout(async () => {
      try {
        await logoutAction();
        clearUserData();
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
        setLogoutError("Unable to log out. Please try again.");
      }
    });
  };

  return (
    <header
      className={cn(
        "sticky top-3 z-20 mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={i.logo_url}
            alt="Logo"
            width={36}
            height={36}
            className="rounded-lg object-cover"
          />
          <span className="font-heading text-lg font-semibold">
            {i.company_name}
          </span>
        </Link>
      </div>

      <div className="hidden max-w-xl flex-1 items-center justify-center md:flex">
        <SearchBox />
      </div>

      <nav className="flex items-center gap-1">
        <ThemeChanger />
        {logoutError && (
          <p className="text-sm text-destructive" role="alert">
            {logoutError}
          </p>
        )}
        {user ? (
          <NavigationMenu align="end">
            <NavigationMenuList className="flex items-center gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UserIcon className="size-4" />
                  Account
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-48 bg-card text-foreground ">
                  <div className="grid gap-1">
                    <NavigationMenuLink
                      render={<Link href="/u" />}
                      closeOnClick
                    >
                      Manage Account
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      render={<Link href="/u" />}
                      closeOnClick
                    >
                      Settings
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      render={
                        <button
                          type="button"
                          disabled={isLoggingOut}
                          aria-busy={isLoggingOut}
                        />
                      }
                      closeOnClick
                      onClick={logout}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      render={<Link href="/u" />}
                      closeOnClick
                    >
                      Contact Us
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/u/wishlist" />}
                  closeOnClick
                >
                  Wishlist
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/u/cart" />}
                  closeOnClick
                >
                  <ShoppingCart className="size-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <NavigationMenu align="end">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/login" />}
                  closeOnClick
                >
                  Login
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/register" />}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  closeOnClick
                >
                  Register
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
