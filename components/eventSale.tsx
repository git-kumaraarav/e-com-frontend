import Image from "next/image";
import type { Banner } from "@/types/backend";
import { EventSaleImageUrl } from "@/lib/api";
import Link from "next/link";

const EventSale = async () => {
  let banner: Banner[] = [];

  try {
    banner = await EventSaleImageUrl();
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
              height={100}
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
