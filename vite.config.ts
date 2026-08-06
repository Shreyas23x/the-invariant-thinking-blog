import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), mcpPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
