import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_APP_API || 'https://api.siamatic.co.th/etemp'

  return {
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: true
        },
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectManifest: {
          swDest: 'dist/sw.js',
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024 // 100MB
        },
        workbox: {
          cleanupOutdatedCaches: true,
          sourcemap: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,mp3}'],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100MB
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${apiUrl}.*`, 'i'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 // 1 hour
                },
                networkTimeoutSeconds: 10
              }
            }
          ]
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'SMTrack+',
          short_name: 'SMTrack+',
          icons: [
            {
              "src": "pwa-64x64.png",
              "sizes": "64x64",
              "type": "image/png"
            },
            {
              "src": "pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            },
            {
              "src": "maskable-icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ],
          screenshots: [
            {
              "src": "desktop01.png",
              "sizes": "3840x2160",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Login",
            },
            {
              "src": "desktop02.png",
              "sizes": "3840x2160",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Home",
            },
            {
              "src": "desktop03.png",
              "sizes": "3840x2160",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Dashboard",
            },
            {
              "src": "desktop04.png",
              "sizes": "3840x2160",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Chart",
            },
            {
              "src": "desktop05.png",
              "sizes": "3840x2160",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Table",
            },
            {
              "src": "mobile01.png",
              "sizes": "1125x2436",
              "type": "image/png",
              "form_factor": "narrow",
              "label": "Login",
            },
            {
              "src": "mobile02.png",
              "sizes": "1125x2436",
              "type": "image/png",
              "form_factor": "narrow",
              "label": "Home",
            },
            {
              "src": "mobile03.png",
              "sizes": "1125x2436",
              "type": "image/png",
              "form_factor": "narrow",
              "label": "Dashboard",
            }
          ],
          description: "The system show all etemp box detect temperature realtime and nofi when temperture higher then limit.",
          theme_color: '#fdfdfd',
          background_color: '#fdfdfd',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait'
        }
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test-setup.ts'
    },
    build: {
      chunkSizeWarningLimit: 100000, // Unit is in KB => 100MB
    },
    server: {
      port: 12345,
      strictPort: true,
      host: true,
      cors: true,
      fs: {
        strict: true,
        cachedChecks: true,
        deny: [
          '.env', '.env.*', '*.{crt,pem}', 'custom.secret'
        ]
      }
    },
    optimizeDeps: {
      exclude: ['fs']
    }
  }
})