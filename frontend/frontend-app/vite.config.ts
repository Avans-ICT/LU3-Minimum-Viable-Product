import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-avanskeuzecompass-fqg3hsf2c8dgame0.northeurope-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,   // HTTPS backend
        rewrite: (path) => path.replace(/^\/api/, ''), // strip /api prefix als backend dat niet heeft
      },
    },
  },
})