import { getUserDetails } from "@/components/utils/authUtils";

export const instant = false;

export default async function Me() {
  const userData = await getUserDetails();

  return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-card p-4">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p>You are successfully logged in.</p>
        <p>User: {userData.name ?? userData.username ?? userData.email}</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
}
