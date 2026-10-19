// server component

import { cookies } from "next/headers";
import {
  setTokensToCookies,
  refreshAccessToken,
  getUserDetails,
} from "@/components/utils/authUtils";
import { redirect } from "next/navigation";

export default async function Me(request: Request) {
  const userData = await getUserDetails(request);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="bg-card w-full max-w-lg p-4 radius-card space-card">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p>You are successfully logged in.</p>
        <p>User: {userData.name}</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
}
