"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/components/actions/register";
import type { AuthFormState } from "@/types/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const initialState: AuthFormState = { errors: {} };

export default function AuthForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (state.registered) router.push("/login");
  }, [router, state.registered]);

  return (
    <Card className="w-full max-w-md shadow-lg">
      <form action={formAction}>
        <CardContent className="space-y-4 p-6">
          <CardTitle className="text-center text-2xl">Create an account</CardTitle>
          <GoogleSignInButton />
          <div className="flex items-center gap-3 py-1 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Input required name="name" placeholder="Full name" />
          <Input required name="email" type="email" placeholder="Email" />
          <Input required name="password" type="password" minLength={8} placeholder="Password" />
          <Input required name="password_confirmation" type="password" minLength={8} placeholder="Confirm password" />
          {state.errors.major && <Alert variant="destructive">{state.errors.major}</Alert>}
          <Button type="submit" disabled={pending} className="w-full">
            <UserPlus className="size-4" aria-hidden="true" />
            {pending ? "Creating account..." : "Register"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary hover:underline" href="/login">Login</Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
