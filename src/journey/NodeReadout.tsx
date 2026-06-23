// The chapter readout — the synced "what we encountered and how we fixed it"
// panel, now LANDSCAPE so it sits clearly below the video and reads at a glance
// while the clip plays. A compact header row (mascot · period · headline · stat)
// over a 3-column body (the story + chips | what broke | what we won).
//
// Keyed on node.id so each chapter change REMOUNTS it, re-firing the staggered
// enter animation (bit-by-bit reveal) in journey.css.

import type { JourneyNode } from "./journeyData";
import { Vemo } from "./Vemo";

export function NodeReadout({ node, index, total }: { node: JourneyNode; index: number; total: number }) {
  return (
    <div className="jv-read" key={node.id}>
      <div className="jv-read-top">
        <Vemo mood={node.mood} size={50} loading="eager" />
        <div className="jv-read-meta">
          <span className="eyebrow jv-read-period">{node.period}</span>
          <span className="jv-read-count">{index + 1} / {total}</span>
        </div>
        <h2 className="jv-read-headline">{node.headline}</h2>
        <div className="jv-stat">
          <span className="jv-stat-value">{node.stat.value}</span>
          <span className="jv-stat-label">{node.stat.label}</span>
        </div>
      </div>

      <div className="jv-read-body">
        <div className="jv-read-story">
          <p className="jv-read-lede">{node.lede}</p>
          <div className="jv-chips">
            {node.moments.map((m, i) => <span key={i} className="jv-chip">{m}</span>)}
          </div>
        </div>

        <div className="jv-read-col">
          <span className="jv-col-label jv-col-label--broke">What broke</span>
          <ul className="jv-list">
            {node.broke.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>

        <div className="jv-read-col">
          <span className="jv-col-label jv-col-label--won">What we won</span>
          <ul className="jv-list jv-list--won">
            {node.won.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
