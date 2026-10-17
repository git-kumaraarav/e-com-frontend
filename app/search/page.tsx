import ProductListing from "@/components/apicalls/products";
import { FetchAPI } from "@/components/utils/fetchAPI";
import { productType } from "@/types/product";

export const instant = false;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await FetchAPI<productType[]>("/products");
  const matches = products.filter((product) =>
    `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Search results for “{q}”</h1>
      {matches.length ? <ProductListing products={matches} /> : <div className="alert">No products matched your search.</div>}
    </section>
  );
}
