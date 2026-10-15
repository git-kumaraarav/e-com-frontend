"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    imageUrl: "/images/hero1.jpg",
    url: "https://example.com/offer1",
    altText: "Hero Image 1",
  },
  {
    id: 2,
    imageUrl: "/images/hero1.jpg",
    url: "https://example.com/offer2",
    altText: "Hero Image 2",
  },
  {
    id: 3,
    imageUrl: "/images/hero1.jpg",
    url: "https://example.com/offer3",
    altText: "Hero Image 3",
  },
];

const Hero = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("flex w-full flex-col gap-6", className)}
    >
      {/* carousel */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full h-full"
        >
          <CarouselContent className="w-full h-full">
            <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 border-border bg-background/90 text-foreground shadow-sm hover:bg-background">
              <span className="sr-only">Previous</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 border-border bg-background/90 text-foreground shadow-sm hover:bg-background">
              <span className="sr-only">Next</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </CarouselNext>
            {carouselItems.map((item) => (
              <CarouselItem key={item.id} className="w-full">
                <Link href={item.url}>
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    className="aspect-[2/1] w-full object-cover"
                    height={400}
                    width={800}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Exclusive Deals Images */}
      <div className="w-full overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src="/images/hero1.jpg"
          alt="Exclusive Deal 1"
          className="aspect-[3/1] w-full object-cover"
          height={200}
          width={600}
        />
      </div>
    </div>
  );
};

export default Hero;
