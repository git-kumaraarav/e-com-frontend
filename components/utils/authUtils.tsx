"use server";
import AuthForm from "@/components/AuthForm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { UnauthorizedError } from "@/lib/errors";
import { BadRequestError } from "@/lib/errors";
import { BackendResponseFormat } from "@/types/backend";
import { 
  AuthFormErrors,
  AuthFormState
} from "@/types/auth";


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
    maxAge: 60 * 15, // 15 minutes
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const refreshUrl = process.env.BACKEND_REFRESH_URL || "";
  const refreshResp = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!refreshResp.ok) {
    // redirect to login page
    throw new UnauthorizedError(
      "Failed to refresh access token, please log in again.",
    );
  }

  const data = await refreshResp.json();
  await setTokensToCookies(data.accessToken, data.refreshToken);
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // redirect to home page
  redirect("/");
};

export const getUserDetails = async (): Promise<BackendResponseFormat> => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken) {
    throw new UnauthorizedError("No access token available");
  }

  // try to fetch user data
  const resp = await fetch(
    process.env.BACKEND_ROOT_URL || "" + "/api/auth/user/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (resp.status === 401) {
    // Access token might be expired, try to refresh it
    await refreshAccessToken(refreshToken || "");
    // retry
    return getUserDetails();
  } else if (resp.status === 400) {
    // show backend error message
    const errorData = await resp.json();
    throw new BadRequestError(errorData.detail || "Bad request");
  } else if (!resp.ok) {
    throw new Error(`Failed to fetch user details: ${resp.statusText}`);
  }

  return await resp.json();
};


