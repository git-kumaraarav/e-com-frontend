import { Suspense } from "react";
import Image from "next/image";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";
import ProductActions from "@/components/ProductActions";

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
    <article className="card w-full max-w-6xl bg-base-100 shadow-md md:card-side">
      <figure className="min-h-80 bg-base-200 p-8 md:min-h-112 md:w-1/2">
        <Image
          src={productDetails.image}
          alt={productDetails.title}
          width={560}
          height={560}
          className="h-full max-h-104 w-full object-contain"
          priority
        />
      </figure>
      <div className="card-body justify-center gap-6 md:w-1/2">
        <div className="space-y-3">
          <p className="badge badge-primary badge-outline">
            {productDetails.category}
          </p>
          <h1 className="card-title text-3xl md:text-4xl">
            {productDetails.title}
          </h1>
        </div>
        <p className="text-3xl font-semibold text-primary">
          ${productDetails.price.toFixed(2)}
        </p>
        <p className="max-w-prose leading-7 text-base-content/70">
          {productDetails.description}
        </p>
        <ProductActions product={productDetails} />
      </div>
    </article>
  );
}

function ProductDetailsFallback() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center rounded-box bg-base-100 p-8">
      <span className="loading loading-spinner loading-lg" aria-label="Loading product" />
    </div>
  );
}

export default ProductDetails;
