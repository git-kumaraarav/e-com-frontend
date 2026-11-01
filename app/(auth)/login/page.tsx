"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useStore } from "@/lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { syncAuthenticatedState } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      await syncAuthenticatedState();
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Unable to sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-96 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 rounded-lg bg-card p-4"
      >
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="flex flex-col justify-center gap-2">
          <GoogleSignInButton />
          <div className="flex items-center gap-3 py-1 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alice@example.com"
            className="bg-secondary"
            required
          />
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="bg-secondary"
            required
          />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <FontAwesomeIcon icon={faRightToBracket} className="size-4" aria-hidden="true" />
                Login
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
