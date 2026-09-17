import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'shelfmap-icon.svg'],
      manifest: {
        name: 'ShelfMap - Akıllı Atölye & Depolama',
        short_name: 'ShelfMap',
        description: 'Elektronik, alet ve parçalar için hiyerarşik kutu ve raf haritası',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/shelfmap-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('html5-qrcode') || id.includes('qrcode')) return 'qr'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('lucide-react')) return 'icons'
            return 'vendor'
          }
        }
      }
    }
  }
})

