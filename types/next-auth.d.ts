import "next-auth";
import "next-auth/jwt";
import type { BackendUser } from "@/types/backend";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: BackendUser;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: BackendUser;
  }
}
