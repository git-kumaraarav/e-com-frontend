import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/backend";
import { ProductListing } from "@/components/ProductListing";
import { listProducts, normalizeProduct } from "@/lib/api";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const instant = false;

const ListingPage = async ({ params }: ListingPageProps) => {
  await params;
  let products: Product[] = [];

  try {
    products = (await listProducts()).map(normalizeProduct);
  } catch (error) {
    console.error("Unable to load products:", error);
  }
  

  return (
    <div className="w-full">
      <div className="mb-6 space-y-2">
        <Badge>Collection</Badge>
        <h1 className="font-heading text-3xl font-semibold capitalize">
          Products
        </h1>
      </div>

      <Suspense
        fallback={
          <span
            className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-label="Loading products"
          />
        }
      >
        <ProductListing products={products} />
      </Suspense>
    </div>
  );
};

export default ListingPage;
