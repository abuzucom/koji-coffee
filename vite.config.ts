import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Portable Vite configuration. No Lovable / TanStack Start dependencies.
// Emits a fully static bundle in `dist/` suitable for GitHub Pages or
// Cloudflare Pages. The dev server binds to the sandbox host/port used by
// the Lovable preview so the in-editor preview keeps working while the
// project remains deployable anywhere.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: mode !== "production",
    target: "es2022",
  },
}));
