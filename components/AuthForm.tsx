"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { setUser } = useStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await apiRequest<{
        access_token?: string;
        token?: string;
        user?: { id?: number; name?: string; email: string };
      }>(mode === "login" ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const token = result.access_token ?? result.token;
      if (token) localStorage.setItem("commerce-token", token);
      setUser(
        result.user ?? {
          email: String(data.email),
          name: String(data.name ?? ""),
        },
      );
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card w-full max-w-md bg-base-100 shadow-lg"
    >
      <div className="card-body">
        <h1 className="card-title justify-center text-2xl">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>
        {mode === "register" && (
          <input
            required
            name="name"
            className="input input-bordered w-full"
            placeholder="Full name"
          />
        )}
        <input
          required
          name="email"
          type="email"
          className="input input-bordered w-full"
          placeholder="Email"
        />
        <input
          required
          name="password"
          type="password"
          minLength={8}
          className="input input-bordered w-full"
          placeholder="Password"
        />
        {mode === "register" && (
          <input
            required
            name="password_confirmation"
            type="password"
            minLength={8}
            className="input input-bordered w-full"
            placeholder="Confirm password"
          />
        )}
        {error && <div className="alert alert-error">{error}</div>}
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <span className="loading loading-spinner" />
          ) : mode === "login" ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
        <p className="text-center text-sm text-base-content/70">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <Link
            className="link link-primary"
            href={mode === "login" ? "/register" : "/login"}
          >
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </form>
  );
}
