// Device content model for the simulator.
// The menu tree mirrors the real firmware (top menu + submenus from the device
// feature recap). Every runnable demo is a SAFE, scripted animation — no real
// radios — plus a plain-language lesson. Attack-class features also carry an
// AI-style "debrief" (the device generates one on the real hardware). Keeps the
// simulator honest while staying purely educational (awareness, not attack).

export type Mood =
  | "idle" | "happy" | "thinking" | "sad" | "angry"
  | "sleeping" | "success" | "fail" | "working" | "waving";

// working = on the device now; progress = being built, not working yet;
// planned = on the roadmap, not built.
export type Status = "working" | "progress" | "planned";

export type Frame = {
  mood: Mood;
  title: string;
  lines?: string[];
  bars?: number[];   // signal-bar widget
  wave?: boolean;    // animated RF waveform
  ms: number;
};

// AI-analysis style debrief (the device auto-generates one after an attack).
export type Debrief = {
  id: string;
  feature: string;       // e.g. "USB HID Injection (BadUSB)"
  vector: string;        // one-line "what kind of attack"
  whatHappened: string;  // plain "what just happened" paragraph
  stayingSafe: string[]; // bullet tips
  closing?: string;
};

export type Demo = {
  frames: Frame[];
  lesson: { what: string; why: string; defend: string };
  debriefId?: string;    // attack-class features link to a debrief
};

export type MenuNode = {
  id: string;
  label: string;
  blurb?: string;
  status?: Status;     // default "working"
  children?: MenuNode[];
  demo?: Demo;
};

// ---- Debriefs (AI-analysis voice, summarised) --------------------------

