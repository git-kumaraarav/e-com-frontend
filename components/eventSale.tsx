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
  let banner: Banner[]  = [{ id: 0, imageUrl: "/images/hero1.jpg", altText: "Default image", title: "", description: "", url: "" }];
  try{
    banner = await EventSaleImageUrl();
    console.log("Event Sale Banner:", banner);
  }
  catch (error) {
    console.error("Error fetching event sale image URL:", error);
  }

  return (
    <div className="w-full overflow-hidden rounded-xl bg-muted shadow-sm">
      <Link href={banner[0].url}>
        <Image
          src={banner[0].imageUrl}
          alt="Exclusive Deal 1"
          className="aspect-[3/1] w-full object-cover"
          height={200}
          width={600}
        />
      </Link>
    </div>
  );
};
export default EventSale;
