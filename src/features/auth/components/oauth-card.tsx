"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStateStore } from "@/features/auth/store/use-auth-state-store";
import { createClient } from "@/utils/supabase/client";
import type { Provider } from "@supabase/auth-js";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const OAuthCard = () => {
  const { loading, setLoading } = useAuthStateStore();

  const handleOAuthLogin = async (provider: Provider) => {
    setLoading(true);
    // oauth login logic
    try {
      const { data, error } = await createClient().auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback` },
      });
      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      if (data?.url) {
        // Redirect the user to the GitHub login page
        window.location.href = data.url;
      } else {
        toast.error("Unexpected error: No redirect URL provided.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          color="gray"
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          disabled={loading}
        >
          <FaGithub /> Github
        </Button>
        <Button
          variant="outline"
          color="gray"
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
        >
          <FcGoogle /> Google
        </Button>
      </div>
      <Separator className="my-6" />
    </div>
  );
};
