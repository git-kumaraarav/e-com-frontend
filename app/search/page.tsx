import { ProductListing } from "@/components/ProductListing";
import { listProducts, normalizeProduct } from "@/lib/api";
import { Alert } from "@/components/ui/alert";

export const instant = false;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = (await listProducts()).map(normalizeProduct);
  const matches = products.filter((product) =>
    `${product.title} ${product.description} ${product.category}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Search results for “{q}”</h1>
      {matches.length ? (
        <ProductListing products={matches} />
      ) : (
        <Alert>No products matched your search.</Alert>
      )}
    </section>
  );
}
