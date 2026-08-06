import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_post",
  title: "Create post",
  description: "Create a new blog post. The current date is used unless overridden. Slug is auto-generated from the title if omitted.",
  inputSchema: {
    title: z.string().min(1).describe("Post title."),
    slug: z.string().min(1).optional().describe("URL-safe slug; auto-generated from title if not provided."),
    category: z.enum(["CS Projects", "Math Olympiad", "NBA Analysis"]).describe("Post category."),
    body: z.string().default("").describe("Full post body in Markdown/LaTeX."),
    excerpt: z.string().default("").describe("Short preview excerpt."),
    tags: z.array(z.string()).default([]).describe("List of tags."),
    cover_image: z.string().url().optional().describe("URL to a cover image."),
    published: z.boolean().default(false).describe("Whether the post is publicly visible."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Publication date in YYYY-MM-DD; defaults to today."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const date = input.date ?? new Date().toISOString().slice(0, 10);
    const slug = input.slug ?? input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: input.title,
        slug,
        category: input.category,
        body: input.body,
        excerpt: input.excerpt,
        tags: input.tags,
        cover_image: input.cover_image ?? null,
        published: input.published,
        date,
        sort_order: 0,
      })
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created post "${input.title}" at slug "${slug}".\n${JSON.stringify(data?.[0] ?? {}, null, 2)}` }] };
  },
});
