"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginScreen = ({ className }: { className?: string }) => (
  <div className={cn("flex min-h-[60vh] items-center justify-center", className)}>
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Input type="email" placeholder="Email" aria-label="Email" />
          <Input type="password" placeholder="Password" aria-label="Password" />
          <Button className="w-full">Login</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </CardFooter>
    </Card>
  </div>
);

export default LoginScreen;
