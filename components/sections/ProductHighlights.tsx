import { Badge } from "@/components/ui/badge";
import { ProductListing } from "@/components/ProductListing";
import type { Product } from "@/types/backend";

type ProductHighlightsProps = {
  products: Product[];
};

function getTrendingProducts(products: Product[]) {
  return [...products]
    .sort((a, b) => {
      const aScore = (a.rating?.rate ?? 0) * (a.rating?.count ?? 0);
      const bScore = (b.rating?.rate ?? 0) * (b.rating?.count ?? 0);
      return bScore - aScore;
    })
    .slice(0, 4);
}

export default function ProductHighlights({
  products,
}: ProductHighlightsProps) {
  const trendingProducts = getTrendingProducts(products);
  const newProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full space-y-5">
        <div>
          <Badge>Trending now</Badge>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            What everyone is loving
          </h2>
          <p className="mt-1 text-muted-foreground">
            Discover the products shoppers are reaching for right now.
          </p>
        </div>
        <ProductListing products={trendingProducts} />
      </section>

      <section className="w-full space-y-5">
        <div>
          <Badge>Just in</Badge>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            Newly launched products
          </h2>
          <p className="mt-1 text-muted-foreground">
            Be the first to explore the latest additions to our collection.
          </p>
        </div>
        <ProductListing products={newProducts} />
      </section>
    </>
  );
}
