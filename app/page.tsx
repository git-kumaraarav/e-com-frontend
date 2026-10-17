import Hero from "@/components/sections/Hero";
import Deals from "@/components/sections/Deals";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />
      {/* <Deals /> */}
      <FeaturedProducts />
    </div>
  );
}
