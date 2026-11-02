import { User } from "next-auth";
import { CartItem, WishlistItem } from "./backend";
import type { BackendUser } from "@/types/backend";

export type AuthFormErrors = {
  major? : string;
  name? : string; 
  email? : string;
  password? : string;
}

export type AuthFormState = {
  errors: AuthFormErrors; 
  registered?: boolean;
  user?: {
    name: string;
    email: string;
  }
  wishlist?: WishlistItem[];
  cart?: CartItem[];
}

export type TokenResponse = {
  status?: string;
  status_code?: number;
  timestamp?: string;
  data?: {
    access: string;
    refresh: string;
    expires_at: string;
    user: BackendUser;
  };
};

