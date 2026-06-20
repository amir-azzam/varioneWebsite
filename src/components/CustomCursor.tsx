// Custom neon cursor with three switchable designs. Disabled on touch / coarse
// pointers. Purely visual (never blocks clicks). Respects reduced motion.

import { useEffect, useRef, useState } from "react";
import "./cursor.css";

const INTERACTIVE = "a,button,[role=button],input,label,.sig-row,.pad-btn";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const raf = useRef(0);
  const pos = useRef({ x: -100, y: -100 });
  const smooth = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const root = document.documentElement;
    document.body.classList.add("has-cursor");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      root.style.setProperty("--cx", e.clientX + "px");
      root.style.setProperty("--cy", e.clientY + "px");
      const over = !!(e.target as Element)?.closest?.(INTERACTIVE);
      if (over !== hovering) {
        hovering = over;
        document.body.classList.toggle("cur-hover", over);
      }
      document.body.classList.remove("cur-hidden");
    };
    const down = () => document.body.classList.add("cur-down");
    const up = () => document.body.classList.remove("cur-down");
    const leave = () => document.body.classList.add("cur-hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);

    const loop = () => {
      const k = reduce ? 1 : 0.2;
      smooth.current.x += (pos.current.x - smooth.current.x) * k;
      smooth.current.y += (pos.current.y - smooth.current.y) * k;
      root.style.setProperty("--rx", smooth.current.x + "px");
      root.style.setProperty("--ry", smooth.current.y + "px");
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor", "cur-hover", "cur-down", "cur-hidden");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor cursor--orb" aria-hidden="true">
      <div className="cur-ring" />
    </div>
  );
}
