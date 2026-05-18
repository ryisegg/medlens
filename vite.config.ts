import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Use /medlens/ base for GitHub Pages, / for Capacitor iOS build
const base = process.env.BUILD_TARGET === 'github' ? '/medlens/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
