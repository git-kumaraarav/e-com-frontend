import { Suspense } from "react";
import Image from "next/image";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/backend";
import ProductActions from "@/components/ProductActions";
import { Badge } from "@/components/ui/badge";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
    product: string;
  }>;
};

function ProductDetails({ params }: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsFallback />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({ params }: ProductDetailsPageProps) {
  const { product } = await params;

  const productDetails = await FetchAPI<productType>(`/products/${product}`);

  return (
    <article className="flex w-full max-w-6xl flex-col overflow-hidden rounded-xl border bg-card shadow-md md:flex-row">
      <figure className="min-h-80 bg-muted p-8 md:min-h-112 md:w-1/2">
        <Image
          src={productDetails.image}
          alt={productDetails.title}
          width={560}
          height={560}
          className="h-full max-h-104 w-full object-contain"
          priority
        />
      </figure>
      <div className="flex flex-col justify-center gap-6 p-6 md:w-1/2">
        <div className="space-y-3">
          <Badge>{productDetails.category}</Badge>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {productDetails.title}
          </h1>
        </div>
        <p className="text-3xl font-semibold text-primary">
          ${productDetails.price.toFixed(2)}
        </p>
        <p className="max-w-prose leading-7 text-muted-foreground">
          {productDetails.description}
        </p>
        <ProductActions product={productDetails} />
      </div>
    </article>
  );
}

function ProductDetailsFallback() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center rounded-xl border bg-card p-8">
      <span
        className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-label="Loading product"
      />
    </div>
  );
}

export default ProductDetails;
