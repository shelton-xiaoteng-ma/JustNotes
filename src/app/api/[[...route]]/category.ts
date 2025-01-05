import { Database } from "@/database.types";
import { getAuth, getSupabaseClient } from "@/utils/hono/supabase-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const categorySchema = z.object({
  description: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  created_at: z.string().optional(),
  user_id: z.string().optional(),
});

const categoryUpdateSchema = z.object({
  description: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  id: z.string(),
});

const app = new Hono()
  .post("/", zValidator("json", categorySchema), async (c) => {
    const data: Database["public"]["Tables"]["categories"]["Insert"] =
      c.req.valid("json");
    if (!data.user_id) {
      data.user_id = getAuth(c)?.id;
    }
    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }
    const supabase = getSupabaseClient(c);
    const result = await supabase.from("categories").insert(data);
    return c.json(result);
  })
  .get("/", async (c) => {
    const user_id = getAuth(c)?.id;
    if (!user_id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const supabase = getSupabaseClient(c);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      return c.json({ error: error }, 500);
    } else {
      return c.json({ data });
    }
  })
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const user_id = getAuth(c)?.id;
      const { id } = c.req.valid("param");
      if (!user_id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const supabase = getSupabaseClient(c);
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("user_id", user_id)
        .eq("id", id);
      if (error) {
        return c.json({ error: error }, 500);
      } else {
        return c.json({ message: "Deleted successfully", data });
      }
    }
  )
  .patch("/", zValidator("json", categoryUpdateSchema), async (c) => {
    const user_id = getAuth(c)?.id;
    const { id, name, description } = c.req.valid("json");
    if (!user_id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const updateData = {
      name,
      description,
      updated_at: new Date().toISOString(),
    };
    const supabase = getSupabaseClient(c);
    const { data, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("user_id", user_id)
      .eq("id", id);

    if (error) {
      return c.json({ error: error }, 500);
    } else {
      return c.json({ message: "Category updated successfully", data });
    }
  });
export default app;
