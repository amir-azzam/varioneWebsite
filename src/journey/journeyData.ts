// Single source of truth for the build-journey timeline.
//
// Now ALIGNED TO THE BUILD VIDEO. Each node's `videoTime` is the second in the
// cut (public/assets/journey.mp4) where that beat begins — read off the video's
// own dated caption cards. The page and the video move together: when the video
// reaches a node's videoTime, that node activates, its colored text reveals, and
// Vemo rides the morale curve to that point. The video is the master clock; the
// page is scroll-driven only as a fallback (no video / reduced motion).
//
// curveY = morale 0-100 — the emotional spine. The dip is the broken screen +
// the month-long bug hunt (May); the peak is "NRF FINALLY WORKING" + the first
// website launch (mid-June).
//
// videoTime is PROVISIONAL — derived from the current cut. The final cut adds
// voiceover + a blooper tail (~10-20s longer) but the main content/order is
// unchanged, so only small nudges (or the dev capture mode, ?capture) are needed
// to re-stamp these. Bloopers play past the last node without moving the morale.
//
// `mood` is a REAL Vemo mascot figure (see Vemo.tsx), not the OLED face.

import type { VemoMood } from "./Vemo";

export type JourneyNode = {
  id: string;
  period: string;     // short rail label, e.g. "Jun 14–15"
  dateRange: string;  // the on-screen caption date
  headline: string;
  mood: VemoMood;     // which mascot figure rides this node
  curveY: number;     // morale 0-100
  videoTime: number;  // seconds into journey.mp4 when this beat begins
  lede: string;       // the beat's story (2-4 sentences)
  broke: string[];    // what went wrong / was hard
  won: string[];      // what got won
  moments: string[];  // short highlight chips
  stat: { label: string; value: string }; // one punchy by-the-numbers line
};

