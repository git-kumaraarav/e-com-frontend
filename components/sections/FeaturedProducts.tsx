import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/backend";
import { ProductListing } from "@/components/ProductListing";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="w-full space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Badge>Shop now</Badge>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            Popular products
          </h2>
          <p className="mt-1 text-muted-foreground">
            A few customer favorites to get you started.
          </p>
        </div>
        <Link
          href="/all"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium shadow-sm hover:bg-muted"
        >
          View all
        </Link>
      </div>
      {products.length > 0 ? (
        <ProductListing products={products.slice(0, 4)} />
      ) : (
        <Alert variant="destructive">
          Featured products are temporarily unavailable. Please try again later.
        </Alert>
      )}
    </section>
  );
}
