import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Play Irritation',
        short_name: 'Irritation',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    }),
    svgr({
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      include: /\/cards\/.*svg/,
      svgoConfig: {
        floatPrecision: 2,
        icon: true,
        ref: true,
        memo: true,
      },
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        dimensions: false,
      },
    }),
    react()
  ],
})
