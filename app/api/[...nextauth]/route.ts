import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type AuthRouteContext = {
  params: Promise<{ nextauth?: string[] }>;
};

function withAuthParams(request: Request) {
  const pathname = new URL(request.url).pathname;
  const nextauth = pathname
    .replace(/^\/api\/auth\/?/, "")
    .split("/")
    .filter(Boolean);

  return {
    params: Promise.resolve({ nextauth }),
  } satisfies AuthRouteContext;
}

export async function GET(request: Request) {
  return handler(request, withAuthParams(request));
}

export async function POST(request: Request) {
  return handler(request, withAuthParams(request));
}
