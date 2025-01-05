import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
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
