import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
