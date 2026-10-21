"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BadRequestError, UnauthorizedError } from "@/lib/errors";
import type { BackendUser } from "@/types/backend";

const backendUrl =
  process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

function endpoint(path: string) {
  if (!backendUrl) throw new Error("BACKEND_ROOT_URL is not configured.");
  return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const setTokensToCookies = async (
  accessToken: string,
  refreshToken: string,
) => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(endpoint("/api/auth/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) throw new UnauthorizedError("Your session has expired.");
  const data = (await response.json()) as { access?: string; refresh?: string };
  if (!data.access)
    throw new UnauthorizedError("The refresh token was rejected.");
  await setTokensToCookies(data.access, data.refresh ?? refreshToken);
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect("/");
};

export const getUserDetails = async (): Promise<BackendUser> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new UnauthorizedError("Please log in to continue.");

  const response = await fetch(endpoint("/api/auth/me/"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (response.status === 401) {
    await refreshAccessToken(cookieStore.get("refreshToken")?.value ?? "");
    return getUserDetails();
  }
  if (response.status === 400) {
    const data = (await response.json()) as { detail?: string };
    throw new BadRequestError(data.detail ?? "Invalid account request.");
  }
  if (!response.ok)
    throw new Error(`Unable to load your account (${response.status}).`);
  const data = (await response.json()) as BackendUser | { data: BackendUser };
  return "data" in data ? data.data : data;
};