export const JOURNEY_NODES: JourneyNode[] = [
  {
    id: "concept",
    period: "Apr · Concept",
    dateRange: "From concept to reality",
    headline: "From Concept to Reality",
    mood: "curious",
    curveY: 38,
    videoTime: 0,
    lede:
      "It started as an idea and a blank repository: a friendly handheld that could make invisible wireless signals visible, so anyone could learn how they work. Before a single radio worked, we wrote the spec, formed the team, and gave the device a face — Vemo. It felt slow because it was, but the project officially existed.",
    broke: [
      "A blank slate — all planning, no firmware on hardware yet",
      "The spec churned constantly: PRD, briefs, scope rewritten",
      "Eight people, one device, and no shared muscle memory yet",
    ],
    won: [
      "First commit landed — the project officially existed",
      "Wrote a 1,200-line PRD as our single source of truth",
      "Vemo the mascot born; the team of eight assembled",
    ],
    moments: ["first commit", "1,200-line PRD", "Vemo is born", "team of 8"],
    stat: { label: "code that booted on hardware", value: "0 lines" },
  },
  {
    id: "hardware",
    period: "Apr 12–23",
    dateRange: "Apr 12–23, 2026",
    headline: "First Hardware, First Light",
    mood: "focused",
    curveY: 48,
    videoTime: 22,
    lede:
      "We made our first run to the hardware store and wired the very first prototype on a breadboard. Rather than start from a blank file, we forked VariOne-S3 off the open-source Bruce baseline and earned it line by line. By April 23 the first real RF and NFC reads were coming back successful.",
    broke: [
      "A huge inherited Bruce codebase we hadn't written ourselves",
      "Bruce targets generic ESP32 — our S3 board needed its own port",
      "First wiring was guesswork; every jumper a small experiment",
    ],
    won: [
      "Forked VariOne-S3 cleanly onto the Bruce baseline",
      "Wired the first prototype and got a board to boot",
      "First RF and NFC reads came back successful (Apr 23)",
    ],
    moments: ["hardware-store run", "first wiring", "RF read OK", "NFC read OK", "the Bruce fork"],
    stat: { label: "first successful captures", value: "RF + NFC" },
  },
  {
    id: "first-light",
    period: "Apr 27–28",
    dateRange: "Apr 27–28, 2026",
    headline: "It Comes Alive",
    mood: "excited",
    curveY: 60,
    videoTime: 72,
    lede:
      "Within days the device started doing real things. We verified first-time SD-card data logging, ran initial packet sniffing, deployed the first evil-twin network simulation, and validated a stable UI screen we could finally trust. General WiFi testing, all green — the thing was alive.",
    broke: [
      "Early UI was flaky until we validated it screen by screen",
      "Signal storage needed proving before we could trust captures",
      "Lots of patient re-testing to call anything 'stable'",
    ],
    won: [
      "First-time SD-card data logging verified",
      "Initial packet sniffing and signal storage working",
      "First evil-twin (VariPortal) network simulation deployed",
      "Stable UI screen and general WiFi tests passing",
    ],
    moments: ["SD logging", "packet sniff", "first evil-twin", "stable UI", "WiFi tests"],
    stat: { label: "core features online", value: "4+" },
  },
  {
    id: "broken-screen",
    period: "May 13",
    dateRange: "May 13, 2026",
    headline: "The Broken Screen",
    mood: "sad",
    curveY: 26,
    videoTime: 138,
    lede:
      "Then the screen broke “for some reason” — the start of the project's longest bug-hunt: a shared SPI bus eating itself, an AP that swore it was alive but broadcast nothing, a web server that wouldn't rebind. It worked later, but it cost us weeks.",
    broke: [
      "Display died “for some reason” — and stayed dead",
      "AP reported 20 dBm but never broadcast its SSID",
      "Bad WiFi state stuck in NVS, surviving every reflash",
      "Port 80 wouldn't rebind after teardown (bind -8)",
    ],
    won: [
      "Traced it to a shared-bus + stale-NVS issue, not dead hardware",
      "A full chip-erase restored the beacon",
      "Promiscuous-off revived the dead AP left from attacks",
      "One persistent web server killed the port-80 clashes",
    ],
    moments: ["broken screen", "chip-erase fix", "promiscuous off", "port-80 wedge", "NVS gremlin"],
    stat: { label: 'weeks an AP said "open" while broadcasting nothing', value: "~3" },
  },
  {
    id: "supervisor",
    period: "Jun 2",
    dateRange: "June 2, 2026",
    headline: "Facing the Supervisor",
    mood: "happy",
    curveY: 56,
    videoTime: 165,
    lede:
      "We carried the new setup to Dr. Gaber for the first time — nervous, half-sure it would freeze on cue — and walked out with positive feedback. It was the moment the morale turned: the direction was right, and someone we trusted said so.",
    broke: [
      "Still fragile — some features were held together by hope",
      "Demo-day nerves: would it freeze the moment it mattered?",
      "No second chances to make a first impression",
    ],
    won: [
      "First full demo to the supervisor went through",
      "Positive feedback from Dr. Gaber on the new setup",
      "The direction was validated — momentum returned",
    ],
    moments: ["first supervisor demo", "positive feedback", "direction validated"],
    stat: { label: "supervisor verdict", value: "positive" },
  },
  {
    id: "nrf-finally",
    period: "Jun 14–15",
    dateRange: "June 14–15, 2026",
    headline: "NRF Finally Working",
    mood: "celebrating",
    curveY: 90,
    videoTime: 190,
    lede:
      'The wall we kept walking into for a month finally gave. We dropped below the Arduino API into the ESP32 framework source and found the real culprit — a peripheral manager silently tearing down the screen’s SPI bus the instant the radio grabbed a shared pin. We isolated the radio onto SPI3 with raw GPIO wiring; the screen lived, the SD mounted, and the jam cut a real Bluetooth headset dead. The attack-debrief feature landed and we launched the first version of the website. The commit is literally titled "NRF FINALLY WORKING."',
    broke: [
      "Turning on the NRF24 radio instantly froze the TFT screen",
      'The same bug, masked as freeze, then crash, then "chip not found"',
      "SD card refused to mount on the shared bus",
      "A whole month of the NRF module simply not functioning",
    ],
    won: [
      "Root cause found: periman tearing down the screen's SPI bus",
      "Isolated the radio on SPI3 via dummy pins + raw GPIO matrix",
      "Screen survived, SD mounted, jam cut a real BT headset dead",
      "CC1101 read fixed-vs-rolling codes; attack debrief + site v1 shipped",
    ],
    moments: ["periman teardown found", "SPI3 dummy pins", "SD mounted", "BT headset cut", "site v1 live", "NRF FINALLY WORKING"],
    stat: { label: "a month of NRF failure", value: "cracked in 1 week" },
  },
  {
    id: "badusb-ui",
    period: "Jun 17",
    dateRange: "June 17, 2026",
    headline: "BadUSB & Vemo",
    mood: "happy",
    curveY: 95,
    videoTime: 240,
    lede:
      "With the hard part behind us, the device got its personality. BadUSB and HID typing real payloads, the Vemo loading screen and a full on-device UI revamp, an AI debrief that writes itself in plain language — the polish that turned a breadboard into VariOne.",
    broke: [
      "Stale NVS kept broadcasting 'BruceNet' after we changed the default",
      "Cloud AI failed on hardware: only ~31KB contiguous heap, no PSRAM",
      "A stale SD theme hid Vemo's new face until we cleared it",
    ],
    won: [
      "BadUSB / HID typing live payloads on the target",
      "Vemo loading screen + UI revamp across 11 build-green batches",
      "AI debrief end-to-end: local LAN → Groq → Gemini → offline fallback",
      "Rebrand to VariOne + VariPortal; finale-fixes made the default branch",
    ],
    moments: ["BadUSB live", "Vemo loading screen", "11 UI batches", "offline AI fallback", "Bruce → VariOne"],
    stat: { label: "UI revamp batches, each HW-tested", value: "11" },
  },
];

// The video's cue points are DERIVED from the nodes above — no second source to
// keep in sync. The video-sync hook reads these.
export const VIDEO_CUES = JOURNEY_NODES.map((n) => ({ nodeId: n.id, time: n.videoTime }));
