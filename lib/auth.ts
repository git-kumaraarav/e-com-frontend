import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { BackendUser } from "@/types/backend";

type TokenResponse = {
  access?: string;
  refresh?: string;
  data?: {
    access?: string;
    refresh?: string;
  };
};

const backendUrl =
  process.env.BACKEND_ROOT_URL ?? process.env.NEXT_PUBLIC_API_URL;

function endpoint(path: string) {
  if (!backendUrl) throw new Error("BACKEND_ROOT_URL is not configured.");
  return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function readBackendUser(accessToken: string): Promise<BackendUser> {
  const response = await fetch(endpoint("/api/auth/me/"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load the authenticated user.");
  const data = (await response.json()) as BackendUser | { data: BackendUser };
  return "data" in data ? data.data : data;
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

        const tokens = backendTokens((await response.json()) as TokenResponse);
        const user = await readBackendUser(tokens.accessToken);
        return {
          id: String(user.id ?? user.email),
          name: user.name ?? user.username ?? user.email,
          email: user.email,
          ...tokens,
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
        const tokens = backendTokens(await exchangeGoogleToken(account.id_token));
        const backendUser = await readBackendUser(tokens.accessToken);
        token.accessToken = tokens.accessToken;
        token.refreshToken = tokens.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        token.user = backendUser;
      } else if (user && "accessToken" in user && "refreshToken" in user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        token.user = {
          email: user.email ?? "",
          name: user.name ?? undefined,
        };
      }

      if (
        token.accessToken &&
        token.refreshToken &&
        token.accessTokenExpires &&
        Date.now() >= token.accessTokenExpires
      ) {
        const tokens = await refreshBackendToken(token.refreshToken);
        token.accessToken = tokens.accessToken;
        token.refreshToken = tokens.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
