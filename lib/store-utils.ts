import type {
  CartItem as BackendCartItem,
  Product,
  WishlistItem as BackendWishlistItem,
} from "@/types/backend";

export type User = { name?: string; email: string };
export type ProductWithBackendId = Product & { backendId?: number };
export type CartState = ProductWithBackendId & { quantity: number };
export type WishlistState = ProductWithBackendId;

export const STORAGE_KEYS = {
  cart: "user-cart",
  wishlist: "user-wishlist",
  user: "user",
} as const;

const FALLBACK_PRODUCT: Product = {
  id: 0,
  title: "Product",
  price: 0,
  description: "",
  category: "products",
  image: "/images/hero1.jpg",
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function clearPersistedUserData() {
  localStorage.removeItem(STORAGE_KEYS.cart);
  localStorage.removeItem(STORAGE_KEYS.wishlist);
  localStorage.removeItem(STORAGE_KEYS.user);
}

function productFromBackend(product: number | Product): Product {
  return typeof product === "number"
    ? { ...FALLBACK_PRODUCT, id: product }
    : product;
}

export function mapCartItem(item: BackendCartItem): CartState {
  return {
    ...productFromBackend(item.product),
    quantity: item.quantity,
    backendId: item.id,
  };
}

export function mapWishlistItem(item: BackendWishlistItem): WishlistState {
  return {
    ...productFromBackend(item.product),
    backendId: item.id,
  };
}
