import NextAuth from "next-auth";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { TokenResponse } from "@/types/auth";

const backendUrl =
  process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

function endpoint(path: string) {
  if (!backendUrl) throw new Error("BACKEND_ROOT_URL is not configured.");
  return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function exchangeGoogleToken(idToken: string) {
  const response = await fetch(endpoint("/api/auth/oauth/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "google", token: idToken }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Google authentication was rejected.");
  return response.json() as Promise<TokenResponse>;
}

function backendTokens(data: TokenResponse) {
  const accessToken = data.access ?? data.data?.access;
  const refreshToken = data.refresh ?? data.data?.refresh;
  if (!accessToken || !refreshToken) {
    throw new Error("The authentication response did not contain both tokens.");
  }
  return { accessToken, refreshToken };
}

async function refreshBackendToken(refreshToken: string) {
  const response = await fetch(endpoint("/api/auth/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The authentication session has expired.");
  return backendTokens((await response.json()) as TokenResponse);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const response = await fetch(endpoint("/api/auth/login/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          cache: "no-store",
        });
        if (!response.ok) return null;
        const backendResponseJson= (await response.json()) as TokenResponse;

        if (!backendResponseJson.data) return null;

        return {
          id: String(backendResponseJson.data?.user.email),
          name: backendResponseJson.data?.user.name, 
          email: backendResponseJson.data?.user.email,
          accessToken: backendResponseJson.data?.access,
          refreshToken: backendResponseJson.data?.refresh,
          expiresAt: new Date(backendResponseJson.data?.expires_at).toISOString()
        } satisfies User;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, account }) {
      
      if (account?.provider === "google" && account.id_token) {
        const backendResponseJson = await exchangeGoogleToken(account.id_token)
        if (!backendResponseJson.data) throw new Error("Failed to exchange Google token for backend tokens.");

        token.accessToken = backendResponseJson.data.access;
        token.refreshToken = backendResponseJson.data.refresh;
        token.expiresAt = new Date(backendResponseJson.data?.expires_at).toISOString();
        token.user = backendResponseJson.data.user ? {
          email: backendResponseJson.data.user.email,
          name: backendResponseJson.data.user.name,
        } : undefined;
      } else if (user && "accessToken" in user && "refreshToken" in user) {

        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.user = {
          email: user.email ?? "",
          name: user.name ?? undefined,
        };
      }

      // Refresh the access token if it has expired
      if (
        token.accessToken &&
        token.refreshToken &&
        token.expiresAt &&
        Date.now() >= new Date(token.expiresAt as string).getTime()
      ) {
        const tokens = await refreshBackendToken(token.refreshToken);
        token.accessToken = tokens.accessToken;
        token.refreshToken = tokens.refreshToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        if (typeof token.expiresAt === "number" || typeof token.expiresAt === "string") {
          session.expires = new Date(token.expiresAt).toISOString();
        }
      }
      return session;
    },
  },
};


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

