"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { createOrderAction } from "@/components/actions/orders";
import { CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await createOrderAction(
        String(form.get("address") ?? ""),
        cart.map(({ id, quantity }) => ({ product_id: id, quantity })),
      );
      router.push("/u/orders-and-returns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  if (!cart.length) return <Alert>Your cart is empty. <Link href="/" className="font-medium text-primary hover:underline">Continue shopping</Link></Alert>;
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form className="lg:col-span-2" onSubmit={submit}><Card className="shadow"><CardContent className="space-y-4 p-6">
        <CardTitle className="text-2xl">Checkout</CardTitle>
        <label className="space-y-2"><span className="text-sm font-medium">Email</span><Input required name="email" type="email" /></label>
        <label className="space-y-2"><span className="text-sm font-medium">Shipping address</span><Textarea required name="address" rows={4} /></label>
        {error && <Alert variant="destructive">{error}</Alert>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <CreditCard className="size-4" aria-hidden="true" />
          )}
          Continue to payment
        </Button>
      </CardContent></Card></form>
      <Card className="h-fit shadow"><CardContent><CardTitle>Total</CardTitle><p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p></CardContent></Card>
    </div>
  );
}
