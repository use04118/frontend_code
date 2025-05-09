import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.API_URL,
        changeOrigin: true,
        secure: false,
      },
    }, // ✅ Correctly closing the proxy object
    strictPort: true,
    open: false,
    cors: true,
  },
});

