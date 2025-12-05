import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For Cloudflare Pages, always use root base path
export default defineConfig({
  plugins: [react()],
  base: '/',
})
