import { Callback } from "@/features/auth/components/callback";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl ">Loading...</p>
      <Loader className="size-12 animate-spin" />
      <Suspense>
        <Callback />
      </Suspense>
    </div>
  );
}
