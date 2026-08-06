import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_page_content",
  title: "Update page content",
  description: "Update a page content key (e.g. home hero text) to a new value.",
  inputSchema: {
    key: z.string().min(1).describe("Page content key."),
    value: z.string().describe("New value."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ key, value }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("page_content").upsert({ key, value }, { onConflict: "key" });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Updated page content key "${key}".` }] };
  },
});