export const DEBRIEFS: Record<string, Debrief> = {
  badusb: {
    id: "badusb",
    feature: "USB HID Injection (BadUSB)",
    vector: "A fake USB keyboard that types by itself",
    whatHappened:
      "A device that looked like an ordinary USB stick was plugged into a computer. It told the computer it was a keyboard and started typing a script at machine speed, far faster than any person could. Computers trust any USB keyboard without checking, so it was free to type commands the moment it was connected. In our test it wrote a full script into a file in about six seconds. No software was hacked — it was just automated typing.",
    stayingSafe: [
      "Lock your screen whenever you step away. The attack only works on an unlocked computer.",
      "Never plug in a USB device you found or don't recognise.",
      "Use USB device control or HID allowlisting so only keyboards you approve can type.",
      "Disable USB ports you don't use, and use a charge-only cable when charging from a public port.",
    ],
    closing:
      "Staying safe with computers is like staying safe anywhere: notice what's around you, and don't trust a device just because it looks ordinary.",
  },
  variportal: {
    id: "variportal",
    feature: "Evil Twin / Credential Capture (VariPortal)",
    vector: "A fake copy of a real Wi-Fi network",
    whatHappened:
      "The device made a fake copy of a real Wi-Fi network. When someone connected, they saw a login page that looked exactly like the real one and typed in the Wi-Fi password. The device checked that password against the real network, so it instantly knew whether it was correct. Nothing was 'hacked' — people simply trusted a familiar-looking page.",
    stayingSafe: [
      "Don't type your Wi-Fi or account password into a page that pops up right after you join a network.",
      "Check the network name carefully. An evil twin copies it exactly, so watch for duplicates.",
      "On public Wi-Fi, use a VPN and stick to sites that show https.",
      "Turn on WPA3 (or WPA2 with Protected Management Frames) so your devices are harder to push onto a fake network.",
    ],
    closing:
      "This trick works on trust, not technology. If a login page appears out of nowhere, stop and check before you type anything.",
  },
  beaconspam: {
    id: "beaconspam",
    feature: "Beacon Spam (Fake Network Flood)",
    vector: "Floods the air with fake Wi-Fi network names",
    whatHappened:
      "The device broadcast a long list of fake Wi-Fi network names all at once, so every phone nearby suddenly saw dozens of networks that don't really exist. The names are loaded from a file beforehand, which shows how crowded and untrustworthy the list of 'available networks' can get. None of them are real access points; nobody can actually connect to them.",
    stayingSafe: [
      "Don't trust a network just because the name looks familiar or funny. Anyone can broadcast any name.",
      "Only connect to networks you set up yourself or have confirmed in person.",
      "If you see a flood of odd network names, treat that area's Wi-Fi as untrustworthy and use mobile data or a VPN.",
    ],
    closing:
      "The list of 'available networks' is just names anyone can shout into the air. A screen full of fakes is a good reminder not to trust them blindly.",
  },
  deauth: {
    id: "deauth",
    feature: "Deauthentication Flood",
    vector: "Fake 'disconnect' messages on 2.4 GHz Wi-Fi",
    whatHappened:
      "The device sent a stream of 'disconnect' messages to a target on 2.4 GHz Wi-Fi. Older networks accept these messages without checking who sent them, so the target kept getting kicked off and couldn't stay connected. On its own it's a nuisance, but it's often the first step to pushing someone onto a fake network.",
    stayingSafe: [
      "Turn on WPA3, or WPA2 with Protected Management Frames (802.11w). It blocks these fake disconnects.",
      "Where you can, move important devices to a 5 GHz network.",
      "If your Wi-Fi keeps dropping for no clear reason, jamming or a deauth attack could be the cause — worth investigating.",
    ],
    closing:
      "A network that can't tell a real disconnect from a fake one will believe the attacker. Modern Wi-Fi fixes exactly that.",
  },
  rfjam: {
    id: "rfjam",
    feature: "Sub-GHz RF Jammer",
    vector: "Noise flooded onto a remote's frequency (e.g. 433 MHz)",
    whatHappened:
      "The device flooded a frequency like 433 MHz with noise. Car keys, garage remotes and similar gadgets all talk on these bands, so while the noise is on, the real remote can't be heard and simply stops working. Nothing is broken — the real signal is just drowned out.",
    stayingSafe: [
      "If your car remote or gate suddenly stops working in one spot, you may be near a jammer. Lock the car manually and check every door before walking away.",
      "Prefer gear that uses rolling codes and warns you about tampering.",
      "Jamming is illegal outside authorised testing. This is shown only to explain the risk.",
    ],
    closing:
      "A jammer doesn't steal anything — it just makes sure your 'lock' button is never heard. Always confirm the car actually locked.",
  },
  nrfjam: {
    id: "nrfjam",
    feature: "2.4 GHz (nRF24) Jammer",
    vector: "Noise flooded across the 2.4 GHz band",
    whatHappened:
      "The device flooded the 2.4 GHz band — the same space used by Bluetooth, Wi-Fi, and the little dongles that come with wireless mice and keyboards. By raising the noise across many channels at once, the targets can't hear their own signal. In testing, Bluetooth speakers and earbuds distorted and then cut out, and wireless mice and keyboards stopped responding.",
    stayingSafe: [
      "For anything that matters (a presentation, a security keypad) prefer a wired connection.",
      "Remember that Bluetooth and 2.4 GHz wireless can be disrupted by someone nearby — keep a backup.",
      "Jamming is illegal outside authorised testing. This is shown only to explain the risk.",
    ],
    closing:
      "Wireless is convenient, but it shares the air with everyone. Anything important is safer on a wire.",
  },
};

export const DEBRIEF_ORDER = ["badusb", "variportal", "beaconspam", "deauth", "rfjam", "nrfjam"];

// ---- Wi-Fi demos -------------------------------------------------------

const apScan: Demo = {
  frames: [
    { mood: "working", title: "AP Scan", lines: ["Scanning 2.4GHz...", "channels 1-13"], ms: 1400 },
    { mood: "working", title: "AP Scan", lines: ["CIC_Lab   ch6", "TP-LINK_A4F2 ch1"], bars: [82, 55], ms: 1200 },
    { mood: "happy", title: "AP Scan", lines: ["CIC_Lab", "TP-LINK_A4F2", "WE_5521", "iPhone (Ahmed)"], bars: [82, 55, 38, 20], ms: 1700 },
    { mood: "success", title: "AP Scan", lines: ["4 networks found", "pick one to target"], bars: [82, 55, 38, 20], ms: 1800 },
  ],
  lesson: {
    what: "The device listened to the air and listed every nearby Wi-Fi network, how strong each one is, and which channel it uses.",
    why: "Anyone nearby can see your network's name and details without connecting. The name alone often gives away the router or even the owner, like 'iPhone (Ahmed)'. This list is also the starting point for the other Wi-Fi tools.",
    defend: "Don't name your network after yourself or your address, and use a strong WPA2 or WPA3 password.",
  },
};

