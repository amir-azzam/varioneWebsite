# VariOne — Website

Source for the VariOne interactive site. VariOne is a friendly ESP32-S3 cyber-awareness
handheld (CIC New Cairo graduation project) that makes invisible wireless signals visible.

**Live:** https://varione.ai · Built with React + TypeScript + Vite.

## ▶ Quick start (read this first)

You need **Node.js** installed (get the LTS from https://nodejs.org — that also installs `npm`).

1. Unzip this folder anywhere.
2. Open a terminal **in this folder** (the one with `package.json`).
3. Run these two commands:
   ```bash
   npm install
   npm run preview
   ```
4. Open the URL it prints (e.g. `http://localhost:4173/`) in your browser.

That's it. To see the **Vemo's Academy** companion, go to `/vemo` (e.g. `http://localhost:4173/vemo/`).

### Other commands
```bash
npm run dev     # live-edit dev server (http://localhost:5173) — note: /vemo only works under `preview`, not `dev`
npm run build   # produce the optimized production build in dist/
```

## Structure
- `src/components/` — Hero, MeetVariOne (Section 2), Simulator (Section 3), ContactModal, DebriefModal, etc.
- `src/device/content.ts` — the simulator's device menu tree, demos, and AI-style debriefs.
- `public/` — assets (hero video, fonts, logo) and `public/vemo/` (the Vemo's Academy companion app, served at `/vemo`).

## Deploy
The built site is deployed to Vercel (→ varione.ai). The contact form delivers via
Web3Forms; the access key in `ContactModal.tsx` is a public client-side key (safe to expose).

