// The morale curve: an SVG polyline through every node's curveY (0-100), with
// Vemo RIDING it. The rider's position is a FLOAT index (e.g. 2.4 = 40% from
// node 2 to node 3) so Vemo glides smoothly along the curve in time with the
// video, rather than snapping per chapter. Dips on the crisis weeks, peaks on
// the breakthroughs.

import type { JourneyNode } from "./journeyData";
import { Vemo } from "./Vemo";

// Fixed virtual canvas; the container scales it to its box.
const W = 1000;
const H = 360;
const PAD_X = 60;
const PAD_Y = 56;

export function MoraleCurve({
  nodes,
  riderFloat,
  activeIndex,
}: {
  nodes: JourneyNode[];
  riderFloat: number; // continuous position for the glide (0 .. nodes.length-1)
  activeIndex: number; // the SHARED active chapter (same as rail/readout) for dots + mood
}) {
  const n = nodes.length;
  const xOf = (i: number) => PAD_X + (n === 1 ? 0 : i / (n - 1)) * (W - 2 * PAD_X);
  const yOf = (v: number) => PAD_Y + (1 - v / 100) * (H - 2 * PAD_Y);

  const linePts = nodes.map((nd, i) => `${xOf(i)},${yOf(nd.curveY)}`).join(" ");
  const areaPts = `${PAD_X},${H - PAD_Y} ${linePts} ${W - PAD_X},${H - PAD_Y}`;

  // Interpolate the rider between the two surrounding nodes.
  const lo = Math.max(0, Math.min(n - 1, Math.floor(riderFloat)));
  const hi = Math.min(n - 1, lo + 1);
  const f = riderFloat - lo;
  const riderX = xOf(lo) + (xOf(hi) - xOf(lo)) * f;
  const riderCurveY = nodes[lo].curveY + (nodes[hi].curveY - nodes[lo].curveY) * f;
  const riderY = yOf(riderCurveY);
  // Dots + rider mood follow the SHARED active chapter (not Math.round(riderFloat)),
  // so the curve never highlights a node the readout/rail haven't switched to yet.
  const act = Math.max(0, Math.min(n - 1, activeIndex));
  const riderMood = nodes[act].mood;

  const leftPct = (riderX / W) * 100;
  const topPct = (riderY / H) * 100;

  return (
    <div className="jv-curve" role="img" aria-label="Team morale across the build, with Vemo riding the curve">
      <svg viewBox={`0 0 ${W} ${H}`} className="jv-curve-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="jvCurveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill="url(#jvCurveFill)" />
        <polyline
          points={linePts}
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* trail up to the rider */}
        <line
          x1={xOf(0)}
          y1={yOf(nodes[0].curveY)}
          x2={riderX}
          y2={riderY}
          stroke="var(--cyan-soft)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
        {nodes.map((nd, i) => (
          <circle
            key={nd.id}
            cx={xOf(i)}
            cy={yOf(nd.curveY)}
            r={i === act ? 8 : 5}
            fill={i <= act ? "var(--cyan-soft)" : "var(--bg)"}
            stroke="var(--cyan)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="jv-rider" style={{ left: `${leftPct}%`, top: `${topPct}%` }}>
        <Vemo mood={riderMood} size={54} loading="eager" />
      </div>
    </div>
  );
}