const deauth: Demo = {
  frames: [
    { mood: "thinking", title: "Deauth", lines: ["LAB USE ONLY", "Target: CIC_Lab"], ms: 1500 },
    { mood: "angry", title: "Deauth", lines: ["Sending disconnects", "frames: 128"], ms: 1300 },
    { mood: "angry", title: "Deauth", lines: ["Phone dropped off", "frames: 642"], ms: 1500 },
    { mood: "working", title: "Deauth", lines: ["Target kept offline", "BACK to stop"], ms: 1700 },
    { mood: "success", title: "Deauth", lines: ["Debrief ready", "see what happened"], ms: 1600 },
  ],
  lesson: {
    what: "The device sent a flood of fake 'disconnect' messages that kept knocking a device off its Wi-Fi. Older networks trust these without checking who sent them.",
    why: "In Egypt most home and small-business Wi-Fi still runs WPA2 without protection against this, so an attacker can keep a device offline or push it onto a fake network.",
    defend: "Newer Wi-Fi (WPA3, or WPA2 with Protected Management Frames) blocks this. If your router has the option, turn it on.",
  },
  debriefId: "deauth",
};

const beaconSpam: Demo = {
  frames: [
    { mood: "thinking", title: "BeaconSpam", lines: ["Loading SSIDs", "17 names from SD"], ms: 1400 },
    { mood: "working", title: "BeaconSpam", lines: ["Dracosec", "Odyssey", "Sekka", "Finova"], ms: 1400 },
    { mood: "working", title: "BeaconSpam", lines: ["Vortexa", "Sensefy", "EduEase", "Eventora"], ms: 1400 },
    { mood: "happy", title: "BeaconSpam", lines: ["SmartShield", "calorify", "+ 9 more"], ms: 1300 },
    { mood: "success", title: "BeaconSpam", lines: ["17 fake APs live", "Debrief ready"], ms: 1700 },
  ],
  lesson: {
    what: "The device broadcast a whole list of fake Wi-Fi network names at once, loaded from a file beforehand. Every phone nearby suddenly sees networks that don't really exist. In this demo the names are our own team's project names (Dracosec, Odyssey, Sekka, Finova, and more), so no real network is impersonated.",
    why: "It shows how easily the list of 'available networks' you trust can be faked. The names are just text anyone can broadcast, and none of them are real access points.",
    defend: "Don't assume a network is real because the name looks familiar. Connect only to networks you set up or have confirmed in person.",
  },
  debriefId: "beaconspam",
};

const variPortal: Demo = {
  frames: [
    { mood: "thinking", title: "VariPortal", lines: ["LAB USE ONLY", "Cloning CIC_Lab"], ms: 1500 },
    { mood: "working", title: "VariPortal", lines: ["Fake AP is up", "login page served"], ms: 1400 },
    { mood: "angry", title: "VariPortal", lines: ["Victim connected", "typing password..."], ms: 1500 },
    { mood: "working", title: "VariPortal", lines: ["Checking vs real AP", "..."], ms: 1300 },
    { mood: "success", title: "VariPortal", lines: ["Password correct!", "Debrief ready"], ms: 1900 },
  ],
  lesson: {
    what: "The device made a fake copy of a real Wi-Fi network with a matching login page. When someone connected and typed the Wi-Fi password, the device checked it against the real network and instantly knew if it was right.",
    why: "This is the 'evil twin' trick. The fake looks identical, so people type their password without thinking. It captures credentials by abusing trust, not by breaking anything.",
    defend: "Never type a password into a login page that appears right after joining a network. Check the network name, and on public Wi-Fi use a VPN.",
  },
  debriefId: "variportal",
};

// ---- Sub-GHz demos -----------------------------------------------------

const sgCapture: Demo = {
  frames: [
    { mood: "working", title: "Capture", lines: ["Listening 433.92", "press your remote"], ms: 1500 },
    { mood: "working", title: "Capture", lines: ["Signal incoming..."], wave: true, ms: 1300 },
    { mood: "success", title: "Capture", lines: ["Captured!", "saved to SD"], wave: true, ms: 1700 },
  ],
  lesson: {
    what: "The device recorded the radio signal from a gate or car remote on the 433 MHz band and saved it to the SD card.",
    why: "Many older gates and garages in Egypt use 'fixed-code' remotes that send the same code every time. Record it once and you can replay it later, with under 200 EGP of parts.",
    defend: "Use 'rolling code' remotes that send a new code each press. Modern car keys already do this; old fixed-code gates should be upgraded.",
  },
};

