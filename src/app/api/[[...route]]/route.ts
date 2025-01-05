import { Hono } from "hono";

import { supabaseMiddleware } from "@/utils/hono/supabase-auth";
import { handle } from "hono/vercel";
import category from "./category";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", supabaseMiddleware);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/category", category);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
