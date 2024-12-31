import { SignInCard } from "@/features/auth/components/sign-in-card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }
  return <SignInCard />;
}
