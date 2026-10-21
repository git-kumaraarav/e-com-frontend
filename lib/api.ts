import "server-only";

import apiFetch, { unwrap } from "@/components/utils/apiFetch";
import type {
  Banner,
  BackendUser,
  Order,
  Product,
  ProductListResponse,
  ProductResponse,
} from "@/types/backend";

export const listProducts = async (): Promise<Product[]> =>
  unwrap(await apiFetch<ProductListResponse>("/api/products/")) as Product[];

export const getProduct = async (id: string | number) =>
  unwrap(await apiFetch<ProductResponse>(`/api/products/${id}/`));

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
