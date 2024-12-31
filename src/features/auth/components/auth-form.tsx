"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoTriangleRight } from "react-icons/go";
import { z } from "zod";
import { useAuthStateStore } from "../store/use-auth-state-store";

interface AuthFormProps {
  authType: "sign-up" | "sign-in";
}

export const AuthForm = ({ authType }: AuthFormProps) => {
  const { loading, setLoading } = useAuthStateStore();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { data, error } = await createClient().auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        form.setError("email", {
          message: error.message || "An unexpected error occurred.",
        });
        return;
      }
      if (data?.user) {
        window.location.href = "/dashboard";
      } else {
        form.setError("email", {
          message: "Authentication failed. Please try again.",
        });
      }
    } catch (error) {
      toast.error(`Unexpected error during sign-in:, ${error}`);
      form.setError("email", {
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Define onSignUp function to handle form submission
  const onSignUp = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { data, error } = await createClient().auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: "/verify" },
      });
      if (error) {
        form.setError("email", {
          message: error.message || "An unexpected error occurred.",
        });
        return;
      }
      if (data?.user) {
        window.location.href = "/sign-in";
      } else {
        form.setError("email", {
          message: "Authentication failed. Please try again.",
        });
      }
    } catch (error) {
      toast.error(`Unexpected error during sign-in:, ${error}`);
      form.setError("root", {
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          authType === "sign-in" ? onSignIn : onSignUp
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel />
              <FormDescription className="text-black">
                Email address
              </FormDescription>
              <FormControl>
                <input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter your email address"
                  className="px-4 h-8 w-full text-sm border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel />
              <FormDescription className="text-black">Password</FormDescription>
              <FormControl>
                <input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter your password"
                  className="px-4 h-8 w-full text-sm border rounded-md"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full h-8 bg-gray-800 rounded-md"
          type="submit"
          disabled={loading}
        >
          Continue <GoTriangleRight />
        </Button>
      </form>
    </Form>
  );
};
