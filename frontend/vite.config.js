import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/favicon.ico": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
});
