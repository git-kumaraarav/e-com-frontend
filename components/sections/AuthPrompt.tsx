import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

export default function AuthPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-4 p-6">
          <CardTitle className="text-center text-2xl">Sign in to continue</CardTitle>
          <div className="space-y-3">
            <Input className="w-full" type="email" placeholder="Email" aria-label="Email" />
            <Input className="w-full" type="password" placeholder="Password" aria-label="Password" />
            <Button className="w-full">
              <LogIn className="size-4" aria-hidden="true" />
              Login
            </Button>
          </div>
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">Register</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
