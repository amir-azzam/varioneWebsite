// OLED-style Vemo, drawn in SVG. The eyes change with mood, mirroring the
// firmware's expression logic. Cyan-on-navy to match the real OLED look.

import type { Mood } from "./content";

export function VemoFace({ mood, size = 88 }: { mood: Mood; size?: number }) {
  const C = "var(--cyan-soft)";

  const eyes = () => {
    switch (mood) {
      case "happy": case "success": case "waving":
        return (<>
          <path d="M30 44 q6 -8 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
          <path d="M58 44 q6 -8 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
        </>);
      case "sad": case "fail":
        return (<>
          <path d="M30 42 q6 8 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
          <path d="M58 42 q6 8 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
        </>);
      case "angry":
        return (<>
          <line x1="30" y1="40" x2="42" y2="46" stroke={C} strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="40" x2="58" y2="46" stroke={C} strokeWidth="4" strokeLinecap="round" />
        </>);
      case "thinking":
        return (<>
          <circle cx="36" cy="44" r="5" fill={C} />
          <line x1="58" y1="44" x2="70" y2="44" stroke={C} strokeWidth="4" strokeLinecap="round" />
        </>);
      case "sleeping":
        return (<>
          <path d="M30 45 q6 5 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
          <path d="M58 45 q6 5 12 0" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
        </>);
      case "working":
        return (<>
          <ellipse cx="36" cy="44" rx="4" ry="6" fill={C} />
          <ellipse cx="64" cy="44" rx="4" ry="6" fill={C} />
        </>);
      default:
        return (<>
          <circle cx="36" cy="44" r="6" fill={C} />
          <circle cx="64" cy="44" r="6" fill={C} />
        </>);
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`Vemo ${mood}`}>
      <rect x="18" y="18" width="64" height="60" rx="22" fill="none" stroke={C} strokeWidth="3" />
      <circle cx="26" cy="22" r="7" fill="none" stroke={C} strokeWidth="3" />
      <circle cx="74" cy="22" r="7" fill="none" stroke={C} strokeWidth="3" />
      <rect x="26" y="34" width="48" height="22" rx="11" fill="rgba(41,199,246,0.12)" stroke={C} strokeWidth="2" />
      {eyes()}
      <circle cx="50" cy="66" r="6" fill="none" stroke={C} strokeWidth="2.5" />
      {mood === "waving" && <line x1="82" y1="40" x2="92" y2="28" stroke={C} strokeWidth="4" strokeLinecap="round" />}
      {mood === "sleeping" && <text x="80" y="30" fill={C} fontSize="12" fontFamily="monospace">z</text>}
    </svg>
  );
}
