"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Trash2 } from "lucide-react";

export default function CartView() {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    collectionError,
  } = useStore();
  if (!cart.length)
    return (
      <Card className="py-20">
        <CardContent className="text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="py-4 text-muted-foreground">
            Add products to start your order.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Continue shopping
          </Link>
        </CardContent>
      </Card>
    );
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {collectionError && (
        <p className="text-sm text-destructive lg:col-span-2" role="alert">
          {collectionError}
        </p>
      )}
      <div className="space-y-4 lg:col-span-2">
        {cart.map((item) => (
          <Card key={item.id} className="flex flex-row p-4 shadow">
            <Image
              src={item.image}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
            />
            <CardContent className="p-2">
              <CardTitle className="text-base">
                <Link href={`/${item.category}/${item.slug}`}>{item.title}</Link>
              </CardTitle>
              <p>${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <Input
                  className="h-9 w-20"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                  aria-label={`Quantity for ${item.title}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-fit px-1 py-10 shadow">
        <CardContent>
          <CardTitle>Order summary</CardTitle>
          <div className="flex justify-between">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <Link
            href="/checkout"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            Checkout
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
