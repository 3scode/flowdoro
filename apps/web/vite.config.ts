import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [tailwindcss(), svelte()],
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, 'src/lib'),
      },
      conditions: ['browser', 'svelte'],
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.API_URL ?? 'http://localhost:3000',
          changeOrigin: true,
        },
        '/health': {
          target: env.API_URL ?? 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: { target: 'es2022' },
  }
})
