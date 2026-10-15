import { cn } from "@/lib/utils";
import Link from "next/link";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";
import { Suspense } from "react";
import Image from "next/image";

async function ProductListing({ className }: { slug?: string; className?: string }) {
  let products: productType[];
  try {
    products = await FetchAPI<productType[]>("/products");
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <ProductContainer className={className}>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
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
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading products...</div>}>
      {children}
    </Suspense>
  </div>
);

const ProductCard = (product: productType) => (
  <article className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
    <Link href={`/${encodeURIComponent(product.category)}/${product.id}`} className="flex h-full flex-col p-5">
      <div className="flex h-52 items-center justify-center rounded-lg bg-muted p-5">
        <Image src={product.image} alt={product.title} width={240} height={240} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-5">
        <h2 className="line-clamp-2 font-medium text-card-foreground">{product.title}</h2>
        <p className="mt-auto text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  </article>
);

export default ProductListing;
