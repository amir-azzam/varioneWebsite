// The REAL Vemo mascot, rendered as an image (the blue/white panda-robot in the
// Canva brand set), not the OLED SVG face. The SVG VemoFace stays for the device
// simulator (it mimics the on-device screen); the journey page uses these
// full-body brand figures so Vemo's mood actually reads at a glance.
//
// Assets live at public/assets/mascot/<mood>.png - ABSOLUTE paths so they resolve
// from the site root at /journey/ (a relative path would wrongly hit
// /journey/assets/...). Transparent PNGs, 460px square.

import type { CSSProperties } from "react";

export type VemoMood =
  | "happy"        // standing, waving, smile
  | "sad"          // tear, rubbing eye - the low point
  | "thinking"     // thought bubble, finger to head
  | "celebrating"  // fists up, confetti - the peak
  | "focused"      // sitting with a laptop, deep work
  | "excited"      // pumped, energy marks
  | "confused"     // shrug, question mark
  | "curious"      // hand on chin, sparkle
  | "oops"         // sweat drop, sheepish
  | "surprised";   // hands on cheeks, shock

export function Vemo({
  mood,
  size = 120,
  className = "",
  style,
  loading = "lazy",
}: {
  mood: VemoMood;
  size?: number;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
}) {
  return (
    <img
      src={`/assets/mascot/${mood}.png`}
      width={size}
      height={size}
      alt={`Vemo, ${mood}`}
      className={`jv-vemo ${className}`.trim()}
      style={style}
      loading={loading}
      draggable={false}
    />
  );
}
