import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: the bundled Vemo's Academy lives at public/vemo/. Vite's SPA fallback
// otherwise serves the main app's index.html for the directory URL "/vemo/", so
// rewrite it to the real file. Production (nginx try_files $uri/) already handles
// this, keeping the URL clean as /vemo/.
const vemoDirIndex = {
  name: 'vemo-dir-index',
  configureServer(server: any) {
    server.middlewares.use((req: any, _res: any, next: any) => {
      if (req.url === '/vemo' || req.url === '/vemo/') req.url = '/vemo/index.html'
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), vemoDirIndex],
})
