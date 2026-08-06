import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_post",
  title: "Update post",
  description: "Update an existing blog post by slug. Only provided fields are changed.",
  inputSchema: {
    slug: z.string().min(1).describe("Slug of the post to update."),
    title: z.string().min(1).optional().describe("New title."),
    category: z.enum(["CS Projects", "Math Olympiad", "NBA Analysis"]).optional().describe("New category."),
    body: z.string().optional().describe("New body."),
    excerpt: z.string().optional().describe("New excerpt."),
    tags: z.array(z.string()).optional().describe("New list of tags."),
    cover_image: z.string().url().optional().describe("New cover image URL."),
    published: z.boolean().optional().describe("New published status."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { slug, ...updates } = input;
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) payload[k] = v;
    }
    if (Object.keys(payload).length === 0) {
      return { content: [{ type: "text", text: "No fields provided to update." }], isError: true };
    }
    const { data, error } = await supabase.from("posts").update(payload).eq("slug", slug).select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0) return { content: [{ type: "text", text: `Post "${slug}" not found or not authorized.` }], isError: true };
    return { content: [{ type: "text", text: `Updated post "${slug}".\n${JSON.stringify(data[0], null, 2)}` }] };
  },
});
