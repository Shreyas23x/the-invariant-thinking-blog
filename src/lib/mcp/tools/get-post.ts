import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_post",
  title: "Get post",
  description: "Fetch a single blog post by slug, including its full body and metadata.",
  inputSchema: {
    slug: z.string().min(1).describe("URL slug of the post."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `Post "${slug}" not found.` }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});
