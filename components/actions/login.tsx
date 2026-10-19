"use server"
import { cookies } from "next/headers";
import {setTokensToCookies} from "@/components/utils/authUtils";
import { AuthFormErrors, AuthFormState } from "@/types/auth";
import { redirect } from "next/navigation";

export const loginAction = async (initialState: AuthFormState, formData: FormData) => {

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const loginUrl = process.env.BACKEND_ROOT_URL + "/api/auth/login/";

  try {
    const backendResponse = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json();

    if (backendResponse.status === 401) {
      initialState.errors.email = "Invalid email or password";
    }
    if (!backendResponse.ok) {
        initialState.errors.major = "An unexpected error occurred. Please try again.";
    }

    // Set HTTP-only cookies securely
    await setTokensToCookies(data.accessToken, data.refreshToken);

  } catch (error) {
    console.error("Login failed:", error);
    initialState.errors.major = "An unexpected error occurred. Please try again.";
  }

  redirect("/"); // Redirect to home page after successful login
}