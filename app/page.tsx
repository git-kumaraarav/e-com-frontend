import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { listBanners } from "@/lib/api";
import type { Banner } from "@/types/backend";

export const instant = false;

export default async function Home() {
  let banners: Banner[] = [];
  try {
    banners = await listBanners();
  } catch (error) {
    console.error("Unable to load sale banners:", error);
  }
  return (
    <div className="space-y-10">
      <Hero banners={banners} />
      {/* <Deals /> */}
      <FeaturedProducts />
    </div>
  );
}
