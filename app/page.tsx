import Hero from "@/components/sections/Hero";
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
