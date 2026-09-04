import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Unify: Vite client uses VITE_API_URL, server proxy previously used API_URL — support both + BETTER_AUTH_URL fallback
  const apiTarget = (env.VITE_API_URL || env.API_URL || env.BETTER_AUTH_URL || 'http://localhost:8787').replace(/\/$/, '')
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
          target: apiTarget,
          changeOrigin: true,
          cookieDomainRewrite: { 'localhost:8787': '' },
          cookiePathRewrite: { '/': '' },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Forward Authorization header
              const auth = req.headers?.authorization
              if (auth) proxyReq.setHeader('Authorization', auth)
            })
          },
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: { target: 'es2022' },
  }
})
