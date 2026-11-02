import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const backendUrl =
  process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

function resolveUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!backendUrl) throw new Error("BACKEND_ROOT_URL is not configured.");
  return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(resolveUrl(path), {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (response.status === 401) {
    redirect('/login')
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${detail || response.statusText}`,
    );
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
