import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import type { Banner } from "@/types/backend";
import { EventSaleImageUrl } from "@/lib/api";
import Link from "next/link";

const EventSale = async ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  // define a default values as fallback
  let banner: Banner[] = [
    {
      id: 0,
      imageUrl: "/images/hero1.jpg",
      altText: "Default image",
      title: "fallbacke banner",
      description: "fallback image for banner",
      url: "https://google.com",
    },
  ];

  try {
    banner = await EventSaleImageUrl();
    console.log("Event Sale Banner:", banner);
  } catch (error) {
    console.error("Error fetching event sale image URL:", error);
  }

  return (
    <>
      {
        banner.length > 0 && (
        <div className="w-full overflow-hidden rounded-xl bg-muted shadow-sm">
          <Link href={banner[0].url}>
            <Image
              src={banner[0].imageUrl}
              alt="Exclusive Deal 1"
              className="aspect-video w-full object-cover"
              height={200}
              width={600}
            />
          </Link>
        </div>
      )
    }
    </>
  );

};
export default EventSale;
