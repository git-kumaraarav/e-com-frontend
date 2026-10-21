"use client";

import { useStore } from "@/lib/store";
import { Product } from "@/types/backend";
import { Button } from "@/components/ui/button";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="flex flex-wrap gap-2">
      <Button className="flex-1" onClick={() => addToCart(product)}>
        Add to cart
      </Button>
      <Button
        variant={wishlisted ? "secondary" : "outline"}
        onClick={() => toggleWishlist(product)}
      >
        {wishlisted ? "Saved" : "Wishlist"}
      </Button>
    </div>
  );
}
