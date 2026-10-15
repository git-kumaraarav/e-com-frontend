import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Image from "next/image";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";

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
    <article
      className={cn(
        "grid w-full max-w-6xl gap-8 rounded-2xl border border-border bg-card p-6 shadow-sm",
        "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10",
      )}
    >
      <div className="flex min-h-80 items-center justify-center rounded-xl bg-muted p-8 md:min-h-112">
        <Image
          src={productDetails.image}
          alt={productDetails.title}
          width={560}
          height={560}
          className="h-full max-h-104 w-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col justify-center gap-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {productDetails.category}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground md:text-4xl">
            {productDetails.title}
          </h1>
        </div>
        <p className="text-3xl font-semibold text-primary">
          ${productDetails.price.toFixed(2)}
        </p>
        <p className="max-w-prose leading-7 text-muted-foreground">
          {productDetails.description}
        </p>
      </div>
    </article>
  );
}

function ProductDetailsFallback() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center rounded-2xl border border-border bg-card p-8 text-muted-foreground">
      Loading product...
    </div>
  );
}

export default ProductDetails;
