// The theater video — the centerpiece of the journey stage. Custom controls
// (play/pause, scrubber, time, mute) so it reads like a cinema panel, not a raw
// browser player. The build video drives the whole page, so its clock is the
// product; these controls just expose it.
//
// The cut is NOT final (voiceover + a blooper tail still coming), so the badge
// stays — it never claims to be silent, since the current cut already narrates
// some parts with on-screen captions.

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VideoPanel({
  videoRef,
  src,
  poster,
  mode,
  muted,
  currentTime,
  duration,
  progress,
  title,
  onPlay,
  onPause,
  onToggleMute,
  onSeek,
  onReplay,
  ended,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string;
  poster: string;
  mode: "idle" | "playing" | "paused";
  muted: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0..1
  title: string;
  onPlay: () => void;
  onPause: () => void;
  onToggleMute: () => void;
  onSeek: (fraction: number) => void;
  onReplay: () => void;
  ended: boolean;
}) {
  const figRef = useRef<HTMLElement>(null);
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === figRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);
  const toggleFs = () => {
    const el = figRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void el.requestFullscreen?.();
  };

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    onSeek(Math.max(0, Math.min(1, frac)));
  };

  const seekFromKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;
    const step = 5 / duration;   // ±5s
    const big = 10 / duration;   // ±10s
    let frac: number | null = null;
    switch (e.key) {
      case "ArrowRight": case "ArrowUp": frac = progress + step; break;
      case "ArrowLeft": case "ArrowDown": frac = progress - step; break;
      case "PageUp": frac = progress + big; break;
      case "PageDown": frac = progress - big; break;
      case "Home": frac = 0; break;
      case "End": frac = 1; break;
      default: return;
    }
    e.preventDefault();
    onSeek(Math.max(0, Math.min(1, frac)));
  };

  return (
    <figure className="jv-screen" ref={figRef}>
      <video
        ref={videoRef}
        className="jv-video"
        poster={poster}
        playsInline
        preload="auto"
        onClick={() => {
          // First click on a muted, autoplaying video → turn sound ON (the most
          // common intent), not pause. Subsequent clicks toggle play/pause.
          if (mode === "playing" && muted) { onToggleMute(); return; }
          mode === "playing" ? onPause() : onPlay();
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="jv-screen-grain" />

      {/* Idle / poster state: title + big play */}
      {mode === "idle" && (
        <button className="jv-poster-cover" onClick={onPlay} aria-label="Play the build journey">
          <span className="jv-poster-title">{title}</span>
          <span className="jv-poster-sub">The VariOne build journey — press play</span>
          <span className="jv-bigplay" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}

      {/* Replay when finished */}
      {ended && (
        <button className="jv-poster-cover jv-poster-cover--end" onClick={onReplay} aria-label="Replay">
          <span className="jv-poster-sub">That's the journey — scroll down to meet the team</span>
          <span className="jv-bigplay" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M12 5V1L7 6l5 5V7a6 6 0 11-6 6H4a8 8 0 108-8z" /></svg>
          </span>
        </button>
      )}

      <span className="jv-badge">
        <span className="jv-badge-dot" />
        Preview cut — final edit in progress
      </span>

      {/* Unmute nudge while autoplaying muted */}
      {mode === "playing" && muted && (
        <button className="jv-unmute" onClick={onToggleMute}>🔊 Tap for sound</button>
      )}

      {/* Control bar */}
      {mode !== "idle" && !ended && (
        <div className="jv-controls">
          <button
            className="jv-ctrl-btn"
            onClick={() => (mode === "playing" ? onPause() : onPlay())}
            aria-label={mode === "playing" ? "Pause" : "Play"}
          >
            {mode === "playing" ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div
            className="jv-scrub"
            onClick={seekFromEvent}
            onKeyDown={seekFromKey}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
          >
            <div className="jv-scrub-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="jv-time">{fmt(currentTime)} / {fmt(duration)}</span>
          <button className="jv-ctrl-btn" onClick={onToggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4zm12.5 3l2.5 2.5-1 1L15.5 13 13 15.5l-1-1L14.5 12 12 9.5l1-1L15.5 11 18 8.5l1 1z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4zm11 .5a3 3 0 010 5v-5zm0-3.9a7 7 0 010 12.8v-1.6a5.4 5.4 0 000-9.6V5.6z" /></svg>
            )}
          </button>
          <button className="jv-ctrl-btn" onClick={toggleFs} aria-label={isFs ? "Exit fullscreen" : "Fullscreen"}>
            {isFs ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
            )}
          </button>
        </div>
      )}
    </figure>
  );
}
