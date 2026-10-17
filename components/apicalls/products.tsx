import { cn } from "@/lib/utils";
import Link from "next/link";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";
import { Suspense } from "react";
import Image from "next/image";
import ProductActions from "@/components/ProductActions";

async function ProductListing({ className, products: providedProducts }: { slug?: string; className?: string; products?: productType[] }) {
  if (providedProducts) {
    return <ProductContainer className={className}>{providedProducts.map((product) => <ProductCard key={product.id} {...product} />)}</ProductContainer>;
  }
  let products: productType[];
  try {
    products = await FetchAPI<productType[]>("/products");
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <ProductContainer className={className}>
        <div role="alert" className="alert alert-error">
          Failed to load products. Please try again later.
        </div>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer className={className}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </ProductContainer>
  );
}

const ProductContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
    <Suspense fallback={<span className="loading loading-spinner loading-md" aria-label="Loading products" />}>
      {children}
    </Suspense>
  </div>
);

const ProductCard = (product: productType) => (
  <article className="card h-full bg-base-100 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
    <Link href={`/${encodeURIComponent(product.category)}/${product.id}`} className="card-body p-5">
      <div className="flex h-52 items-center justify-center rounded-box bg-base-200 p-5">
        <Image src={product.image} alt={product.title} width={240} height={240} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-5">
        <h2 className="line-clamp-2 font-medium">{product.title}</h2>
        <p className="mt-auto text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
      </div>
    </Link>
    <div className="px-5 pb-5"><ProductActions product={product} /></div>
  </article>
);

export default ProductListing;
