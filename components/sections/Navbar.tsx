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
        "navbar sticky top-3 z-20 mt-3 w-full rounded-box border border-base-300 bg-base-100/95 shadow-sm backdrop-blur gap-3 justify-between",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
            <Image src={i.logo_url} alt="Logo" width={36} height={36} className="rounded-lg object-cover" />
            <span className="font-heading text-lg font-semibold">{i.company_name}</span>
        </Link>
      </div>

      <div className="hidden max-w-xl flex-1 items-center justify-center md:flex">
        <SearchBox />
      </div>

      <nav className="flex gap-1">
          <ThemeChanger />
          {user ? (
            <>
              <details className="dropdown dropdown-end">
                <summary className="btn btn-ghost">
                  <UserIcon className="mr-2 size-4" />
                  Account
                </summary>
                <ul className="menu dropdown-content z-30 mt-2 w-48 rounded-box bg-base-100 p-2 shadow">
                  <li><Link href="/u">Manage Account</Link></li>
                </ul>
              </details>
              <Link href="/u/addresses" className="btn btn-ghost">
                  <SettingsIcon className="mr-2 size-4" />
                  Settings
              </Link>
              <Link href="/u/wishlist" className="btn btn-ghost">Wishlist</Link>
              <Link href="/u/cart" className="btn btn-ghost">
                  <ShoppingCart className="mr-2 size-4" />
                  Cart {cartCount > 0 && <span className="badge badge-primary">{cartCount}</span>}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Login</Link>
              <Link href="/register" className="btn btn-primary">Register</Link>
            </>
          )}
      </nav>
    </header>
  );
};

export default Navbar;
