import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// Dev-only: the bundled sub-pages live at public/vemo/ (Vemo's Academy) and the
// second Vite entry journey/index.html (The Build Journey). Vite's SPA fallback
// otherwise serves the main app's index.html for a directory URL, so rewrite the
// clean directory URLs to their real files. Production (nginx try_files $uri/)
// already handles this, keeping the URLs clean as /vemo/ and /journey/.
const multiDirIndex = {
  name: 'multi-dir-index',
  configureServer(server: any) {
    server.middlewares.use((req: any, _res: any, next: any) => {
      if (req.url === '/vemo' || req.url === '/vemo/') req.url = '/vemo/index.html'
      if (req.url === '/journey' || req.url === '/journey/') req.url = '/journey/index.html'
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), multiDirIndex],
  build: {
    // Two HTML entry points: the main landing app and the build-journey page.
    // public/vemo/ is a prebuilt static sub-app copied as-is, not a Vite entry.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        journey: resolve(__dirname, 'journey/index.html'),
      },
    },
  },
})
