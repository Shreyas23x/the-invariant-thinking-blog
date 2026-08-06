import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_journal_entry",
  title: "Create journal entry",
  description: "Add a new entry to the math olympiad journal.",
  inputSchema: {
    title: z.string().min(1).describe("Entry title."),
    body: z.string().default("").describe("Entry body in Markdown/LaTeX."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Date in YYYY-MM-DD; defaults to today."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ title, body, date }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const finalDate = date ?? new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ title, body, date: finalDate, sort_order: 0 })
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created journal entry "${title}".\n${JSON.stringify(data?.[0] ?? {}, null, 2)}` }] };
  },
});
