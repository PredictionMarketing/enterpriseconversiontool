import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  define: {
    // This provides a mock for the Node.js process global
    'process.env': {},
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
    'process.nextTick': '(cb) => setTimeout(cb, 0)',
    'process': {
      env: {},
      version: '"v16.0.0"',
      platform: '"browser"',
      nextTick: '(cb) => setTimeout(cb, 0)'
    }
  },
  resolve: {
    alias: {
      // Add any Node.js built-in modules that need to be polyfilled
      stream: 'stream-browserify',
      path: 'path-browserify',
      util: 'util',
      buffer: 'buffer',
      querystring: 'querystring-es3',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  }
})
