"use client";

import { useStore } from "@/lib/store";
import { productType } from "@/types/product";

export default function ProductActions({ product }: { product: productType }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="card-actions flex-wrap">
      <button className="btn btn-primary flex-1" onClick={() => addToCart(product)}>
        Add to cart
      </button>
      <button className={`btn ${wishlisted ? "btn-secondary" : "btn-outline"}`} onClick={() => toggleWishlist(product)}>
        {wishlisted ? "Saved" : "Wishlist"}
      </button>
    </div>
  );
}
