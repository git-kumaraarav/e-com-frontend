"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadCollections } from "@/components/actions/collections";

export async function getAuthenticatedState() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Please sign in to continue." };
  }

  const collections = await loadCollections();
  return {
    user: {
      name: session.user.name ?? session.user.email,
      email: session.user.email,
    },
    wishlist: collections.wishlist,
    cart: collections.cart,
  };
}
