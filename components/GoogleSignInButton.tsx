"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthenticatedState } from "@/components/actions/authenticatedState";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  const router = useRouter();
  const { setUser, setWishlist, setCart } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSignIn() {
    setError(null);
    setPending(true);

    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        setError("Unable to sign in with Google.");
        return;
      }

      const state = await getAuthenticatedState();
      if (state.error || !state.user) {
        setError(state.error ?? "Unable to load your Google account.");
        return;
      }

      setUser(state.user);
      setWishlist(state.wishlist);
      setCart(state.cart);
      router.push(result?.url ?? "/");
      router.refresh();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Unable to sign in with Google.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={handleSignIn}
      >
        {pending ? "Connecting to Google..." : "Continue with Google"}
      </Button>
      {error && (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
