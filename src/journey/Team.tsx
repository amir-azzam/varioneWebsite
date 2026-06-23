// Meet-the-team section — closes the journey. Sits at the bottom of the page and
// is revealed as the video reaches its end (or on scroll). Supervisor on top,
// then the eight-member grid. Avatars are Vemo mascots in different moods.

import { Reveal } from "./Reveal";
import { Vemo } from "./Vemo";
import { TEAM, SUPERVISOR } from "./teamData";

export function Team() {
  return (
    <section className="section jv-team" id="team">
      <div className="wrap">
        <Reveal className="center jv-team-intro">
          <span className="eyebrow">The people behind it</span>
          <h2>Meet the team</h2>
          <p className="lead" style={{ margin: "0 auto" }}>
            Eight students at CIC New Cairo who broke a lot of radios, fixed most of
            them, and built VariOne — under the guidance of our supervisor.
          </p>
        </Reveal>

        <Reveal className="jv-supervisor card">
          <Vemo mood={SUPERVISOR.mood} size={92} />
          <div>
            <span className="tag">Supervisor</span>
            <h3 className="jv-member-name">{SUPERVISOR.name}</h3>
            <p className="muted jv-member-role">{SUPERVISOR.role}</p>
          </div>
        </Reveal>

        <div className="jv-team-grid">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} as="article" className="jv-member card" style={{ transitionDelay: `${i * 40}ms` }}>
              <Vemo mood={m.mood} size={84} />
              <h3 className="jv-member-name">{m.name}</h3>
              <p className="muted jv-member-role">{m.role}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="center jv-team-foot">
          <p className="muted" style={{ maxWidth: "52ch", margin: "0 auto 22px" }}>
            A graduation project at CIC New Cairo. Cute outside, powerful inside.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
