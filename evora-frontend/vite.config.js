import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    include: ['hls.js', '@react-three/drei']
  },
  resolve: {
    alias: {
      'hls.js': fileURLToPath(new URL('./node_modules/hls.js/dist/hls.js', import.meta.url))
    }
  }
})
