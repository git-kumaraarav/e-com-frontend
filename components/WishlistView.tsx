"use client";

import { useStore } from "@/lib/store";
import ProductActions from "@/components/ProductActions";
import Link from "next/link";
import Image from "next/image";

export default function WishlistView() {
  const { wishlist, toggleWishlist } = useStore();
  if (!wishlist.length) return <div className="alert">Your wishlist is empty. <Link className="link link-primary" href="/">Browse products</Link></div>;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{wishlist.map((product) => <article key={product.id} className="card bg-base-100 shadow"><Link href={`/${product.category}/${product.id}`} className="card-body"><Image src={product.image} alt={product.title} width={240} height={240} className="h-48 w-full object-contain" /><h2 className="card-title text-base">{product.title}</h2><p className="text-primary">${product.price.toFixed(2)}</p></Link><div className="card-actions p-5 pt-0"><ProductActions product={product} /><button className="btn btn-ghost btn-sm w-full" onClick={() => toggleWishlist(product)}>Remove from wishlist</button></div></article>)}</div>;
}
