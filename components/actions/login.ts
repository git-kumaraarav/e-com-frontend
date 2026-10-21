"use server";
import {
  getUserDetails,
  setTokensToCookies,
} from "@/components/utils/authUtils";
import type { AuthFormState } from "@/types/auth";

export const loginAction = async (
  _initialState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const backendUrl =
    process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${backendUrl}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password }),
      cache: "no-store",
    });
    // Keep the response shape flexible because the API may return tokens at
    // the top level or inside its standard `data` envelope.
    const data = (await response.json()) as {
      access?: string;
      refresh?: string;
      data?: { access?: string; refresh?: string };
      detail?: string;
      email?: string[];
      non_field_errors?: string[];
    };
    if (response.status === 401)
      return { errors: { email: "Invalid email or password." } };
    if (!response.ok) {
      // Prefer backend validation details so users can correct bad requests
      // without exposing an opaque status-only error.
      return {
        errors: {
          major:
            data.detail ??
            data.email?.[0] ??
            data.non_field_errors?.[0] ??
            `Login failed (${response.status}).`,
        },
      };
    }

    const access = data.access ?? data.data?.access;
    const refresh = data.refresh ?? data.data?.refresh;
    if (!access || !refresh)
      return { errors: { major: "The login response was incomplete." } };

    // Tokens are stored in HTTP-only cookies before loading the profile, so
    // the profile request can use the newly authenticated session.
    await setTokensToCookies(access, refresh);
    const user = await getUserDetails();
    return {
      errors: {},
      user: { name: user.name ?? user.username ?? user.email, email: user.email },
    };
  } catch (error) {
    console.error("Login failed:", error);
    return { errors: { major: "Unable to connect to the commerce API." } };
  }
};
