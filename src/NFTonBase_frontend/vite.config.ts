import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import environment from 'vite-plugin-environment'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// import connect from 'connect';

dotenv.config({ path: '../../.env' })

export default defineConfig({
  build: {
    emptyOutDir: true
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true
      }
    }
    // headers: {
    //   'Content-Security-Policy': "script-src 'self' 'unsafe-eval' blob:; worker-src 'self' blob:;"
    // }
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      // sassVariables: 'src/quasar-variables.sass'
    }),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' })
  ],
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(new URL('../declarations', import.meta.url))
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
    ]
  }
})
