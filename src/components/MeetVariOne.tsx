// Meet VariOne: copy + an interactive signal list on the left, the device on the
// right. Hovering a signal fades the device into a ghost and reveals a light-blue
// "skeleton" panel listing that signal's real capabilities (from the docs + notes).

import { useEffect, useState } from "react";
import { SignalBackground } from "./SignalBackground";
import { Device3D } from "./Device3D";
import "./meet.css";

// Touch devices have no hover, so below this width we switch the signal list to a
// tap-driven layout (accordion or cards - a toggle lets us pick the keeper).
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    // touch OR narrow - so a phone keeps the tap layout even when zoomed out
    // (zooming out widens the CSS viewport and would otherwise flip to desktop).
    const mq = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

type Sub = { name: string; desc: string; soon?: boolean; wip?: boolean; debrief?: boolean };
type Sig = { key: string; name: string; text: string; subs: Sub[] };

const SIGNALS: Sig[] = [
  {
    key: "wifi", name: "Wi-Fi",
    text: "Scan networks and show how fake-network tricks work.",
    subs: [
      { name: "AP Scan", desc: "List nearby networks, their strength and channel." },
      { name: "Deauth", desc: "Flood fake 'disconnect' messages until a device drops off. 2.4 GHz.", debrief: true },
      { name: "BeaconSpam", desc: "Broadcast a list of fake Wi-Fi network names at once, loaded from a file.", debrief: true },
      { name: "VariPortal (Credential Capture)", desc: "Clone a real network with a login page and check the typed password against the real one.", debrief: true },
    ],
  },
  {
    key: "rf", name: "Sub-GHz",
    text: "Record, replay and inspect old gate and car-remote signals.",
    subs: [
      { name: "Capture", desc: "Record a 433 MHz gate or car-remote signal." },
      { name: "Replay", desc: "Play a saved signal back to trigger the target." },
      { name: "Frequency Scan", desc: "Sweep bands to find which one a remote uses." },
      { name: "RF Jammer", desc: "Flood a frequency with noise so a real remote can't be heard.", debrief: true },
      { name: "Key Fob Inspect", desc: "Capture a fob twice to tell fixed-code from secure rolling-code." },
      { name: "Load Capture", desc: "Open a saved RF signal from the SD card." },
    ],
  },
  {
    key: "nfc", name: "NFC",
    text: "Read contactless cards and access badges, safely.",
    subs: [
      { name: "EMV Reader", desc: "Read a contactless bank card: masked last-4, expiry, issuer. Full number never shown." },
      { name: "Access Card", desc: "Read, save and replay a building-access badge (Mifare)." },
      { name: "Saved Cards", desc: "Keep and review what you've read." },
    ],
  },
  {
    key: "ir", name: "IR",
    text: "Clone and replay TV and AC remotes.",
    subs: [
      { name: "Custom Remote Clone", desc: "Learn an AC or TV button by button, then act as that remote." },
      { name: "TV-B-Gone", desc: "Blast power-off codes at nearby TVs.", soon: true },
    ],
  },
  {
    key: "nrf", name: "nRF24",
    text: "Watch and disrupt the whole 2.4 GHz band.",
    subs: [
      { name: "2.4GHz Analyzer", desc: "Map everything transmitting on 2.4 GHz, and spot floods or jamming." },
      { name: "nRF Jammer", desc: "Jam Bluetooth and 2.4 GHz Wi-Fi: earbuds, speakers, wireless mice and keyboards.", debrief: true },
    ],
  },
  {
    key: "badusb", name: "BadUSB",
    text: "Pose as a USB keyboard and type a payload by itself.",
    subs: [
      { name: "USB HID Injection", desc: "Plug into an unlocked computer and type a scripted payload at machine speed.", debrief: true },
    ],
  },
];

