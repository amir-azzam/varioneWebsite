// The sync engine: binds the build video's playback clock to the timeline.
//
// When enabled, every timeupdate computes which node is active (the last node
// whose videoTime has passed), the overall progress (0..1), and the raw clock -
// and hands them up. The video is the master clock; JourneyApp turns these into
// the active chapter, the morale rider position, and the readout. Disabled (no
// video) → the page falls back to chapter buttons / scroll.

import { useEffect } from "react";
import type { RefObject } from "react";
import type { JourneyNode } from "./journeyData";

export type SyncTick = {
  activeIndex: number;
  progress: number;     // 0..1 over the whole clip
  currentTime: number;  // seconds
  duration: number;     // seconds
};

export function useVideoSync(
  videoRef: RefObject<HTMLVideoElement | null>,
  nodes: JourneyNode[],
  onTick: (t: SyncTick) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;

    const times = nodes.map((n) => n.videoTime);
    const tick = () => {
      const t = v.currentTime || 0;
      const d = v.duration || 0;
      let idx = 0;
      for (let i = 0; i < times.length; i++) {
        if (t >= times[i]) idx = i;
        else break;
      }
      onTick({ activeIndex: idx, progress: d ? Math.min(1, t / d) : 0, currentTime: t, duration: d });
    };

    v.addEventListener("timeupdate", tick);
    v.addEventListener("seeked", tick);
    v.addEventListener("loadedmetadata", tick);
    tick();
    return () => {
      v.removeEventListener("timeupdate", tick);
      v.removeEventListener("seeked", tick);
      v.removeEventListener("loadedmetadata", tick);
    };
  }, [videoRef, nodes, onTick, enabled]);
}

// Continuous position along the node sequence for the morale rider: a float like
// 2.4 = 40% of the way from node 2 to node 3. Used to glide Vemo smoothly along
// the curve in time with the video, instead of snapping per node.
export function floatIndexForTime(nodes: JourneyNode[], time: number): number {
  const times = nodes.map((n) => n.videoTime);
  if (time <= times[0]) return 0;
  for (let i = 0; i < times.length - 1; i++) {
    if (time >= times[i] && time < times[i + 1]) {
      const span = times[i + 1] - times[i];
      const f = span > 0 ? (time - times[i]) / span : 0;
      return i + Math.max(0, Math.min(1, f));
    }
  }
  return times.length - 1;
}
