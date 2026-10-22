"use server";

import { deleteTokensFromCookie } from "@/components/utils/authUtils";

export async function logoutAction() {
  await deleteTokensFromCookie();
}
