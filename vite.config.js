import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Ensures all routes (e.g. /attendance-calculator) are handled by index.html
  // when previewing with `vite preview`. For production, configure your
  // server/CDN to rewrite all paths to index.html.
  server: {
    port: 5173,
  },
});
