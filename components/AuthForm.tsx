"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { setUser } = useStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  return (
    <Card className="w-full max-w-md shadow-lg">
      <form onSubmit={submit}>
        <CardContent className="space-y-4 p-6">
        <CardTitle className="text-center text-2xl">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        {mode === "register" && (
          <Input
            required
            name="name"
            className="w-full"
            placeholder="Full name"
          />
        )}
        <Input
          required
          name="email"
          type="email"
          className="w-full"
          placeholder="Email"
        />
        <Input
          required
          name="password"
          type="password"
          minLength={8}
          className="w-full"
          placeholder="Password"
        />
        {mode === "register" && (
          <Input
            required
            name="password_confirmation"
            type="password"
            minLength={8}
            className="w-full"
            placeholder="Confirm password"
          />
        )}
        {error && <Alert variant="destructive">{error}</Alert>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : mode === "login" ? (
            "Login"
          ) : (
            "Register"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={mode === "login" ? "/register" : "/login"}
          >
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
        </CardContent>
      </form>
    </Card>
  );
}
