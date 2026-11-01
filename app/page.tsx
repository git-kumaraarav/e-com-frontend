import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductHighlights from "@/components/sections/ProductHighlights";
import CustomOrders from "@/components/sections/CustomOrders";
import { listProducts, normalizeProduct } from "@/lib/api";
import type { Product } from "@/types/backend";

export const instant = false;

export default async function Home() {
  let products: Product[] = [];

  try {
    products = (await listProducts()).map(normalizeProduct);
  } catch (error) {
    console.error("Unable to load homepage products:", error);
  }

  return (
    <div className="space-y-12">
      <Hero />
      <FeaturedProducts products={products} />
      <ProductHighlights products={products} />
      <CustomOrders />
    </div>
  );
}
