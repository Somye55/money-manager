import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // OPTIONAL: Force Vite to ignore any cached PostCSS settings
  css: {
    postcss: {},
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    // Enable tree-shaking and minification (using default esbuild)
    minify: "esbuild",
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "radix-vendor": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          "chart-vendor": ["recharts"],
        },
      },
    },
    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000,
    // Source maps for debugging (disable in production for smaller bundle)
    sourcemap: false,
  },
});
