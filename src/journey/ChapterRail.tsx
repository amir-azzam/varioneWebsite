// Chapter rail - one pill per node. Shows where we are and lets you jump: click
// seeks the video to that chapter (and, with no video, just sets the chapter).
// Doubles as the no-video fallback navigation.

import type { JourneyNode } from "./journeyData";

export function ChapterRail({
  nodes,
  activeIndex,
  onSelect,
}: {
  nodes: JourneyNode[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="jv-chapters" role="group" aria-label="Journey chapters">
      {nodes.map((n, i) => (
        <button
          key={n.id}
          className={`jv-chapter ${i === activeIndex ? "is-active" : ""} ${i < activeIndex ? "is-done" : ""}`}
          onClick={() => onSelect(i)}
          aria-current={i === activeIndex ? "true" : undefined}
          title={`${n.period} - ${n.headline}`}
        >
          <span className="jv-chapter-dot" />
          <span className="jv-chapter-label">{n.period}</span>
        </button>
      ))}
    </div>
  );
}
