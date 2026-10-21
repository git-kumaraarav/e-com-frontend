import { getUserDetails } from "@/components/utils/authUtils";

export const instant = false;

export default async function Me() {
  const userData = await getUserDetails();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="bg-card w-full max-w-lg p-4 radius-card space-card">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p>You are successfully logged in.</p>
        <p>User: {userData.name ?? userData.username ?? userData.email}</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
}
