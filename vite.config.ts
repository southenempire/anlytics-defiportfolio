import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(), react()],
  define: {
    'process.env': {},
    global: {}
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer', 
      'node:fs': path.resolve(__dirname, 'src/fs-mock.js'),
    },
  },
})
