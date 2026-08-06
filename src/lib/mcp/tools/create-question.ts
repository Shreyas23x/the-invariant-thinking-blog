import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_question",
  title: "Create question",
  description: "Add a new math problem to the questions bank.",
  inputSchema: {
    title: z.string().min(1).describe("Problem title."),
    body: z.string().default("").describe("Problem statement in Markdown/LaTeX."),
    source: z.string().optional().describe("Source or contest origin."),
    difficulty: z.string().optional().describe("Difficulty label."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Date in YYYY-MM-DD; defaults to today."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ title, body, source, difficulty, date }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const finalDate = date ?? new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("math_questions")
      .insert({ title, body, source: source ?? null, difficulty: difficulty ?? null, date: finalDate, sort_order: 0 })
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created question "${title}".\n${JSON.stringify(data?.[0] ?? {}, null, 2)}` }] };
  },
});
