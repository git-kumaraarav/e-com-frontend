"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";

export default function CartView() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  if (!cart.length) return <div className="hero rounded-box bg-base-100 py-20 shadow"><div className="hero-content text-center"><div><h1 className="text-3xl font-bold">Your cart is empty</h1><p className="py-4 text-base-content/70">Add products to start your order.</p><Link href="/" className="btn btn-primary">Continue shopping</Link></div></div></div>;
  return <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
    <div className="space-y-4">{cart.map((item) => <div key={item.id} className="card card-side bg-base-100 p-4 shadow">
      <Image src={item.image} alt="" width={96} height={96} className="h-24 w-24 object-contain" />
      <div className="card-body p-2"><Link href={`/${item.category}/${item.id}`} className="card-title text-base">{item.title}</Link><p>${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2"><input className="input input-bordered input-sm w-20" type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} aria-label={`Quantity for ${item.title}`} /><button className="btn btn-ghost btn-sm text-error" onClick={() => removeFromCart(item.id)}>Remove</button></div>
      </div>
    </div>)}</div>
    <aside className="card h-fit bg-base-100 shadow"><div className="card-body"><h2 className="card-title">Order summary</h2><div className="flex justify-between"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div><Link href="/checkout" className="btn btn-primary mt-4">Checkout</Link></div></aside>
  </div>;
}
