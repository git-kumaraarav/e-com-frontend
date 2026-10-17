import ProductListing from "@/components/apicalls/products";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";
import Link from "next/link";

export default async function FeaturedProducts() {
  let products: productType[];

  try {
    products = await FetchAPI<productType[]>("/products");
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return (
      <section className="w-full">
        <div role="alert" className="alert alert-error">
          Featured products are temporarily unavailable. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="badge badge-primary badge-outline">Shop now</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">Popular products</h2>
          <p className="mt-1 text-base-content/70">A few customer favorites to get you started.</p>
        </div>
        <Link href="/all" className="btn btn-outline btn-sm">
          View all
        </Link>
      </div>
      <ProductListing products={products.slice(0, 4)} />
    </section>
  );
}
