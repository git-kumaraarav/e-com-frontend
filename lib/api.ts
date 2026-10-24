import "server-only";

import apiFetch, { unwrap } from "@/components/utils/apiFetch";
import type {
  Banner,
  BackendUser,
  CartItem,
  Order,
  Product,
  ProductListResponse,
  ProductResponse,
  WishlistItem,
} from "@/types/backend";

export const listProducts = async (): Promise<Product[]> =>
  unwrap(await apiFetch<ProductListResponse>("/api/products/")) as Product[];

export const getProduct = async (slug: string) =>
  unwrap(await apiFetch<ProductResponse>(`/api/products/${slug}/`));

export const listBanners = async (): Promise<Banner[]> =>
  unwrap(
    await apiFetch<Banner[] | { data: Banner[] }>("/api/banners/"),
  ) as Banner[];

export const getBanner = async (id: string | number) =>
  unwrap(await apiFetch<Banner | { data: Banner }>(`/api/banners/${id}/`));

export const createBanner = async (body: FormData) =>
  apiFetch<Banner>("/api/banners/", { method: "POST", body });

export const updateBanner = async (id: string | number, body: Partial<Banner>) =>
  apiFetch<Banner>(`/api/banners/${id}/`, { method: "PATCH", body: JSON.stringify(body) });

export const deleteBanner = (id: string | number) =>
  apiFetch<void>(`/api/banners/${id}/`, { method: "DELETE" });

export const listEventBanners = async (): Promise<Banner[]> =>
  unwrap(
    await apiFetch<Banner[] | { data: Banner[] }>("/api/event-banners/"),
  ) as Banner[];

export const getEventBanner = async (id: string | number) =>
  unwrap(
    await apiFetch<Banner | { data: Banner }>(`/api/event-banners/${id}/`),
  );

export const createEventBanner = async (body: FormData | Partial<Banner>) =>
  apiFetch<Banner>("/api/event-banners/", {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const updateEventBanner = async (
  id: string | number,
  body: FormData | Partial<Banner>,
) =>
  apiFetch<Banner>(`/api/event-banners/${id}/`, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const deleteEventBanner = (id: string | number) =>
  apiFetch<void>(`/api/event-banners/${id}/`, { method: "DELETE" });

export const getCurrentUser = async () =>
  unwrap(await apiFetch<BackendUser | { data: BackendUser }>("/api/auth/me/"));

export const updateCurrentUser = async (body: Partial<BackendUser>) =>
  unwrap(
    await apiFetch<BackendUser | { data: BackendUser }>("/api/auth/me/", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  );

export const createOrder = async (
  shippingAddress: string,
  items: { product_id: number; quantity: number }[],
) =>
  unwrap(
    await apiFetch<Order | { data: Order }>("/api/orders/", {
      method: "POST",
      body: JSON.stringify({ shipping_address: shippingAddress, items }),
    }),
  );

export const listOrders = async (): Promise<Order[]> =>
  unwrap(
    await apiFetch<Order[] | { data: Order[] }>("/api/orders/"),
  ) as Order[];

export const getOrder = async (id: string | number) =>
  unwrap(await apiFetch<Order | { data: Order }>(`/api/orders/${id}/`));

export const updateOrder = async (id: string | number, status: string) =>
  unwrap(
    await apiFetch<Order | { data: Order }>(`/api/orders/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  );

export const deleteOrder = (id: string | number) =>
  apiFetch<void>(`/api/orders/${id}/`, { method: "DELETE" });

export const listCartItems = async (): Promise<CartItem[]> =>
  unwrap(
    await apiFetch<CartItem[] | { data: CartItem[] }>("/api/u/cart-items/"),
  ) as CartItem[];

export const getCartItem = async (id: string | number) =>
  unwrap(
    await apiFetch<CartItem | { data: CartItem }>(`/api/u/cart-items/${id}/`),
  );

export const addCartItem = async (
  product: number,
  quantity = 1,
  user?: number,
) =>
  unwrap(
    await apiFetch<CartItem | { data: CartItem }>("/api/u/cart-items/", {
      method: "POST",
      body: JSON.stringify({ ...(user === undefined ? {} : { user }), product, quantity }),
    }),
  );

export const updateCartItem = async (id: string | number, quantity: number) =>
  unwrap(
    await apiFetch<CartItem | { data: CartItem }>(
      `/api/u/cart-items/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      },
    ),
  );

export const removeCartItem = (id: string | number) =>
  apiFetch<void>(`/api/u/cart-items/${id}/`, { method: "DELETE" });

export const listWishlistItems = async (): Promise<WishlistItem[]> =>
  unwrap(
    await apiFetch<WishlistItem[] | { data: WishlistItem[] }>(
      "/api/u/wish-list/",
    ),
  ) as WishlistItem[];

export const getWishlistItem = async (id: string | number) =>
  unwrap(
    await apiFetch<WishlistItem | { data: WishlistItem }>(
      `/api/u/wish-list/${id}/`,
    ),
  );

export const addWishlistItem = async (product: number, user?: number) =>
  unwrap(
    await apiFetch<WishlistItem | { data: WishlistItem }>("/api/u/wish-list/", {
      method: "POST",
      body: JSON.stringify({ ...(user === undefined ? {} : { user }), product }),
    }),
  );

export const updateWishlistItem = async (
  id: string | number,
  product: number,
) =>
  unwrap(
    await apiFetch<WishlistItem | { data: WishlistItem }>(
      `/api/u/wish-list/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify({ product }),
      },
    ),
  );

export const removeWishlistItem = (id: string | number) =>
  apiFetch<void>(`/api/u/wish-list/${id}/`, { method: "DELETE" });

export const createProduct = (
  body: Omit<Product, "id" | "title" | "category" | "image"> & {
    name: string;
    slug: string;
  },
) =>
  apiFetch<Product>("/api/products/", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateProduct = (id: string | number, body: Partial<Product>) =>
  apiFetch<Product>(`/api/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteProduct = (id: string | number) =>
  apiFetch<void>(`/api/products/${id}/`, { method: "DELETE" });

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    title: product.title ?? product.name ?? "Product",
    category: product.category ?? "products",
    image: product.image ?? "/images/hero1.jpg",
    price: Number(product.price),
  };
}

export async function EventSaleImageUrl(): Promise<Banner[]> {
  return listEventBanners();
}
