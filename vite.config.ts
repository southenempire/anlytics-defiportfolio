// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import path from 'path';

// // https://vite.dev/config/
// export default defineConfig({
//   define: {
//     'process.env': {},
//     'global': 'globalThis',
//   },
//   plugins: [ tailwindcss(), react()],
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis',
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           buffer: true,
//         }),
//       ],
//     },
//   },
//   resolve: {
//     alias: {
//       buffer: 'buffer', 
//       'node:fs': path.resolve(__dirname, 'src/fs-mock.js'),
//     },
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import inject from '@rollup/plugin-inject'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  plugins: [
    tailwindcss(), 
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      'node:buffer': 'buffer',
      'node:fs': path.resolve(__dirname, 'src/fs-mock.js'),
    },
  },
})