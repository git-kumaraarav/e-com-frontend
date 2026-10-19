"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { AuthFormState } from "@/types/auth";
import { loginAction } from "@/components/actions/login";


const LoginScreen = () => {
  const initalState: AuthFormState = {
    errors: {},
  };

  const [state, formAction, isPending] =  useActionState(loginAction, initalState);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form action={formAction} className="bg-card w-full max-w-lg p-4 radius-card space-card">
        <div className="justify-center flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          { state.errors.email && (<p>{state.errors.email}</p>) }
          <Input id="email" name="email" type="email" placeholder="john@email.com" className="bg-secondary"/>

          <label htmlFor="password">Password</label>
          { state.errors.major && (<p>{state.errors.major}</p>) }
          <Input id="password" name="password" type="password" placeholder="••••••••" className="bg-secondary"/>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Login"
            )}
          </Button>
        </div>
    </form>
    </div>
  );
};

export default LoginScreen;
