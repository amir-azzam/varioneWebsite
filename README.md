# VariOne — Website

Source for the VariOne interactive site.

**Live:** https://varione.ai · Built with React 19 + TypeScript + Vite.

---

## What is VariOne?

VariOne is a friendly **ESP32-S3 cyber-awareness handheld** (CIC New Cairo graduation
project, supervised by Dr. Ahmed Gaber). It makes invisible wireless signals visible so
anyone can learn how they work and why they matter — "cute outside, powerful inside."

One pocket device covers every everyday wireless band:

| Radio | What it does |
|-------|--------------|
| **Wi-Fi** | Scan APs, deauth, beacon spam, VariPortal (lookalike-network login demo) |
| **Sub-GHz** | Capture / replay 433 MHz gate & car remotes, frequency scan, RF jammer, key-fob inspect |
| **NFC** | Read contactless bank cards (masked) and access badges (Mifare) |
| **IR** | Clone TV / AC remotes, TV-B-Gone |
| **nRF24** | 2.4 GHz analyzer + jammer (BT, Wi-Fi, mice/keyboards) |
| **BadUSB** | Pose as a USB keyboard and type a scripted payload |

Every attack ends with a plain-language **debrief**: what happened, why it matters, and how
to defend. The on-device mascot **Vemo** reacts to each action on the OLED screen.

## How the website works

Three sections, all in `src/components/`:

1. **Hero** — looping Vemo video + the two calls to action.
2. **Meet VariOne** — a rotating **3D model** of the real device (`<model-viewer>`,
   `public/assets/varione.glb`). Hover/tap a signal to reveal that radio's real tools.
3. **Simulator** — a working **virtual VariOne**: drive the real menu tree with the on-screen
   D-pad or keyboard arrows, run safe scripted demos, and read the matching lesson. Menu data,
   demos, and debriefs live in `src/device/content.ts`.

The physical device also serves its own control panel on the LAN at `http://varione.local`
(linked from the nav as **Real device**). **Vemo's Academy** (a Next.js static export) is
bundled at `public/vemo/` and served at `/vemo/index.html`.

---

## Run it locally

You need **Node.js** (LTS from https://nodejs.org — installs `npm` too).

```bash
npm install
npm run dev       # dev server with live reload → http://localhost:5173
```

### Other commands
```bash
npm run build     # optimized production build → dist/
npm run preview   # serve the production build → http://localhost:4173
npm run lint      # eslint
```

---

## Hosting / Deployment

Production is a **Docker image on a k3s cluster (EC2)**, fronted by Traefik with TLS for
`varione.ai`. Every push to `main` ships automatically via GitHub Actions
(`.github/workflows/Pipeline.yml`).

### Pipeline steps (push to `main` → live)

1. **Build** — `docker/build-push-action` builds the image from `Dockerfile`
   (multi-stage: `npm run build` → static files served by **nginx**, config in `nginx.conf`)
   and pushes to Docker Hub as `:latest` and `:<commit-sha>`.
2. **Apply** — injects the new `:<sha>` tag into `k3s/k3s.yml`, `scp`s the manifest to the
   EC2 host, then `kubectl apply` + `kubectl rollout status` over SSH.

### Required GitHub secrets

| Secret | Use |
|--------|-----|
| `DOCKER_USERNAME`, `DOCKER_PASSWORD` | Docker Hub login + image namespace |
| `HOST`, `USERNAME`, `PRIVATEKEY` | EC2 SSH target for scp/ssh |

### k3s manifest (`k3s/k3s.yml`)

- **Deployment** `varione` — 1 replica of the nginx image (64–128 Mi / 50–200 m).
- **Service** `varione` — ClusterIP on port 80.
- **Ingress** `varione` — Traefik `websecure`, TLS secret `varione-tls`, host `varione.ai`.

### Deploy manually

```bash
docker build -t <user>/varione:latest .
docker push <user>/varione:latest
kubectl apply -f k3s/k3s.yml
kubectl rollout status deployment/varione
```

---

## Structure

```
src/components/     Hero, MeetVariOne, Simulator, Device3D, ContactModal, DebriefModal …
src/device/         content.ts (menu tree, demos, debriefs) + device state/face
public/assets/      hero video, fonts, logo, varione.glb (3D model)
public/vemo/        Vemo's Academy companion (static Next.js export)
Dockerfile          multi-stage build → nginx
nginx.conf          SPA fallback + asset caching + gzip
k3s/k3s.yml         Deployment + Service + Ingress
.github/workflows/  Pipeline.yml (CI/CD)
```

The contact form delivers via Web3Forms; the key in `ContactModal.tsx` is a public
client-side key (safe to expose).
