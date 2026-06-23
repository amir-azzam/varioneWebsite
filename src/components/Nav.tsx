import { useEffect, useState } from "react";
import "./nav.css";

// The physical VariOne serves its own control panel on the local network at
// http://varione.local - link straight to it from the nav.
const DEVICE_WEBUI = "http://varione.local";

// Shared site nav - used on the home page and the journey page. Section links are
// absolute (/#meet, /#simulator) so they work from /journey/ too, jumping back to
// the home page and scrolling to the section. `current` marks which page we're on
// so its own link is hidden (you don't link to the page you're already on).
type Page = "home" | "journey" | "academy";

export function Nav({ onContact, current = "home" }: { onContact: () => void; current?: Page }) {
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
        <a href="/" className="nav-brand" onClick={close} aria-label="VariOne home">
          <img src="/assets/logo.png" alt="VariOne" />
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
          <a href="/#meet" className="nav-link" onClick={close}>Device</a>
          {current !== "journey" && (
            <a href="/journey/" className="nav-link" onClick={close}>The Journey</a>
          )}
          {current !== "academy" && (
            <a href="/vemo/" className="nav-link" onClick={close}>Academy</a>
          )}
          <a href={DEVICE_WEBUI} className="nav-link" target="_blank" rel="noreferrer" onClick={close}>
            Real device
          </a>
          <button className="nav-link nav-link--btn" onClick={() => { close(); onContact(); }}>
            Contact us
          </button>
          <a href="/#simulator" className="nav-link nav-link--cta" onClick={close}>Try the device</a>
        </nav>
      </div>
    </header>
  );
}
