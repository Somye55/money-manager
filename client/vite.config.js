import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // OPTIONAL: Force Vite to ignore any cached PostCSS settings
  css: {
    postcss: {} 
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});