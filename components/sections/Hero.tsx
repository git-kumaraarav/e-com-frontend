"use server";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/backend";
import { listBanners } from "@/lib/api";
import HeroCaroursel from "@/components/heroCarousel";
import EventSale from "@/components/eventSale";

const Hero = async ({ className }: { className?: string }) => {
  let banners: Banner[] = [];

  try {
    banners = await listBanners();
  } catch (error) {
    console.error("Unable to load sale banners:", error);
  }

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {/* carousel */}
      <HeroCaroursel banners={banners} />

      {/* Exclusive Deals Images */}
      <EventSale />
    </div>
  );
};

export default Hero;