const sgReplay: Demo = {
  frames: [
    { mood: "thinking", title: "Replay", lines: ["LAB USE ONLY", "433.92 MHz"], ms: 1500 },
    { mood: "working", title: "Replay", lines: ["Transmitting...", "saved signal"], wave: true, ms: 1400 },
    { mood: "success", title: "Replay", lines: ["Replay sent", "gate reacted"], ms: 1700 },
  ],
  lesson: {
    what: "The device played back the radio signal it recorded earlier, fooling a fixed-code gate into thinking the real remote was used.",
    why: "This is why 'record once, replay later' is a real risk for old remotes. The gate can't tell a replay from the real thing.",
    defend: "Rolling-code remotes defeat replay, because yesterday's code won't work today.",
  },
};

const sgScan: Demo = {
  frames: [
    { mood: "working", title: "Freq Scan", lines: ["Sweeping 9 bands", "hold the remote"], ms: 1500 },
    { mood: "working", title: "Freq Scan", lines: ["300 315 433...", "868 915 MHz"], bars: [10, 22, 88, 15, 30], ms: 1500 },
    { mood: "success", title: "Freq Scan", lines: ["Winner: 433.92", "strongest band"], bars: [10, 22, 88, 15, 30], ms: 1800 },
  ],
  lesson: {
    what: "The device swept nine common radio bands to find which one your remote actually transmits on, then locked onto the strongest.",
    why: "Different remotes use different frequencies. Finding the right one is the first step before you can capture or inspect a signal.",
    defend: "Nothing to defend here. This is the discovery tool that shows how a signal is found in the first place.",
  },
};

const sgJammer: Demo = {
  frames: [
    { mood: "thinking", title: "RF Jammer", lines: ["LAB USE ONLY", "433.92 MHz"], ms: 1500 },
    { mood: "angry", title: "RF Jammer", lines: ["Flooding noise...", "band blocked"], wave: true, ms: 1500 },
    { mood: "angry", title: "RF Jammer", lines: ["Car remote ignored", "gate won't open"], ms: 1600 },
    { mood: "success", title: "RF Jammer", lines: ["Stopped jamming", "Debrief ready"], ms: 1700 },
  ],
  lesson: {
    what: "The device flooded a frequency like 433 MHz with noise, so a real remote on that band can't be heard. The car key or gate simply stops responding while the noise is on.",
    why: "If a thief jams the frequency as you press 'lock', your car may never actually lock, and you won't notice. It costs very little to build.",
    defend: "Always check your car physically locked. Prefer remotes that use rolling codes and warn about tampering.",
  },
  debriefId: "rfjam",
};

const sgKeyFob: Demo = {
  frames: [
    { mood: "working", title: "Key Fob", lines: ["Press the fob once", "capturing..."], wave: true, ms: 1500 },
    { mood: "thinking", title: "Key Fob", lines: ["Press it again", "comparing codes"], wave: true, ms: 1600 },
    { mood: "success", title: "Key Fob", lines: ["Codes differ", "ROLLING = secure"], ms: 1900 },
  ],
  lesson: {
    what: "The device captured a key fob's signal twice and compared the two codes. The same code each time means a 'fixed code' (easy to replay). A different code each time means a 'rolling code' (secure).",
    why: "It tells you instantly whether a remote can be cloned by a simple record-and-replay attack.",
    defend: "If a fob is fixed-code, replace or upgrade it. Rolling-code remotes are the safe choice.",
  },
};

const sgLoad: Demo = {
  frames: [
    { mood: "working", title: "Load Capture", lines: ["Reading SD card", "/captures"], ms: 1400 },
    { mood: "happy", title: "Load Capture", lines: ["gate_433.sub", "carkey_315.sub", "fan_433.sub"], ms: 1600 },
    { mood: "success", title: "Load Capture", lines: ["Loaded gate_433", "ready to replay"], ms: 1700 },
  ],
  lesson: {
    what: "The device opened a signal you saved earlier on the SD card, so you can replay or inspect it without recording it again.",
    why: "Captured signals can be stored and reused later, which is exactly why fixed-code remotes are risky: the code doesn't expire.",
    defend: "Treat a saved signal like a spare key. Rolling-code remotes make an old saved capture useless.",
  },
};

