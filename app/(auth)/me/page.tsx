import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UnderConstruction from "@/components/UnderConstruction";

export const instant = false;

export default async function Me() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return (
    <div className="flex min-h-96 items-center justify-center">
      <UnderConstruction
        title="Your account page is under construction"
        description="Account settings and profile management are coming soon."
      />
    </div>
  );
}
