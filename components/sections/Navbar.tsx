"use client";

import { cn } from "@/lib/utils";
import i from "@/public/company_info.json";
import Image from "next/image";
import { SettingsIcon, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import { useStore } from "@/lib/store";
import ThemeChanger from "@/components/ThemeChanger";

const Navbar = ({ className }: { className?: string }) => {
  const { user, cartCount } = useStore();

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

      <nav className="flex gap-1">
        <ThemeChanger />
        {user ? (
          <>
            <details className="relative">
              <summary className="inline-flex h-10 cursor-pointer list-none items-center justify-center gap-2 rounded-md px-4 text-sm font-medium hover:bg-muted">
                <UserIcon className="mr-2 size-4" />
                Account
              </summary>
              <ul className="absolute right-0 z-30 mt-2 w-48 rounded-lg border bg-card p-2 shadow">
                <li>
                  <Link href="/u">Manage Account</Link>
                </li>
              </ul>
            </details>
            <Link
              href="/u/addresses"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium hover:bg-muted"
            >
              <SettingsIcon className="mr-2 size-4" />
              Settings
            </Link>
            <Link
              href="/u/wishlist"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium hover:bg-muted"
            >
              Wishlist
            </Link>
            <Link
              href="/u/cart"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium hover:bg-muted"
            >
              <ShoppingCart className="mr-2 size-4" />
              Cart{" "}
              {cartCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium hover:bg-muted"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
