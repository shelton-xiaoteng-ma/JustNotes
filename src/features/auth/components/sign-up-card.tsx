"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthCard } from "@/features/auth/components/oauth-card";
import { AuthForm } from "./auth-form";

export const SignUpCard = () => {
  return (
    <div className="w-[400px]">
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthCard />
          <AuthForm authType="sign-up" />
        </CardContent>
        <CardFooter className="p-6 h-16 bg-gray-100 flex items-center justify-center border rounded-b-md">
          <CardDescription>
            Already have an account?{" "}
            <a href="/sign-in" className="text-blue-500">
              Sign in
            </a>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};
