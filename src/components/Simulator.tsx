// Interactive virtual VariOne. The real device render frames a live OLED-style
// screen. Navigate the real menu tree; running a demo plays a safe scripted
// animation while Vemo reacts, with a plain-language lesson beside it.

import { useEffect, useRef, useState } from "react";
import { useDevice, type View } from "../device/useDevice";
import { VemoFace } from "../device/VemoFace";
import "./simulator.css";

function SignalBars({ value }: { value: number }) {
  const bars = [0, 1, 2, 3].map((i) => value > i * 25);
  return (
    <span className="oled-bars">
      {bars.map((on, i) => <span key={i} className={on ? "on" : ""} style={{ height: 4 + i * 3 }} />)}
    </span>
  );
}

function OledMenu({ view }: { view: Extract<View, { kind: "menu" }> }) {
  const header = view.trail.length ? view.trail[view.trail.length - 1] : "VariOne";
  const clipRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const selRef = useRef<HTMLLIElement | null>(null);
  const [offset, setOffset] = useState(0);

  // Keep the highlighted row in view as you scroll past the screen edge, like the
  // real OLED menu. We move the list with a CSS transform (not scrollTop): iOS
  // Safari clamps scrollTop to 0 on overflow:hidden elements, which left the
  // bottom rows unreachable / half-clipped on iPhone. translateY works anywhere
  // and keeps the tiny screen from capturing finger-scroll on touch.
  // We snap the offset to whole rows so a selected row is never half-clipped
  // (the visible window isn't an exact multiple of the row height).
  useEffect(() => {
    const clip = clipRef.current, li = selRef.current;
    if (!clip || !li) return;
    const rowH = li.offsetHeight;
    if (!rowH) return;
    const winRows = Math.max(1, Math.floor(clip.clientHeight / rowH)); // fully-visible rows
    setOffset((prev) => {
      let first = Math.round(prev / rowH);                 // current top row
      if (view.index < first) first = view.index;          // scrolled above → pull up
      else if (view.index > first + winRows - 1) first = view.index - winRows + 1; // below → pull down
      first = Math.max(0, Math.min(first, view.nodes.length - winRows));
      first = Math.max(0, first);
      return first * rowH;
    });
  }, [view.index, view.trail.length, view.nodes.length]);

  return (
    <div className="oled-inner">
      <div className="oled-header"><span>{header}</span><span className="oled-batt">USB</span></div>
      <div className="oled-list" ref={clipRef}>
        <ul className="oled-track" ref={trackRef} style={{ transform: `translateY(${-offset}px)` }}>
          {view.nodes.map((n, i) => (
            <li key={n.id} ref={i === view.index ? selRef : undefined} className={i === view.index ? "sel" : ""}>
              <span className="caret">{i === view.index ? ">" : " "}</span>{n.label}
              {n.status === "planned" && <span className="oled-soon">soon</span>}
              {n.status === "progress" && <span className="oled-soon">wip</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OledDemo({ view }: { view: Extract<View, { kind: "demo" }> }) {
  const f = view.frame;
  return (
    <div className="oled-inner">
      <div className="oled-header"><span>{f.title}</span><span className="oled-batt">{view.frameIndex + 1}/{view.total}</span></div>
      <div className="oled-demo">
        <div className="oled-vemo"><VemoFace mood={f.mood} size={54} /></div>
        <div className="oled-body">
          {f.lines?.map((l, i) => <div key={i} className="oled-line">{l}</div>)}
          {f.bars && <div className="oled-barsrow">{f.bars.map((b, i) => <SignalBars key={i} value={b} />)}</div>}
          {f.wave && (
            <svg className="oled-wave" viewBox="0 0 120 24" preserveAspectRatio="none">
              <polyline points="0,12 8,12 12,2 16,22 20,12 28,12 32,4 36,20 40,12 52,12 56,3 60,21 64,12 76,12 80,5 84,19 88,12 120,12"
                fill="none" stroke="var(--cyan-soft)" strokeWidth="1.5" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export function Simulator({
  onOpenAcademy, onOpenDebrief,
}: {
  onOpenAcademy: () => void;
  onOpenDebrief: (id?: string) => void;
}) {
  const dev = useDevice();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack keys while the user is typing in a field (e.g. the contact form).
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = e.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Backspace"].includes(k)) e.preventDefault();
      if (k === "ArrowUp") dev.up();
      else if (k === "ArrowDown") dev.down();
      else if (k === "ArrowRight" || k === "Enter") dev.select();
      else if (k === "ArrowLeft" || k === "Backspace") dev.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dev]);

  const lesson = dev.view.kind === "demo" ? dev.view.demo.lesson : null;
  const demoLabel = dev.view.kind === "demo" ? dev.view.node.label : "";
  const debriefId = dev.view.kind === "demo" ? dev.view.demo.debriefId : undefined;

  return (
    <div className="sim">
      <div className="sim-stage">
        <div className="device">
          <div className="device-top"><span className="device-brand">VariOne</span><span className="device-led" /></div>
          <div className="oled">
            {dev.view.kind === "menu" ? <OledMenu view={dev.view} /> : <OledDemo view={dev.view} />}
          </div>
          <div className="pad">
            <button className="pad-btn up" onClick={dev.up} aria-label="Up">▲</button>
            <button className="pad-btn left" onClick={dev.back} aria-label="Back">◀</button>
            <button className="pad-btn ok" onClick={dev.select} aria-label="Select">OK</button>
            <button className="pad-btn right" onClick={dev.select} aria-label="Select">▶</button>
            <button className="pad-btn down" onClick={dev.down} aria-label="Down">▼</button>
          </div>
          <div className="pad-legend"><span>▲▼ scroll</span><span>▶/OK select</span><span>◀ back</span></div>
        </div>

        <div className="sim-side">
          {lesson ? (
            <div className="lesson card">
              <span className="tag">Vemo explains</span>
              <h3>{demoLabel}</h3>
              <p><strong className="l-label">What happened</strong>{lesson.what}</p>
              <p><strong className="l-label">Why it matters</strong>{lesson.why}</p>
              <p><strong className="l-label l-ok">How to stay safer</strong>{lesson.defend}</p>
              {dev.demoDone && (
                <div className="lesson-actions">
                  {debriefId && (
                    <button className="btn btn--primary btn--sm" onClick={() => onOpenDebrief(debriefId)}>
                      View debrief →
                    </button>
                  )}
                  <button className="btn btn--ghost btn--sm" onClick={dev.back}>← Back to menu</button>
                </div>
              )}
            </div>
          ) : (
            <div className="lesson card lesson--idle">
              <span className="tag">Try it</span>
              <h3>Drive the device</h3>
              <p>Use the buttons (or your keyboard arrows and Enter) to move through the real menus.</p>
              <ul className="howto">
                <li><b>Wi-Fi → AP Scan</b> watch it find networks</li>
                <li><b>Wi-Fi → VariPortal</b> the fake-network demo</li>
                <li><b>Sub-GHz → Capture</b> record a remote</li>
                <li><b>NFC → Read Bank Card</b> read a card</li>
              </ul>
              <p className="muted">Everything here is a safe simulation. No real radios are used.</p>
            </div>
          )}
        </div>
      </div>

      <div className="sim-actions">
        <button className="btn btn--ghost" onClick={dev.reset}>↺ Reset device</button>
        <button className="btn btn--ghost" onClick={() => onOpenDebrief()}>View a debrief</button>
        <button className="btn btn--primary" onClick={onOpenAcademy}>Vemo's Academy →</button>
      </div>
    </div>
  );
}
