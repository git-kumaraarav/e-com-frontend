import ProductListing from "@/components/apicalls/products";
import { Suspense } from "react";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ListingPage = ({ params }: ListingPageProps) => {
  return (
    <div className="w-full">
      <div className="mb-6 space-y-2">
        <p className="badge badge-primary badge-outline">Collection</p>
        <h1 className="font-heading text-3xl font-semibold capitalize">Products</h1>
      </div>

      <Suspense fallback={<span className="loading loading-spinner loading-md" aria-label="Loading products" />}>
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