// ---- NFC demos ---------------------------------------------------------

const nfcBank: Demo = {
  frames: [
    { mood: "working", title: "EMV Reader", lines: ["Hold card", "near the coil..."], ms: 1500 },
    { mood: "thinking", title: "EMV Reader", lines: ["Card detected", "reading..."], ms: 1200 },
    { mood: "success", title: "EMV Reader", lines: ["**** **** **** 1234", "exp 09/27  Meeza"], ms: 2300 },
  ],
  lesson: {
    what: "The device read a contactless bank card from a few centimetres away and showed only the masked number (last 4 digits), the expiry, and sometimes the issuer. The full number is never stored or shown — it's masked the moment it's read.",
    why: "Cards answer any reader that gets close enough, even through a wallet. In Egypt, contactless pays up to 600 EGP with no PIN, and almost nobody knows what a tap can leak at short range. This demo poses no real risk; it just shows what's exposed.",
    defend: "Use an RFID-blocking sleeve or wallet, and keep an eye on contactless limits and your statements.",
  },
};

const nfcAccess: Demo = {
  frames: [
    { mood: "working", title: "Access Card", lines: ["Hold badge", "near the coil..."], ms: 1500 },
    { mood: "thinking", title: "Access Card", lines: ["Mifare card", "reading UID"], ms: 1300 },
    { mood: "success", title: "Access Card", lines: ["UID 04 9C 1A 3F", "saved + can replay"], ms: 2000 },
  ],
  lesson: {
    what: "The device read a building-access badge (a Mifare card), saved its ID, and can replay it later to open the same door, elevator or gate.",
    why: "A lot of office, gym and building cards use old, unencrypted chips. If the door only checks the card's ID, a copy opens it just the same.",
    defend: "Use access cards that need a PIN or use modern, encrypted chips. Don't rely on the card ID alone.",
  },
};

const nfcSaved: Demo = {
  frames: [
    { mood: "working", title: "Saved Cards", lines: ["Reading SD card", "/cards"], ms: 1400 },
    { mood: "happy", title: "Saved Cards", lines: ["Office_badge", "Gym_tag", "Hotel_room"], ms: 1700 },
  ],
  lesson: {
    what: "The list of cards and badges the device has read and saved before, ready to review or replay.",
    why: "It shows how easily a quick tap turns into a stored copy you can keep and reuse, which is the whole risk with simple access cards.",
    defend: "Don't hand your access card to strangers, and ask your building to use encrypted, PIN-protected cards.",
  },
};

// ---- IR demos ----------------------------------------------------------

const irClone: Demo = {
  frames: [
    { mood: "thinking", title: "Remote Clone", lines: ["Pick device: AC", "learn buttons"], ms: 1500 },
    { mood: "working", title: "Remote Clone", lines: ["Press POWER", "learning..."], ms: 1400 },
    { mood: "working", title: "Remote Clone", lines: ["Press TEMP +", "FAN, SWING..."], ms: 1500 },
    { mood: "success", title: "Remote Clone", lines: ["Remote cloned", "replaying POWER"], ms: 1800 },
  ],
  lesson: {
    what: "You pick a device type (like an AC), and VariOne prompts you button by button — power, temperature, fan, swing. It learns each one, saves them, and can then act as a copy of that remote.",
    why: "Infrared remotes send simple, unprotected codes. Anything with line of sight can learn and replay them, from a TV to an AC to some projectors.",
    defend: "Not much to defend for a TV, but be aware IR isn't private. For anything sensitive, don't rely on IR alone.",
  },
};

const irTvBGone: Demo = {
  frames: [
    { mood: "sleeping", title: "TV-B-Gone", lines: ["Planned", "not verified yet"], ms: 2400 },
  ],
  lesson: {
    what: "TV-B-Gone blasts a stream of power-off codes for many known TVs, grouped by region (like North America or Europe), to switch off TVs around you.",
    why: "It's a fun classic, but we haven't confirmed it works reliably with the mix of TV brands here in Egypt yet, so we list it as roadmap rather than claim it works.",
    defend: "Nothing to defend. It's a harmless switch-off prank, and we keep the site honest about what's actually verified.",
  },
};

