// Four background options for the Meet section, switchable so we can pick one.
// All subtle, brand-colored, and they respect reduced-motion.

import { useEffect, useRef } from "react";
import "./signal-bg.css";

export type BgVariant = "waves" | "grid" | "aurora" | "circuit";

function Waves() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const emitters = [{ x: 0.78, y: 0.4 }, { x: 0.18, y: 0.72 }];

    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      emitters.forEach((e, i) => {
        const cx = e.x * w, cy = e.y * h;
        for (let k = 0; k < 5; k++) {
          const phase = (t * 0.00035 + k / 5 + i * 0.13) % 1;
          const radius = phase * Math.max(w, h) * 0.6;
          const alpha = (1 - phase) * 0.13;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(103,233,255,${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        const yBase = h * (0.28 + s * 0.22);
        const amp = 14 + s * 6, len = 150 + s * 40, speed = t * 0.0006 * (s + 1);
        for (let x = 0; x <= w; x += 8) {
          const y = yBase + Math.sin(x / len + speed + s) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(41,199,246,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (!reduce) { t += 16; raf = requestAnimationFrame(draw); }
    };
    if (reduce) { t = 4000; draw(); } else { raf = requestAnimationFrame(draw); }
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="bg-canvas" />;
}

function Grid() {
  return <div className="bg-grid"><div className="bg-grid-spot" /></div>;
}

function Aurora() {
  return (
    <div className="bg-aurora">
      <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
    </div>
  );
}

function Circuit() {
  return (
    <svg className="bg-circuit" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.5">
        <path d="M0 120 H280 V260 H520" />
        <path d="M1200 90 H940 V300 H700 V200 H560" />
        <path d="M0 520 H200 V400 H460 V480 H760" />
        <path d="M1200 560 H880 V440 H720" />
        <path d="M600 0 V160 H760 V340" />
        <path d="M340 700 V540 H600" />
      </g>
      <g fill="var(--cyan)">
        {[[280,260],[520,260],[940,300],[700,200],[200,400],[760,480],[880,440],[760,160],[600,160],[600,540]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="3.5" />
        ))}
      </g>
      <g fill="none" stroke="var(--cyan-soft)" strokeWidth="2" strokeLinecap="round" className="bg-circuit-pulse">
        <path d="M0 120 H280 V260 H520" />
        <path d="M0 520 H200 V400 H460 V480 H760" />
        <path d="M1200 90 H940 V300 H700 V200 H560" />
      </g>
    </svg>
  );
}

export function SignalBackground({ variant }: { variant: BgVariant }) {
  return (
    <div className="signal-bg">
      {variant === "waves" && <Waves />}
      {variant === "grid" && <Grid />}
      {variant === "aurora" && <Aurora />}
      {variant === "circuit" && <Circuit />}
    </div>
  );
}
