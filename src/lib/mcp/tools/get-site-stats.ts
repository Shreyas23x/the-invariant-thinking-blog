import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_site_stats",
  title: "Get site stats",
  description: "Return total site views and total post likes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const [{ count: likes }, { data: stats }] = await Promise.all([
      supabase.from("post_likes").select("*", { count: "exact", head: true }),
      supabase.from("site_stats").select("count").eq("key", "total_views").maybeSingle(),
    ]);
    const result = { total_views: (stats?.count as number) ?? 0, total_likes: likes ?? 0 };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
});
