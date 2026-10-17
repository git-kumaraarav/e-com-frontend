"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useStore } from "@/lib/store";
import { apiRequest } from "@/lib/api";

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await apiRequest<{ url?: string }>("/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ product_id: id, quantity })),
          email: form.get("email"),
          address: form.get("address"),
        }),
      });
      if (result.url) window.location.assign(result.url);
      else setError("Checkout session created. Connect the returned session to your payment page.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  if (!cart.length) return <div className="alert">Your cart is empty. <Link href="/" className="link">Continue shopping</Link></div>;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <form onSubmit={submit} className="card bg-base-100 shadow"><div className="card-body">
        <h1 className="card-title text-2xl">Checkout</h1>
        <label className="form-control"><span className="label-text">Email</span><input required name="email" type="email" className="input input-bordered" /></label>
        <label className="form-control"><span className="label-text">Shipping address</span><textarea required name="address" className="textarea textarea-bordered" rows={4} /></label>
        {error && <div className="alert alert-error">{error}</div>}
        <button disabled={loading} className="btn btn-primary mt-2">{loading ? <span className="loading loading-spinner" /> : "Continue to payment"}</button>
      </div></form>
      <aside className="card h-fit bg-base-100 shadow"><div className="card-body"><h2 className="card-title">Total</h2><p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p></div></aside>
    </div>
  );
}
