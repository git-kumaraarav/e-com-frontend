"use server";

import { createOrder } from "@/lib/api";

export async function createOrderAction(
  shippingAddress: string,
  items: { product_id: number; quantity: number }[],
) {
  return createOrder(shippingAddress, items);
}
