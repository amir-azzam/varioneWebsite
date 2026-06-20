// Custom floating scrollbar: the native scrollbar is hidden (see index.css), and
// this draws a single blue thumb on the right edge. No track, no arrow buttons.
// It reflects scroll position and is draggable.

import { useEffect, useRef, useState } from "react";
import "./scrollbar.css";

const INSET = 10; // px gap from top/bottom

export function ScrollBar() {
  const [thumb, setThumb] = useState({ h: 0, top: 0, show: false });
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  const measure = () => {
    const sh = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    if (sh <= vh + 2) { setThumb((t) => ({ ...t, show: false })); return; }
    const trackH = vh - INSET * 2;
    const h = Math.max(44, (vh / sh) * trackH);
    const frac = window.scrollY / (sh - vh);
    const top = INSET + frac * (trackH - h);
    setThumb({ h, top, show: true });
  };

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      const sh = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const trackH = vh - INSET * 2;
      const h = Math.max(44, (vh / sh) * trackH);
      const dy = e.clientY - drag.current.startY;
      const scrollPerPx = (sh - vh) / (trackH - h);
      window.scrollTo({ top: drag.current.startScroll + dy * scrollPerPx });
    };
    const onUp = () => {
      drag.current = null;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!thumb.show) return null;

  return (
    <div
      className="scrollthumb"
      style={{ height: thumb.h, top: thumb.top }}
      onPointerDown={(e) => {
        drag.current = { startY: e.clientY, startScroll: window.scrollY };
        document.body.style.userSelect = "none";
      }}
    />
  );
}
