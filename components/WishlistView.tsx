"use client";

import { useStore } from "@/lib/store";
import ProductActions from "@/components/ProductActions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";

export default function WishlistView() {
  const { wishlist, toggleWishlist, collectionError } = useStore();
  if (!wishlist.length)
    return (
      <Alert>
        Your wishlist is empty.{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href="/"
        >
          Browse products
        </Link>
      </Alert>
    );
  return (
    <div className="space-y-4">
      {collectionError && (
        <p className="text-sm text-destructive" role="alert">
          {collectionError}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((product) => (
        <Card key={product.id} className="shadow">
          <Link
            href={`/${product.category}/${product.slug}`}
            className="block p-5"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={240}
              height={240}
              className="h-48 w-full object-contain"
            />
            <h2 className="text-base font-semibold">{product.title}</h2>
            <p className="text-primary">${product.price.toFixed(2)}</p>
          </Link>
          <div className="p-5 pt-0">
            <ProductActions product={product} />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toggleWishlist(product)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Remove from wishlist
            </Button>
          </div>
        </Card>
      ))}
      </div>
    </div>
  );
}
