// Hero: the rendered Vemo-face animation as a looping background, with the logo,
// tagline, and the two calls to action over it.

import "./hero.css";

export function Hero() {
  return (
    <section className="hero" id="top">
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        poster="assets/hero-poster.jpg"
      >
        <source src="assets/hero-vemo-new-1080p.mp4" type="video/mp4" />
      </video>
      <div className="hero-veil" />
      <div className="hero-grain" />

      <div className="hero-inner">
        <img className="hero-logo" src="assets/logo.png" alt="VariOne" />
        <p className="hero-tagline">One Device, Endless Signals</p>
        <p className="hero-sub">A friendly handheld that makes invisible wireless signals visible, so anyone can learn how they work and why they matter.</p>
        <div className="hero-actions">
          <a href="#simulator" className="btn btn--primary">▶ Try the device</a>
          <a href="#meet" className="btn btn--ghost">Meet VariOne</a>
        </div>
      </div>

      <a href="#meet" className="hero-scroll" aria-label="Scroll down">
        <span /> scroll
      </a>
    </section>
  );
}
