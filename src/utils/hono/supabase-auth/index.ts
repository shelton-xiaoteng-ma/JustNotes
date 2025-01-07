import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/auth-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { Context, MiddlewareHandler } from "hono";

export const supabaseMiddleware: MiddlewareHandler = async (c, next) => {
  // Attach Supabase client to the context
  const supabase = await createClient();
  const headers = c.req.raw.headers;

  if (headers) {
    headers.forEach((value, key) => {
      c.res.headers.append(key, value);
    });
    const locationHeader = headers.get("location");
    if (locationHeader) {
      const validUrlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
      if (validUrlPattern.test(locationHeader)) {
        c.redirect(locationHeader, 307);
        return;
      } else {
        return c.json({ error: "Invalid redirect URL" }, 400);
      }
    }
  }

  // try to get the user from the cookies
  const { data: userFromCookie, error: errorFromCookie } =
    await supabase.auth.getUser();
  if (errorFromCookie) {
    // Try to get the user from the Authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Authorization header missing" }, 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ error: "Token missing in Authorization header" }, 401);
    }
    const { data: userFromToken, error } = await supabase.auth.getUser(token);
    if (error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("supabaseAuth", userFromToken);
  } else {
    c.set("supabaseAuth", userFromCookie);
  }
  c.set("supabase", supabase);
  await next();
};

export const getAuth = (c: Context): { user: User } | null => {
  return c.get("supabaseAuth") || null;
};

export const getSupabaseClient = (c: Context): SupabaseClient => {
  return c.get("supabase");
};
