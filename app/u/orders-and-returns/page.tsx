import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { listOrders } from "@/lib/api";
import type { Order } from "@/types/backend";

export const instant = false;

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    orders = await listOrders();
  } catch (error) {
    console.error("Unable to load orders:", error);
    return <Alert variant="destructive">Unable to load your orders right now.</Alert>;
  }

  if (!orders.length) {
    return (
      <Alert>
        You have no orders yet.{" "}
        <Link href="/" className="text-primary hover:underline">Start shopping</Link>
      </Alert>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Orders and returns</h1>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <CardTitle>Order #{order.id}</CardTitle>
              <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
            </div>
            <div className="text-right">
              <p className="font-medium capitalize">{order.status ?? "pending"}</p>
              {order.total !== undefined && <p>${Number(order.total).toFixed(2)}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
