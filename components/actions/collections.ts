"use server";

import {
  addCartItem,
  addWishlistItem,
  getProduct,
  listCartItems,
  listProducts,
  listWishlistItems,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
} from "@/lib/api";
import { normalizeProduct } from "@/lib/api";
import { deleteTokensFromCookie } from "@/components/utils/authUtils";
import { UnauthorizedError } from "@/lib/errors";
import type { CartItem, Product, WishlistItem } from "@/types/backend";

export type ClientCartItem = Omit<CartItem, "product"> & { product: Product };
export type ClientWishlistItem = Omit<WishlistItem, "product"> & {
  product: Product;
};

async function resolveProduct(
  product: number | Product,
  products: Map<number, Product>,
) {
  if (typeof product !== "number") {
    const normalized = normalizeProduct(product);
    products.set(normalized.id, normalized);
    return normalized;
  }

  const cached = products.get(product);
  if (cached) return cached;

  const productList = await listProducts();
  const productSummary = productList.find((entry) => entry.id === product);
  if (!productSummary?.slug) {
    throw new Error(`Product ${product} does not have a slug.`);
  }
  const resolved = normalizeProduct(await getProduct(productSummary.slug));
  products.set(resolved.id, resolved);
  return resolved;
}

export async function loadCollections(): Promise<{
  cart: ClientCartItem[];
  wishlist: ClientWishlistItem[];
  authenticated: boolean;
}> {
  try {
    const [cartItems, wishlistItems] = await Promise.all([
      listCartItems(),
      listWishlistItems(),
    ]);
    const products = new Map<number, Product>();

    return {
      cart: await Promise.all(
        cartItems.map(async (item) => ({
          ...item,
          product: await resolveProduct(item.product, products),
        })),
      ),
      wishlist: await Promise.all(
        wishlistItems.map(async (item) => ({
          ...item,
          product: await resolveProduct(item.product, products),
        })),
      ),
      authenticated: true,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      await deleteTokensFromCookie();
      return { cart: [], wishlist: [], authenticated: false };
    }
    throw error;
  }
}

export async function createRemoteCartItem(product: number, quantity = 1) {
  return addCartItem(product, quantity);
}

export async function updateRemoteCartItem(id: number, quantity: number) {
  return updateCartItem(id, quantity);
}

export async function deleteRemoteCartItem(id: number) {
  return removeCartItem(id);
}

export async function createRemoteWishlistItem(product: number) {
  return addWishlistItem(product);
}

export async function deleteRemoteWishlistItem(id: number) {
  return removeWishlistItem(id);
}
