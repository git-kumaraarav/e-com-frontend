import { CartItem, WishlistItem } from "./backend";

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