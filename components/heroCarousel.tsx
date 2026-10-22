"use client"; 

import {cn} from '@/lib/utils';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';
import type { Banner } from '@/types/backend';

const HeroCaroursel = ({banners, className, children}:{banners: Banner[], className?: string, children?: React.ReactNode}) => {

  if (!banners || banners.length === 0) {
    banners = [
      { id: 0, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 1, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 2,  imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 3, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 4, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 5, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }, 
      { id: 6, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }
    ]
  
  }

return (
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
        <Carousel plugins={[Autoplay({ delay: 3000 })]} className="h-full w-full">
          <CarouselContent className="h-full w-full">

            <CarouselPrevious className="absolute left-4 top-1/2 z-10 size-9 -translate-y-1/2 rounded-full border border-border bg-card/90 text-foreground shadow-sm hover:bg-card">
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
            <CarouselNext className="absolute right-4 top-1/2 z-10 size-9 -translate-y-1/2 rounded-full border border-border bg-card/90 text-foreground shadow-sm hover:bg-card">
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
            {banners.map((item, index) => (
              <CarouselItem key={item.id} className="w-full">
                <Link href={item.url}>
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    className="aspect-[2/1] w-full object-cover"
                    height={400}
                    width={800}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
) 
}
export default HeroCaroursel;