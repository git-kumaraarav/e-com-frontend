"use server";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/backend";
import { listBanners } from "@/lib/api";
import HeroCaroursel from "@/components/heroCarousel";
import EventSale from "@/components/eventSale";

type HeroBanner = { id: number; image?: string; link?: string; title?: string };

const Hero = async ({
  className,
}: {
  className?: string;
  banners?: HeroBanner[];
}) => {
  let banners: Banner[] = [];

  try {
    banners = await listBanners();
  } catch (error) {
    console.error("Unable to load sale banners:", error);
  }

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {/* carousel */}
      <HeroCaroursel className="h-96 w-full" banners={banners} />

      {/* Exclusive Deals Images */}
      <EventSale className="h-50 w-full" />
    </div>
  );
};

export default Hero;