function SigIcon({ k }: { k: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (k === "wifi")
    return (<svg viewBox="0 0 24 24" width="22" height="22"><path {...s} d="M2 8.5a16 16 0 0 1 20 0" /><path {...s} d="M5 12a11 11 0 0 1 14 0" /><path {...s} d="M8.5 15.5a6 6 0 0 1 7 0" /><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none" /></svg>);
  if (k === "rf")
    return (<svg viewBox="0 0 24 24" width="22" height="22"><path {...s} d="M12 3v12" /><circle cx="12" cy="18" r="2.4" /><path {...s} d="M7 6a7 7 0 0 0 0 8M17 6a7 7 0 0 1 0 8M4.5 4a11 11 0 0 0 0 12M19.5 4a11 11 0 0 1 0 12" /></svg>);
  if (k === "nfc")
    return (<svg viewBox="0 0 24 24" width="22" height="22"><rect {...s} x="3" y="6" width="18" height="12" rx="2.5" /><path {...s} d="M7 10.5a3.5 3.5 0 0 1 0 3M10 9a6 6 0 0 1 0 6" /></svg>);
  if (k === "nrf")
    return (<svg viewBox="0 0 24 24" width="22" height="22"><path {...s} d="M12 14v6" /><circle cx="12" cy="12" r="2" /><path {...s} d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M6 6a8 8 0 0 0 0 12M18 6a8 8 0 0 1 0 12" /></svg>);
  if (k === "badusb")
    return (<svg viewBox="0 0 24 24" width="22" height="22"><path {...s} d="M12 2v14" /><path {...s} d="M9 5l3-3 3 3" /><rect {...s} x="8" y="16" width="8" height="6" rx="1.5" /><line {...s} x1="10" y1="9" x2="10" y2="11" /><line {...s} x1="14" y1="7" x2="14" y2="11" /></svg>);
  return (<svg viewBox="0 0 24 24" width="22" height="22"><rect {...s} x="8" y="3" width="8" height="18" rx="3" /><line {...s} x1="12" y1="7" x2="12" y2="7.2" /><circle cx="12" cy="14" r="2" /></svg>);
}

// Shared sub-feature list for the mobile accordion + cards layouts.
function SubList({ subs }: { subs: Sub[] }) {
  return (
    <ul className="m-subs">
      {subs.map((sub) => (
        <li key={sub.name} className="m-sub">
          <span className="m-sub-name">
            {sub.name}
            {sub.soon && <span className="sk-tag sk-tag--soon">soon</span>}
            {sub.wip && <span className="sk-tag sk-tag--soon">in progress</span>}
            {sub.debrief && <span className="sk-tag">AI debrief</span>}
          </span>
          <span className="m-sub-desc">{sub.desc}</span>
        </li>
      ))}
    </ul>
  );
}

export function MeetVariOne() {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const hoverOpen = hovered !== null;
  const sig = hoverOpen ? SIGNALS[hovered] : null;
  const toggle = (i: number) => setOpenIdx((o) => (o === i ? null : i));

  return (
    <section className="section meet" id="meet">
      <SignalBackground variant="circuit" />

      <div className="wrap meet-inner">
        <div className="meet-copy">
          <h2>Cute outside.<br />Powerful inside.</h2>
          <p className="lead">
            VariOne is a handheld teaching device. It brings every kind of everyday
            wireless signal into one box.{" "}
            <strong>{isMobile ? "Tap" : "Hover"} a signal</strong> to see what it can
            actually do.
          </p>

          {/* desktop: hover list */}
          {!isMobile && (
            <ul className="signals" role="list" onMouseLeave={() => setHovered(null)}>
              {SIGNALS.map((s, i) => (
                <li
                  key={s.key}
                  className={`sig-row ${i === hovered ? "is-active" : ""}`}
                  onMouseEnter={() => setHovered(i)}
                  onClick={() => setHovered((h) => (h === i ? null : i))}
                >
                  <span className="sig-ico"><SigIcon k={s.key} /></span>
                  <div className="sig-body">
                    <span className="sig-name">{s.name}</span>
                    <span className="sig-text">{s.text}</span>
                  </div>
                  <span className="sig-arrow" aria-hidden="true">›</span>
                </li>
              ))}
            </ul>
          )}

          {/* mobile: tap-driven accordion (animated open/close) */}
          {isMobile && (
            <ul className="m-acc" role="list">
              {SIGNALS.map((s, i) => (
                <li key={s.key} className={`m-acc-item ${openIdx === i ? "is-open" : ""}`}>
                  <button className="m-acc-head" aria-expanded={openIdx === i} onClick={() => toggle(i)}>
                    <span className="sig-ico"><SigIcon k={s.key} /></span>
                    <span className="m-acc-text">
                      <span className="sig-name">{s.name}</span>
                      <span className="sig-text">{s.text}</span>
                    </span>
                    <span className="m-chev" aria-hidden="true">+</span>
                  </button>
                  <div className="m-acc-panel">
                    <div className="m-acc-panel-inner"><SubList subs={s.subs} /></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`meet-stage ${isMobile ? "is-compact" : ""}`}>
          <span className="box-corner tl" /><span className="box-corner tr" />
          <span className="box-corner bl" /><span className="box-corner br" />
          <div className="box-platform" />
          <div className="meet-glow" />
          <Device3D ghost={!isMobile && hoverOpen} />

          {!isMobile && (
            <div className={`skeleton ${hoverOpen ? "is-open" : ""}`} aria-hidden={!hoverOpen}>
              {sig && (
                <>
                  <div className="sk-head">
                    <span className="sk-ico"><SigIcon k={sig.key} /></span>
                    <span className="sk-title">{sig.name}</span>
                    <span className="sk-count">{sig.subs.length} tools</span>
                  </div>
                  <ul className="sk-list">
                    {sig.subs.map((sub) => (
                      <li key={sub.name} className="sk-item">
                        <span className="sk-node" />
                        <div>
                          <span className="sk-name">
                            {sub.name}
                            {sub.soon && <span className="sk-tag sk-tag--soon">soon</span>}
                            {sub.wip && <span className="sk-tag sk-tag--soon">in progress</span>}
                            {sub.debrief && <span className="sk-tag">AI debrief</span>}
                          </span>
                          <span className="sk-desc">{sub.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="wrap">
        <div className="why">
          <strong>Why it matters:</strong> in Egypt, most WiFi networks, car and gate
          remotes, and contactless cards still use older tech that's surprisingly easy
          to exploit, and most people never see it happen. VariOne makes it visible, and
          every attack comes with a debrief that explains how it works and how to stop it.
        </div>
      </div>
    </section>
  );
}
