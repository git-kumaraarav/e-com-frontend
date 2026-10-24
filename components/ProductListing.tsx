import { Product } from "@/types/backend";
import Link from "next/link";

export const ProductListing = async ({
  products,
}: {
  products: Product[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <img
            src={product.image || "/images/hero1.jpg"}
            alt={product.title || product.name || "Product"}
            className="w-full h-48 object-cover mb-2"
          />

          <div className="flex flex-col items-start">
            <Link
              href={`/${product.category || "products"}/${product.slug}`}
              className="text-blue-500 hover:underline"
            >
              <h2 className="text-lg font-semibold">{product.title || product.name}</h2>
              <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
