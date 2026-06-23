// Contact form, shown as a modal over a dimmed + blurred page. Collects name,
// phone, email and why the person wants VariOne. The site is static (no backend),
// so submissions are delivered by Web3Forms (free email-forwarding service) to the
// team inbox. No data is stored anywhere else.

import { useEffect, useRef, useState } from "react";
import "./contact.css";

// Where the contact message is delivered.
const TEAM_EMAIL = "yssfallam@gmail.com";

// Free Web3Forms access key tied to TEAM_EMAIL. Get it at https://web3forms.com
// (enter the email, it's emailed to you), then paste it here. Until then the form
// shows a friendly notice instead of sending.
const WEB3FORMS_KEY = "04a2babc-786a-4889-bd02-c2ec0ffac823";

// Anti-spam: per-browser rate limit. A visitor can send at most MAX_PER_DAY
// messages in a rolling 24h window, and must wait COOLDOWN_MS between sends.
// (Web3Forms also rate-limits server-side; this stops casual flooding up front.)
const MAX_PER_DAY = 4;
const COOLDOWN_MS = 60_000; // 1 minute between sends
const DAY_MS = 24 * 60 * 60 * 1000;
const RL_KEY = "vo_contact_sends";

// Read the visitor's recent send timestamps from this browser, dropping any
// older than 24h. Returns [] if storage is unavailable.
function recentSends(): number[] {
  try {
    const raw = localStorage.getItem(RL_KEY);
    const now = Date.now();
    const list: number[] = raw ? JSON.parse(raw) : [];
    return list.filter((t) => now - t < DAY_MS);
  } catch {
    return [];
  }
}

function recordSend() {
  try {
    const list = recentSends();
    list.push(Date.now());
    localStorage.setItem(RL_KEY, JSON.stringify(list));
  } catch {
    /* storage blocked - fall back to no client-side limit */
  }
}

// Field length caps so nobody can paste a wall of text into your inbox.
const CAP = { name: 80, phone: 25, email: 120, why: 1000 };

// What the visitor is reaching out for. Drives the form copy and the email subject
// so the team can triage device orders vs. consultation requests at a glance.
type Purpose = "buy" | "consult";

export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [why, setWhy] = useState("");
  const [trap, setTrap] = useState(""); // honeypot - stays empty for real users
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const firstField = useRef<HTMLInputElement | null>(null);

  // Close on Escape, lock page scroll while open, focus the first field.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstField.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot: bots fill every field. A real (hidden) field that has text
    // means a bot - pretend it worked, but send nothing.
    if (trap) { setSent(true); return; }

    // Rate limit: enforce a cooldown and a daily cap per browser.
    const sends = recentSends();
    const last = sends.length ? Math.max(...sends) : 0;
    if (Date.now() - last < COOLDOWN_MS) {
      setError("You just sent a message. Please wait a moment before sending another.");
      return;
    }
    if (sends.length >= MAX_PER_DAY) {
      setError(`You've reached the limit for today. Please email us directly at ${TEAM_EMAIL}.`);
      return;
    }

    setBusy(true);
    try {
      // Web3Forms emails each field to the team inbox, in this order.
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: purpose === "consult"
            ? "New consultation request"
            : "New device enquiry",
          from_name: "VariOne website",
          botcheck: false, // Web3Forms' own honeypot flag
          Purpose: purpose === "consult"
            ? "Consultation (in-house testing / training)"
            : "Buy a device",
          Name: name.trim(),
          Email: email.trim(),
          Phone: phone.trim(),
          Details: why.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        recordSend();
        setSent(true);
      } else {
        setError(`Couldn't send right now. Please email us at ${TEAM_EMAIL}.`);
      }
    } catch {
      setError(`Couldn't send right now. Please email us at ${TEAM_EMAIL}.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Contact us">
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {sent ? (
          <div className="contact-done">
            <span className="tag">Thanks</span>
            <h3>Message sent</h3>
            <p className="muted">
              Thanks for your interest, we will be reaching out shortly.
            </p>
            <button className="btn btn--primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Contact us</span>
            <h3 className="contact-title">Get in touch</h3>
            <p className="muted contact-sub">
              First, what can we help you with?
            </p>

            {/* Purpose: device order vs. consultation. Sets the email subject so
                the team can triage at a glance. */}
            <div className="purpose-seg" role="radiogroup" aria-label="Reason for contacting us">
              <button
                type="button" role="radio" aria-checked={purpose === "buy"}
                className={`purpose-opt ${purpose === "buy" ? "is-active" : ""}`}
                onClick={() => setPurpose("buy")}
              >
                <span className="purpose-opt-t">Buy a device</span>
                <span className="purpose-opt-d">Order a VariOne unit</span>
              </button>
              <button
                type="button" role="radio" aria-checked={purpose === "consult"}
                className={`purpose-opt ${purpose === "consult" ? "is-active" : ""}`}
                onClick={() => setPurpose("consult")}
              >
                <span className="purpose-opt-t">Consultation</span>
                <span className="purpose-opt-d">In-house testing or training</span>
              </button>
            </div>

            <p className="purpose-note">
              {purpose === "consult" ? (
                <>
                  <strong>Consultation</strong> is for having us come in-house to run our
                  security testing, or training if you're an educational entity. Priced
                  per quote where needed - tell us your scope below.
                </>
              ) : (
                <>
                  <strong>Buying a device</strong> gets you your own VariOne unit. Tell us
                  your purpose below so we can set you up with the right configuration, if
                  you're the right fit.
                </>
              )}
            </p>

            <form className="contact-form" onSubmit={submit}>
              {/* Honeypot: hidden from people, irresistible to bots. */}
              <input
                className="hp-field" type="text" tabIndex={-1} autoComplete="off"
                aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)}
                name="company"
              />

              <label className="field">
                <span>Name</span>
                <input ref={firstField} value={name} onChange={(e) => setName(e.target.value)}
                  type="text" required maxLength={CAP.name} placeholder="Your name" autoComplete="name" />
              </label>

              <label className="field">
                <span>Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  type="tel" required maxLength={CAP.phone} pattern="[0-9+()\s-]{6,}"
                  title="Enter a valid phone number" placeholder="01x xxxx xxxx" autoComplete="tel" />
              </label>

              <label className="field">
                <span>Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" required maxLength={CAP.email} placeholder="you@email.com" autoComplete="email" />
              </label>

              <label className="field">
                <span>{purpose === "consult" ? "What do you need?" : "Why do you want VariOne?"}</span>
                <textarea value={why} onChange={(e) => setWhy(e.target.value)}
                  required maxLength={CAP.why} rows={4}
                  placeholder={purpose === "consult"
                    ? "In-house testing, training for a class or lab, scope and timeline..."
                    : "Tell us what you'd use it for"} />
              </label>

              <button className="btn btn--primary contact-submit" type="submit" disabled={busy}>
                {busy ? "Sending..." : "Send message"}
              </button>
              {error && <p className="contact-error">{error}</p>}
              <p className="muted contact-note">We only use your details to reply. Nothing is shared.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
