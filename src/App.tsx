import { useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { MeetVariOne } from "./components/MeetVariOne";
import { Simulator } from "./components/Simulator";
import { ScrollBar } from "./components/ScrollBar";
import { ContactModal } from "./components/ContactModal";
import { DebriefModal } from "./components/DebriefModal";
import { DEBRIEF_ORDER } from "./device/content";
import "./App.css";

// The physical VariOne serves its own control panel on the local network at
// http://varione.local — link straight to it from the nav.
const DEVICE_WEBUI = "http://varione.local";

function Nav({ onContact }: { onContact: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-brand" onClick={close} aria-label="VariOne home">
          <img src="assets/logo.png" alt="VariOne" />
        </a>

        <button
          className="nav-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <nav className="nav-menu">
          <a href="#meet" className="nav-link" onClick={close}>Device</a>
          <a href="/journey/" className="nav-link" onClick={close}>The Journey</a>
          <a href={DEVICE_WEBUI} className="nav-link" target="_blank" rel="noreferrer" onClick={close}>
            Real device
          </a>
          <button className="nav-link nav-link--btn" onClick={() => { close(); onContact(); }}>
            Contact us
          </button>
          <a href="#simulator" className="nav-link nav-link--cta" onClick={close}>Try the device</a>
        </nav>
      </div>
    </header>
  );
}

function SimulatorSection({
  onOpenAcademy, onOpenDebrief,
}: {
  onOpenAcademy: () => void;
  onOpenDebrief: (id?: string) => void;
}) {
  return (
    <section className="section sim-section" id="simulator">
      <div className="wrap">
        <div className="center reveal">
          <span className="eyebrow">Try it yourself</span>
          <h2>Use the device, no hardware needed</h2>
          <p className="lead" style={{ margin: "0 auto 36px" }}>
            This is a working virtual VariOne with the real menus. Press the buttons,
            run a demo, and Vemo reacts just like the real screen. Every result comes
            with a plain explanation of what happened and how to stay safer.
          </p>
        </div>
        <div className="reveal">
          <Simulator onOpenAcademy={onOpenAcademy} onOpenDebrief={onOpenDebrief} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer-inner">
        <div>
          <img className="footer-logo" src="assets/logo.png" alt="VariOne" />
          <p className="muted" style={{ marginTop: 12, maxWidth: "46ch" }}>
            A graduation project at CIC New Cairo, supervised by Dr. Ahmed Gaber.
            A friendly cyber-awareness device that makes invisible signals visible.
          </p>
          <div className="footer-ghs">
            <a className="footer-gh" href="https://github.com/Ahmed-Ahmed16/variOne-2" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source code for device
            </a>
            <a className="footer-gh" href="https://github.com/amir-azzam/varioneWebsite" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source code for website
            </a>
          </div>
        </div>
        <p className="muted footer-tag">Cute outside. Powerful inside.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [debriefId, setDebriefId] = useState(DEBRIEF_ORDER[0]);

  const openDebrief = (id?: string) => {
    if (id) setDebriefId(id);
    setDebriefOpen(true);
  };
  // Vemo's Academy is Ahmed's companion app, served as a static sub-app at /vemo/.
  // Absolute path so it always lands at the site root (never compounds).
  const openAcademy = () => { window.location.href = "/vemo/"; };

  // reveal-on-scroll
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <ScrollBar />
      <Nav onContact={() => setContactOpen(true)} />
      <main>
        <Hero />
        <MeetVariOne />
        <SimulatorSection onOpenAcademy={openAcademy} onOpenDebrief={openDebrief} />
      </main>
      <Footer />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <DebriefModal
        open={debriefOpen}
        activeId={debriefId}
        onSelect={setDebriefId}
        onClose={() => setDebriefOpen(false)}
      />
    </>
  );
}
