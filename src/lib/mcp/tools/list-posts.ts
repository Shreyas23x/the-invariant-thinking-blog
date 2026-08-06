import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_posts",
  title: "List posts",
  description: "List blog posts with optional filters. Returns id, title, slug, category, date, excerpt, and published status.",
  inputSchema: {
    category: z.enum(["CS Projects", "Math Olympiad", "NBA Analysis"]).optional().describe("Filter by category."),
    published_only: z.boolean().optional().default(false).describe("Only return published posts."),
    limit: z.number().int().min(1).max(100).optional().default(50).describe("Maximum posts to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, published_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let q = supabase.from("posts").select("id, title, slug, category, date, excerpt, published").order("date", { ascending: false });
    if (category) q = q.eq("category", category);
    if (published_only) q = q.eq("published", true);
    q = q.limit(limit);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }] };
  },
});
