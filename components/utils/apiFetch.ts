import "server-only";

import { cookies } from "next/headers";
import { UnauthorizedError } from "@/lib/errors";
import { refreshAccessToken } from "@/components/utils/authUtils";

const backendUrl = process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

function resolveUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!backendUrl) throw new Error("BACKEND_ROOT_URL is not configured.");
  return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  hasRetried = false,
): Promise<T> {
  const publicRequest = (options.method ?? "GET") === "GET" &&
    (path === "/api/products/" || path === "/api/banners/" || path.startsWith("/api/products/") || path.startsWith("/api/banners/"));
  const cookieStore = publicRequest ? null : await cookies();
  const accessToken = cookieStore?.get("accessToken")?.value;
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(resolveUrl(path), {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (response.status === 401 && !hasRetried) {
    const refreshToken = cookieStore?.get("refreshToken")?.value;
    if (!refreshToken) throw new UnauthorizedError("Please log in to continue.");
    await refreshAccessToken(refreshToken);
    return apiFetch<T>(path, options, true);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API request failed (${response.status}): ${detail || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function unwrap<T>(response: T | BackendResponse<T>): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    (response as BackendResponse<T>).data !== undefined
  ) {
    return (response as BackendResponse<T>).data as T;
  }
  return response as T;
}

type BackendResponse<T> = { data?: T };
