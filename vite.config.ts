import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'],
    manifest: {
      name: 'Quizio — conhecimento em jogo',
      short_name: 'Quizio',
      description: 'Quizzes para explorar temas e aprender algo novo.',
      lang: 'pt-BR',
      theme_color: '#fff8ef',
      background_color: '#fff8ef',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: { globPatterns: ['**/*.{js,css,html,png,svg,jpg,woff2}'], cleanupOutdatedCaches: true, navigateFallback: '/index.html' },
  })],
  test: {
    environment: 'jsdom',
    setupFiles: [],
  },
})
