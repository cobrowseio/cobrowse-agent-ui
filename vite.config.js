import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib')
    }
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'CobrowseAgentUI',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react/jsx-runtime',
        'date-fns/locale',
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies)
      ]
    },
    sourcemap: true,
    target: 'es2015'
  }
})
