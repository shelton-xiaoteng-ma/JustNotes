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
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { AuthForm } from "./auth-form";

export const SignInCard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await createClient().auth.getSession();

      if (session) {
        // User is authenticated
        router.replace("/dashboard");
      } else if (error) {
        toast.error(`Error retrieving session:, ${error.message}`);
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="w-[400px]">
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle>Sign in to JustNotes</CardTitle>
          <CardDescription>
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthCard />
          <AuthForm authType="sign-in" />
        </CardContent>
        <CardFooter className="p-6 h-16 bg-gray-100 flex items-center justify-center border rounded-b-md">
          <CardDescription>
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-blue-500">
              Sign up
            </a>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};
