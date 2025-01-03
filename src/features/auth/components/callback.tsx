"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Callback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [hasLogin, setHasLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (hasLogin) return;
      const supabase = createClient();
      await supabase.auth.exchangeCodeForSession(code!);
      setHasLogin(true);
      router.push("/dashboard");
      // if (error) {
      //   console.error("Token Exchange Error", error);
      //   alert("Authentication failed. Please try again.");
      //   router.push("/");
      // }
      // if (data && data.session) {
      //   await supabase.auth.setSession(data.session);
      //   console.log("User logged in successfully");
      //   router.push("/dashboard");
      // }
    };
    if (code) handleCallback();
  }, [code, router, hasLogin]);

  return null;
};
