"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthFormState } from "@/types/auth";
import { loginAction } from "@/components/actions/login";
import { useStore } from "@/lib/store";
import { LogIn } from "lucide-react";

const LoginScreen = () => {
  const initalState: AuthFormState = {
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initalState,
  );
  const router = useRouter();
  const { setUser, setWishlist, setCart } = useStore();

  // The server action returns the normalized user only after authentication
  // succeeds; synchronizing it here updates the client navigation state.
  useEffect(() => {
    if (!state.user) return;
    setUser(state.user);
    setWishlist(state.wishlist);
    setCart(state.cart);
    router.push("/");
  }, [
    router,
    setCart,
    setUser,
    setWishlist,
    state.cart,
    state.user,
    state.wishlist,
  ]);

  return (
    <div className="flex min-h-96 items-center justify-center">
      <form
        action={formAction}
        className="w-full max-w-lg space-y-6 rounded-lg bg-card p-4"
      >
        {state.errors.major && (
          <p className="text-red-500 text-center">{state.errors.major}</p>
        )}
        <div className="justify-center flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          {state.errors.email && <p>{state.errors.email}</p>}
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alice@example.com"
            className="bg-secondary"
          />

          <label htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="bg-secondary"
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
