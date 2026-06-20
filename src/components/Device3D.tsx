// Rotating 3D device viewer for the Meet box. Uses Google's <model-viewer>
// (bundled, works offline). Drop the real VariOne .glb in at /assets/varione.glb
// and change `src` below. For now it shows a placeholder so the mechanism is live.

import "@google/model-viewer";

// model-viewer is a custom element; typing it as `any` avoids JSX friction.
const MV: any = "model-viewer";

export function Device3D({ ghost }: { ghost: boolean }) {
  return (
    <MV
      className={`device3d ${ghost ? "is-ghost" : ""}`}
      src="assets/placeholder.glb"
      camera-controls
      auto-rotate
      auto-rotate-delay={0}
      rotation-per-second="22deg"
      interaction-prompt="none"
      disable-zoom
      shadow-intensity="0.35"
      exposure="1.05"
      environment-image="neutral"
      touch-action="pan-y"
      aria-label="Rotating 3D model of the VariOne device"
    />
  );
}
