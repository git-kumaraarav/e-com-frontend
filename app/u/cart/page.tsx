"use client";

import {cn} from  "@/lib/utils";
import React from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";



const LoginScreen = ({className, children}:{className?: string, children?: React.ReactNode}) => {
    return (
        <div className={cn("flex items-center justify-center min-h-screen", className)}>
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold mb-4 text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input type="email" placeholder="Email" className="w-full p-2 border rounded mt-2" />
                    <Input type="password" placeholder="Password" className="w-full p-2 border rounded mt-2" />
                    <Button variant="default" className="w-full p-2 border rounded mt-2">
                        Login
                    </Button>
                </CardContent>
                <CardFooter>
                    <CardAction className="flex mt-4 w-full justify-end">
                        <p className="text-sm">
                            Don't have an account? <Link href="/registration" className="text-blue-500 hover:underline">Register</Link>
                        </p> 
                    </CardAction>
                </CardFooter>
            </Card>
        </div>
    ) 

}

export default LoginScreen;