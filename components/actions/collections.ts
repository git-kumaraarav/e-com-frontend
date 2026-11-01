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
import { UnauthorizedError } from "@/lib/errors";
import type { CartItem, Product, WishlistItem } from "@/types/backend";

export type ClientCartItem = Omit<CartItem, "product"> & { product: Product };
export type ClientWishlistItem = Omit<WishlistItem, "product"> & {
  product: Product;
};

async function resolveProduct(
  product: number | Product,
  products: Map<number, Product>,
  pendingProducts: Map<number, Promise<Product>>,
  productListPromise: Promise<Product[]>,
) {
  if (typeof product !== "number") {
    const normalized = normalizeProduct(product);
    products.set(normalized.id, normalized);
    return normalized;
  }

  const cached = products.get(product);
  if (cached) return cached;

  const pending = pendingProducts.get(product);
  if (pending) return pending;

  const request = productListPromise
    .then((productList) => {
      const productSummary = productList.find((entry) => entry.id === product);
      if (!productSummary?.slug) {
        throw new Error(`Product ${product} does not have a slug.`);
      }
      return getProduct(productSummary.slug).then(normalizeProduct);
    })
    .then((resolved) => {
      products.set(resolved.id, resolved);
      pendingProducts.delete(product);
      return resolved;
    })
    .catch((error) => {
      pendingProducts.delete(product);
      throw error;
    });

  pendingProducts.set(product, request);
  return request;
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
    const pendingProducts = new Map<number, Promise<Product>>();
    const hasNumericProduct = [...cartItems, ...wishlistItems].some(
      (item) => typeof item.product === "number",
    );
    const productListPromise = hasNumericProduct
      ? listProducts().then((items) => items.map(normalizeProduct))
      : Promise.resolve([]);

    return {
      cart: await Promise.all(
        cartItems.map(async (item) => ({
          ...item,
          product: await resolveProduct(
            item.product,
            products,
            pendingProducts,
            productListPromise,
          ),
        })),
      ),
      wishlist: await Promise.all(
        wishlistItems.map(async (item) => ({
          ...item,
          product: await resolveProduct(
            item.product,
            products,
            pendingProducts,
            productListPromise,
          ),
        })),
      ),
      authenticated: true,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
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
