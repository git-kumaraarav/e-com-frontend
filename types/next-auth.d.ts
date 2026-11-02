// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extends the built-in User model.
   */
  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number | string ;
  }

  /**
   * Extends the built-in Session model.
   */
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT model.
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      name?: string | null;
      email?: string | null;
    }
  }
}