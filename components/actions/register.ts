"use server";

import type { AuthFormState } from "@/types/auth";

export const registerAction = async (
  _initialState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const backendUrl = process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${backendUrl}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    });
    if (!response.ok) {
      const data = (await response.json()) as {
        detail?: string;
        name?: string[];
        email?: string[];
        password?: string[];
      };
      return {
        errors: {
          major:
            data.detail ??
            data.name?.[0] ??
            data.email?.[0] ??
            data.password?.[0] ??
            "Unable to create your account.",
        },
      };
    }
    return { errors: {}, registered: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { errors: { major: "Unable to connect to the commerce API." } };
  }
};
