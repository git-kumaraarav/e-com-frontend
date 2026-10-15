import { cn } from "@/lib/utils";
import ProductListing from "@/components/apicalls/products";
import { Suspense } from "react";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ListingPage = ({ params }: ListingPageProps) => {
  return (
    <div className={cn("w-full")}>
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Collection</p>
        <h1 className="font-heading text-3xl font-semibold capitalize">Products</h1>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading products...</div>}>
        <ProductListingContent params={params} />
      </Suspense>
    </div>
  );
};

async function ProductListingContent({ params }: ListingPageProps) {
  const { slug } = await params;
  return <ProductListing slug={slug} />;
}

export default ListingPage;
