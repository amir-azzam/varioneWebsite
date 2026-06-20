// Debrief view. On the real device, after an attack it auto-generates a debrief
// (served at 192.168.4.1). Here we show that debrief as clean, summarised text in
// the "AI analysis" voice, so visitors see what the device explains. A small picker
// switches between each attack's debrief. Opened from the simulator's Debrief button
// or handed off when an attack demo finishes.

import { useEffect } from "react";
import { DEBRIEFS, DEBRIEF_ORDER } from "../device/content";
import "./debrief.css";

export function DebriefModal({
  open, activeId, onSelect, onClose,
}: {
  open: boolean;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const d = DEBRIEFS[activeId] ?? DEBRIEFS[DEBRIEF_ORDER[0]];

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Device debrief">
      <div className="db" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="db-head">
          <span className="db-badge">VariOne Debrief</span>
          <p className="db-sub">After an attack, VariOne writes its own debrief. Here's what it tells you.</p>
        </div>

        <div className="db-picker" role="tablist">
          {DEBRIEF_ORDER.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={id === activeId}
              className={`db-tab ${id === activeId ? "is-active" : ""}`}
              onClick={() => onSelect(id)}
            >
              {DEBRIEFS[id].feature.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div className="db-body">
          <h3 className="db-feature">{d.feature}</h3>
          <span className="db-vector">{d.vector}</span>

          <h4 className="db-h">What just happened</h4>
          <p>{d.whatHappened}</p>

          <h4 className="db-h">Staying safe</h4>
          <ul className="db-tips">
            {d.stayingSafe.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          {d.closing && <p className="db-closing">{d.closing}</p>}

          <p className="db-foot">Generated on-device by VariOne. Authorised lab / demo use only.</p>
        </div>
      </div>
    </div>
  );
}
