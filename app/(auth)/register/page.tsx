import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RegistrationCard = ({ className }: { className?: string }) => (
  <div className={cn("flex min-h-[60vh] items-center justify-center", className)}>
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Input type="text" placeholder="Full Name" aria-label="Full Name" />
          <Input type="email" placeholder="Email" aria-label="Email" />
          <Input type="password" placeholder="Password" aria-label="Password" />
          <Input type="password" placeholder="Confirm Password" aria-label="Confirm Password" />
          <Button className="w-full">Register</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </CardFooter>
    </Card>
  </div>
);

export default RegistrationCard;
