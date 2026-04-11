import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_ORIGIN ?? "http://localhost:4000",
        changeOrigin: true,
      },
    },
    hmr: {
      host: "localhost",
      clientPort: 5174,
      port: 5174,
      protocol: "ws",
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
