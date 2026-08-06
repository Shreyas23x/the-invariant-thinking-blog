import { auth, defineMcp } from "@lovable.dev/mcp-js";

import listPostsTool from "./tools/list-posts";
import getPostTool from "./tools/get-post";
import createPostTool from "./tools/create-post";
import updatePostTool from "./tools/update-post";
import deletePostTool from "./tools/delete-post";
import listJournalEntriesTool from "./tools/list-journal-entries";
import createJournalEntryTool from "./tools/create-journal-entry";
import listQuestionsTool from "./tools/list-questions";
import createQuestionTool from "./tools/create-question";
import getSiteStatsTool from "./tools/get-site-stats";
import updatePageContentTool from "./tools/update-page-content";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "invariant-thinking",
  title: "Invariant Thinking",
  version: "1.0.0",
  instructions:
    "MCP server for the Invariant Thinking blog. Tools let you read and manage blog posts, math journal entries, math questions, site stats, and editable page content. Mutations require the connecting user to be an admin of the blog.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listPostsTool,
    getPostTool,
    createPostTool,
    updatePostTool,
    deletePostTool,
    listJournalEntriesTool,
    createJournalEntryTool,
    listQuestionsTool,
    createQuestionTool,
    getSiteStatsTool,
    updatePageContentTool,
  ],
});
