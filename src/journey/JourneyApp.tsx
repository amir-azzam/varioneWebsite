// Build-journey page root - THEATER mode. A big stage fills the screen: the build
// video (~60%) beside the morale curve + the synced chapter readout (~40%). The
// video is the master clock - on load it autoplays muted (with a "tap for sound"
// nudge), and as it plays the active chapter, the colored "what broke / what we
// won" text, and Vemo riding the morale curve all move with it. No video (or
// autoplay blocked) → the chapter rail drives everything by click. The team
// section closes the page.
//
// Dev: open /journey/?capture to stamp each chapter's videoTime against the final
// cut in seconds - makes re-syncing the timeline a 2-minute job.

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollBar } from "../components/ScrollBar";
import { Nav } from "../components/Nav";
import { ContactModal } from "../components/ContactModal";
import { JOURNEY_NODES } from "./journeyData";
import { MoraleCurve } from "./MoraleCurve";
import { VideoPanel } from "./VideoPanel";
import { NodeReadout } from "./NodeReadout";
import { ChapterRail } from "./ChapterRail";
import { Team } from "./Team";
import { useVideoSync, floatIndexForTime } from "./useVideoSync";
import type { SyncTick } from "./useVideoSync";
import "./journey.css";

const SRC = "/assets/journey.mp4";
const POSTER = "/assets/journey-poster.jpg";

type Mode = "idle" | "playing" | "paused";

export default function JourneyApp() {
  const nodes = JOURNEY_NODES;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  const capture = typeof window !== "undefined" && window.location.search.includes("capture");

  // Sync engine: video clock -> active chapter + progress.
  const onTick = useCallback((t: SyncTick) => {
    setActiveIndex(t.activeIndex);
    setCurrentTime(t.currentTime);
    setDuration(t.duration);
    setProgress(t.progress);
  }, []);
  useVideoSync(videoRef, nodes, onTick, videoAvailable);

  // Video element lifecycle + autoplay attempt.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlayEv = () => { setEnded(false); setMode("playing"); };
    const onPauseEv = () => { if (!v.ended) setMode((m) => (m === "idle" ? "idle" : "paused")); };
    const onEnded = () => {
      setEnded(true);
      setMode("paused");
      // Video's done → carry the viewer straight to the team section.
      document.getElementById("team")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const onErr = () => { setVideoAvailable(false); setMode("idle"); };
    v.addEventListener("play", onPlayEv);
    v.addEventListener("pause", onPauseEv);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr, true);

    // Try muted autoplay (allowed); if blocked, stay on the poster.
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setMode("idle"));

    return () => {
      v.removeEventListener("play", onPlayEv);
      v.removeEventListener("pause", onPauseEv);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr, true);
    };
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // First play from the poster is a user gesture - give them sound.
    if (mode === "idle") { v.muted = false; setMuted(false); }
    if (ended) { v.currentTime = 0; setEnded(false); }
    // play() rejects with AbortError if interrupted by a later pause()/seek -
    // expected during rapid chapter/pause clicks, so swallow it (state is driven
    // by the play/pause/ended listeners regardless).
    v.play()?.catch(() => {});
  }, [mode, ended]);

  const pause = useCallback(() => { videoRef.current?.pause(); }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    setMuted((m) => {
      const nm = !m;
      if (v) v.muted = nm;
      return nm;
    });
  }, []);

  const seek = useCallback((fraction: number) => {
    const v = videoRef.current;
    if (v && v.duration) v.currentTime = fraction * v.duration;
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    v.play()?.catch(() => {});
  }, []);

  const selectChapter = useCallback((i: number) => {
    setActiveIndex(i);
    const v = videoRef.current;
    if (videoAvailable && v) {
      if (ended) setEnded(false);
      v.currentTime = nodes[i].videoTime + 0.05;
      v.play()?.catch(() => {});
    }
  }, [nodes, videoAvailable, ended]);

  const active = nodes[activeIndex] ?? nodes[0];
  const riderFloat = videoAvailable && mode !== "idle"
    ? floatIndexForTime(nodes, currentTime)
    : activeIndex;

  return (
    <>
      <ScrollBar />

      <Nav onContact={() => setContactOpen(true)} current="journey" />

      <main>
        <section className="jv-theater" id="top">
          <div className="jv-theater-wrap">
            <div className="jv-stage-screen">
              <VideoPanel
                videoRef={videoRef}
                src={SRC}
                poster={POSTER}
                mode={mode}
                muted={muted}
                currentTime={currentTime}
                duration={duration}
                progress={progress}
                title="How VariOne Got Built"
                onPlay={play}
                onPause={pause}
                onToggleMute={toggleMute}
                onSeek={seek}
                onReplay={replay}
                ended={ended}
              />
            </div>

            {/* Grid: video spans the top row; below, report text (left) + a taller,
                narrower morale with the chapter rail (right). */}
            <NodeReadout node={active} index={activeIndex} total={nodes.length} />
            <div className="jv-side">
              <MoraleCurve nodes={nodes} riderFloat={riderFloat} activeIndex={activeIndex} />
              <ChapterRail nodes={nodes} activeIndex={activeIndex} onSelect={selectChapter} />
            </div>
          </div>

          {capture && (
            <CaptureBar nodes={nodes} currentTime={currentTime} activeIndex={activeIndex} />
          )}
        </section>

        <Team />
      </main>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

// Dev-only helper (only mounted with ?capture). Click a chapter button while the
// video is paused at that moment to record its time; "Copy cues" dumps a ready
// videoTime list to paste back into journeyData.ts.
function CaptureBar({
  nodes,
  currentTime,
  activeIndex,
}: {
  nodes: { id: string; videoTime: number }[];
  currentTime: number;
  activeIndex: number;
}) {
  const [stamps, setStamps] = useState<Record<string, number>>({});
  const stamp = (id: string) => setStamps((s) => ({ ...s, [id]: Math.round(currentTime * 10) / 10 }));
  const copy = () => {
    const merged = nodes.map((n) => ({ id: n.id, time: stamps[n.id] ?? n.videoTime }));
    const text = merged.map((m) => `${m.id}: ${m.time}`).join("\n");
    void navigator.clipboard?.writeText(text);
    // eslint-disable-next-line no-console
    console.log("Journey cue stamps:\n" + text);
  };
  return (
    <div className="jv-capture">
      <strong>capture</strong> t={currentTime.toFixed(1)}s · active=<em>{nodes[activeIndex]?.id}</em>
      <div className="jv-capture-row">
        {nodes.map((n) => (
          <button key={n.id} onClick={() => stamp(n.id)} title={`stamp ${n.id} at current time`}>
            {n.id}{stamps[n.id] != null ? `=${stamps[n.id]}` : ""}
          </button>
        ))}
        <button onClick={copy}><strong>Copy cues</strong></button>
      </div>
    </div>
  );
}
