import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'Hufiec Finance',
        short_name: 'Hufiec Finance',
        description: 'Hufiec Finance Application - Zarządzanie finansami hufca',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/finance-zhprsl\.firebaseio\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/firebaseapp\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-auth-cache',
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    include: [
      'buffer',
      'stream-browserify',
      'browserify-zlib',
      'assert-browserify',
      'util'
    ]
  },
  resolve: {
    alias: {
      // Set up path mapping for absolute imports from src
      '@': resolve(__dirname, 'src'),
      'components': resolve(__dirname, 'src/components'),
      'containers': resolve(__dirname, 'src/containers'),
      'helpers': resolve(__dirname, 'src/helpers'),
      'models': resolve(__dirname, 'src/models'),
      'pages': resolve(__dirname, 'src/pages'),
      'providers': resolve(__dirname, 'src/providers'),
      'shared': resolve(__dirname, 'src/shared'),
      'store': resolve(__dirname, 'src/store'),
      'constans': resolve(__dirname, 'src/constans'),
      'assets': resolve(__dirname, 'src/assets'),
      'fonts': resolve(__dirname, 'src/fonts'),
      'axios-income': resolve(__dirname, 'src/axios-income'),
      // Polyfills for Node.js modules (similar to config-overrides.js)
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      assert: 'assert-browserify',
      util: 'util',
      buffer: 'buffer'
    }
  },
  // No global definitions that might interfere with imports
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure compatibility with older browsers
    target: 'es2015'
  }
})
