 "use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function UserHomePage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  function logout() { localStorage.removeItem("commerce-token"); setUser(null); router.push("/"); }
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
      <Badge>Account</Badge>
      <h1 className="mt-2 font-heading text-3xl font-semibold">Your account</h1>
      <p className="mt-3 text-muted-foreground">{user ? `Signed in as ${user.email}` : "Sign in to manage your profile, orders, and preferences."}</p>
      {user ? <div className="mt-4"><Button variant="destructive" onClick={logout}>Sign out</Button></div> : <Button className="mt-4" onClick={() => router.push("/login")}>Sign in</Button>}
      </CardContent>
    </Card>
  );
}