// ---- nRF24 (2.4 GHz) demos --------------------------------------------

const nrfAnalyzer: Demo = {
  frames: [
    { mood: "working", title: "2.4GHz Scan", lines: ["Sweeping channels", "1 .. 80"], bars: [30, 50, 20, 70, 40], ms: 1500 },
    { mood: "thinking", title: "2.4GHz Scan", lines: ["Heavy traffic ch6", "deauth flood?"], bars: [30, 95, 20, 70, 40], ms: 1600 },
    { mood: "success", title: "2.4GHz Scan", lines: ["Activity mapped", "see the busy bands"], bars: [30, 95, 20, 70, 40], ms: 1800 },
  ],
  lesson: {
    what: "The device captured everything transmitting on 2.4 GHz and drew it as a live activity map. A sudden spike can reveal something like a deauth flood happening nearby.",
    why: "2.4 GHz is shared by Wi-Fi, Bluetooth and lots of gadgets. Seeing the activity makes invisible attacks and interference visible.",
    defend: "Nothing to defend here. It's a monitoring tool, useful for spotting jamming or floods early.",
  },
};

const nrfJammer: Demo = {
  frames: [
    { mood: "thinking", title: "nRF Jammer", lines: ["LAB USE ONLY", "2.4 GHz band"], ms: 1500 },
    { mood: "angry", title: "nRF Jammer", lines: ["Hopping channels", "flooding noise"], bars: [80, 90, 75, 95, 85], ms: 1500 },
    { mood: "angry", title: "nRF Jammer", lines: ["Earbuds cut out", "mouse frozen"], ms: 1600 },
    { mood: "success", title: "nRF Jammer", lines: ["Stopped jamming", "Debrief ready"], ms: 1700 },
  ],
  lesson: {
    what: "The device flooded the 2.4 GHz band, hopping across many channels (or all at once). That's the same space Bluetooth, Wi-Fi and wireless mouse/keyboard dongles use, so they lose their signal.",
    why: "Confirmed in testing: Bluetooth audio distorts then cuts out, and 2.4 GHz wireless mice and keyboards stop responding. It works by raising the noise so the target can't hear its own signal.",
    defend: "For anything important, prefer wired connections. Know that nearby 2.4 GHz wireless can be disrupted.",
  },
  debriefId: "nrfjam",
};

// ---- BadUSB ------------------------------------------------------------

const badusb: Demo = {
  frames: [
    { mood: "thinking", title: "BadUSB", lines: ["LAB USE ONLY", "load Ducky script"], ms: 1500 },
    { mood: "working", title: "BadUSB", lines: ["Plugged in", "acting as keyboard"], ms: 1400 },
    { mood: "angry", title: "BadUSB", lines: ["Typing payload...", "machine speed"], ms: 1500 },
    { mood: "success", title: "BadUSB", lines: ["Done in ~6s", "Debrief ready"], ms: 1800 },
  ],
  lesson: {
    what: "The device pretended to be an ordinary USB keyboard. The moment it was plugged into an unlocked computer, it typed a scripted set of keystrokes by itself, far faster than any human, with no click or confirmation.",
    why: "Computers trust any USB keyboard implicitly. A device that claims to be a keyboard can run commands the instant it's plugged in, as long as the screen is unlocked. No software exploit is involved — just automated typing.",
    defend: "Lock your screen when you step away, never plug in unknown USB devices, and use USB/HID allowlisting to block unapproved keyboards.",
  },
  debriefId: "badusb",
};

// ---- SD / files & mascot ----------------------------------------------

const sdBrowser: Demo = {
  frames: [
    { mood: "working", title: "Files", lines: ["microSD", "/"], ms: 1300 },
    { mood: "happy", title: "Files", lines: ["/captures", "/cards", "/scripts", "/portal-themes"], ms: 1800 },
  ],
  lesson: {
    what: "An on-screen file browser for the microSD card. Captured signals, saved cards, BadUSB scripts and portal themes all live here, and you can open them any time.",
    why: "It shows that everything the device records is saved as plain files you can manage, not locked away.",
    defend: "Nothing to defend. It's a convenience tool, and a reminder that captures are real files worth protecting.",
  },
};

const mascotDemo: Demo = {
  frames: [
    { mood: "waving", title: "Vemo", lines: ["Hi! I'm Vemo."], ms: 1400 },
    { mood: "happy", title: "Vemo", lines: ["I react to every", "demo result."], ms: 1400 },
    { mood: "thinking", title: "Vemo", lines: ["Thinking..."], ms: 1100 },
    { mood: "success", title: "Vemo", lines: ["Success!"], ms: 1100 },
    { mood: "sad", title: "Vemo", lines: ["...or fail."], ms: 1100 },
    { mood: "sleeping", title: "Vemo", lines: ["zzz"], ms: 1500 },
  ],
  lesson: {
    what: "Vemo is the device's mascot. Every screen sets a mood, and results flip Vemo to happy, sad, or alert.",
    why: "The mood makes an abstract idea (a signal was found, an attack started) instantly readable, even for a non-technical audience.",
    defend: "Vemo's job is to make security feel friendly, not scary. That's the whole point of VariOne.",
  },
};

// ---- The menu tree (mirrors the firmware) ------------------------------

export const MENU: MenuNode[] = [
  {
    id: "wifi", label: "Wi-Fi", blurb: "Scan networks and show how fake-network tricks work.",
    children: [
      { id: "wifi-scan", label: "AP Scan", blurb: "List nearby networks and signal strength.", demo: apScan },
      { id: "wifi-deauth", label: "Deauth", blurb: "Lab demo: knock a device off Wi-Fi.", demo: deauth },
      { id: "wifi-beacon", label: "BeaconSpam", blurb: "Flood the air with fake network names.", demo: beaconSpam },
      { id: "wifi-portal", label: "VariPortal", blurb: "Lab demo: fake network + login (evil twin).", demo: variPortal },
    ],
  },
  {
    id: "subghz", label: "Sub-GHz", blurb: "Record, replay and inspect 433 MHz remote signals.",
    children: [
      { id: "sg-capture", label: "Capture", blurb: "Record a remote / gate signal.", demo: sgCapture },
      { id: "sg-replay", label: "Replay", blurb: "Lab demo: play a saved signal back.", demo: sgReplay },
      { id: "sg-scan", label: "Frequency Scan", blurb: "Find which band a remote uses.", demo: sgScan },
      { id: "sg-jammer", label: "RF Jammer", blurb: "Lab demo: flood a frequency with noise.", demo: sgJammer },
      { id: "sg-keyfob", label: "Key Fob Inspect", blurb: "Is a fob fixed-code or rolling-code?", demo: sgKeyFob },
      { id: "sg-load", label: "Load Capture", blurb: "Open a saved RF signal from the SD card.", demo: sgLoad },
    ],
  },
  {
    id: "nfc", label: "NFC", blurb: "Read contactless cards and access badges.",
    children: [
      { id: "nfc-bank", label: "EMV Reader", blurb: "Read a tapped bank card (number masked).", demo: nfcBank },
      { id: "nfc-access", label: "Access Card", blurb: "Read, save and replay a building badge.", demo: nfcAccess },
      { id: "nfc-saved", label: "Saved Cards", blurb: "Cards you've read before.", demo: nfcSaved },
    ],
  },
  {
    id: "ir", label: "IR", blurb: "Clone and replay TV / AC remotes.",
    children: [
      { id: "ir-clone", label: "Custom Remote Clone", blurb: "Learn a remote button by button.", demo: irClone },
      { id: "ir-tvbgone", label: "TV-B-Gone", blurb: "Blast power-off codes at nearby TVs.", status: "planned", demo: irTvBGone },
    ],
  },
  {
    id: "nrf", label: "nRF24", blurb: "Watch and disrupt the whole 2.4 GHz band.",
    children: [
      { id: "nrf-scan", label: "2.4GHz Analyzer", blurb: "Map everything transmitting on 2.4 GHz.", demo: nrfAnalyzer },
      { id: "nrf-jammer", label: "nRF Jammer", blurb: "Lab demo: jam Bluetooth + 2.4 GHz Wi-Fi.", demo: nrfJammer },
    ],
  },
  {
    id: "badusb", label: "BadUSB", blurb: "Act as a USB keyboard and type a payload by itself.", demo: badusb,
  },
  {
    id: "files", label: "SD / Files", blurb: "Browse captures, cards, scripts and themes.", demo: sdBrowser,
  },
  {
    id: "mascot", label: "Mascot", blurb: "Meet Vemo and see the mood set.", demo: mascotDemo,
  },
];
