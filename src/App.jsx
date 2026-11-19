// =====================================================================
//  App.jsx — terminal CV. Content lives in src/data.js; edit that.
// =====================================================================
import { useEffect, useRef, useState, useCallback } from "react";
import {
  profile,
  links,
  stats,
  bootLines,
  certifications,
  projects,
  ctfs,
  skills,
  terminalConfig,
} from "./data.js";

/* =====================  utilities  ================================ */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (prefersReduced()) return setInView(true);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setInView(true), obs.disconnect()),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Types `text` character by character once `active` is true. */
function useTyped(text, active, speed = 34) {
  const [out, setOut] = useState(active && prefersReduced() ? text : "");
  const [done, setDone] = useState(prefersReduced());
  useEffect(() => {
    if (!active) return;
    if (prefersReduced()) {
      setOut(text);
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);
  return [out, done];
}

/* crypto helpers (PDF CTF) */
async function sha256hex(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function decryptReward(flag, b64) {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const data = raw.slice(12);
  const keyBytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(flag),
  );
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "decrypt",
  ]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plain);
}

/* Netlify Forms — records verified solvers, no backend needed */
function recordSolver(name) {
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ "form-name": "ctf-solvers", name }).toString(),
  });
}

const PROMPT = `${profile.handle}@${profile.host}:~$`;

/* =====================  boot sequence  ============================ */

function Boot({ onDone }) {
  const [lines, setLines] = useState([]);
  const [showWhoami, setShowWhoami] = useState(false);
  const [typedCmd, cmdDone] = useTyped("whoami", showWhoami, 90);

  useEffect(() => {
    if (prefersReduced()) return onDone();
    let t = 0;
    const timers = bootLines.map((l) => {
      t += l.d;
      return setTimeout(() => setLines((p) => [...p, l.text]), t);
    });
    timers.push(setTimeout(() => setShowWhoami(true), t + 250));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cmdDone) {
      const id = setTimeout(onDone, 350);
      return () => clearTimeout(id);
    }
  }, [cmdDone, onDone]);

  return (
    <div className="boot" onClick={onDone}>
      {lines.map((l, i) => (
        <div key={i} className="boot-line">
          {l || "\u00A0"}
        </div>
      ))}
      {showWhoami && (
        <div className="boot-line">
          <span className="prompt">{PROMPT}</span> {typedCmd}
          <span className="caret" />
        </div>
      )}
      <button className="skip" onClick={onDone}>
        [ skip ]
      </button>
    </div>
  );
}

/* =====================  shared pieces  ============================ */

/** Section header: a typed command with glitch-on-hover. */
function CmdHeader({ cmd, id }) {
  const [ref, inView] = useInView(0.4);
  const [typed, done] = useTyped(cmd, inView);
  return (
    <h2 className="cmd" id={id} ref={ref}>
      <span className="prompt">{PROMPT}</span>{" "}
      <span className="glitch" data-text={cmd}>
        {done ? cmd : typed}
      </span>
      {!done && inView && <span className="caret" />}
    </h2>
  );
}

function ExternalLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`tlink ${className}`}
    >
      {children}
    </a>
  );
}

/* =====================  sections  ================================= */

function Whoami() {
  const contact = [
    links.github && { label: "github", href: links.github },
    links.linkedin && { label: "linkedin", href: links.linkedin },
    links.tryhackme && { label: "tryhackme", href: links.tryhackme },
    links.email && { label: "email", href: links.email },
  ].filter(Boolean);

  return (
    <section className="hero-sec">
      <div className="cmd">
        <span className="prompt">{PROMPT}</span> whoami
      </div>
      {/* Top-left priority block: name → role → proof → contact */}
      <h1 className="name rise">{profile.name}</h1>
      <p className="tagline rise" style={{ animationDelay: "0.1s" }}>
        {profile.tagline} <span className="dim">// {profile.location}</span>
      </p>
      <div className="statline rise" style={{ animationDelay: "0.2s" }}>
        {stats.map((s, i) => (
          <span key={s.label}>
            {i > 0 && <span className="dim"> · </span>}
            <span className="stat-v">{s.value}</span>{" "}
            <span className="dim">{s.label}</span>
          </span>
        ))}
      </div>
      <div className="hero-links rise" style={{ animationDelay: "0.3s" }}>
        {contact.map((c) => (
          <ExternalLink key={c.label} href={c.href} className="btn">
            {c.label}
          </ExternalLink>
        ))}
      </div>
      <p className="summary rise" style={{ animationDelay: "0.4s" }}>
        {profile.summary}
      </p>
      <p className="hint rise" style={{ animationDelay: "0.5s" }}>
        tip: there's a live terminal at the bottom — try <code>help</code>
      </p>
    </section>
  );
}

function Projects() {
  return (
    <section>
      <CmdHeader cmd="ls -la ./projects" id="projects" />
      <div className="grid2">
        {projects.map((p, i) => (
          <Reveal as="article" className="card" delay={i * 80} key={p.id}>
            <div className="card-top">
              <span className="perm dim">drwxr-xr-x</span>
              <span className="fname">{p.id}/</span>
            </div>
            <h3>{p.title}</h3>
            <p className="dim">{p.description}</p>
            <div className="card-foot">
              <span className="tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </span>
              {p.href && <ExternalLink href={p.href}>source ↗</ExternalLink>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section>
      <CmdHeader cmd="cat certifications.txt" id="certs" />
      {certifications.map((c, i) => (
        <Reveal
          as="article"
          className="card certcard"
          delay={i * 80}
          key={c.id}
        >
          <div className="card-top">
            <span className="ok">[VERIFIED]</span>
            <span className="dim">{c.date}</span>
          </div>
          <h3>{c.title}</h3>
          <p className="dim">
            Issued by {c.issuer}. {c.note}
          </p>
          {c.href && (
            <ExternalLink href={c.href} className="btn btn-ok">
              verify credential ↗
            </ExternalLink>
          )}
        </Reveal>
      ))}
    </section>
  );
}

function CtfRecord() {
  return (
    <section>
      <CmdHeader cmd="./ctf_history --all" id="ctf" />
      <div className="log">
        {ctfs.map((c, i) => (
          <Reveal className="log-row" delay={i * 100} key={c.id}>
            <div className="log-head">
              <span className="dim">[{c.date}]</span>{" "}
              <span className="fname">{c.event}</span>
              <span className="dim"> — {c.host}</span>
              {c.result && <span className="badge">{c.result}</span>}
            </div>
            <ul className="log-items">
              {c.highlights.map((h) => (
                <li key={h}>
                  <span className="ok">✓</span> {h}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Package-install style progress bar, fills when scrolled into view. */
function SkillBar({ name, level, delay }) {
  const [ref, inView] = useInView(0.4);
  const [pct, setPct] = useState(prefersReduced() ? level : 0);
  useEffect(() => {
    if (!inView || prefersReduced()) return;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - t0 - delay) / 900, 1);
      if (p > 0) setPct(Math.round((1 - Math.pow(1 - p, 3)) * level));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, level, delay]);
  const blocks = 20;
  const filled = Math.round((pct / 100) * blocks);
  return (
    <div className="skill" ref={ref}>
      <span className="skill-name">{name}</span>
      <span className="bar" aria-hidden="true">
        {"█".repeat(filled)}
        <span className="dim">{"░".repeat(blocks - filled)}</span>
      </span>
      <span className="pct">{pct}%</span>
    </div>
  );
}

function Skills() {
  return (
    <section>
      <CmdHeader cmd="apt install abiral-skills" id="skills" />
      <div className="grid3">
        {skills.map((g, gi) => (
          <Reveal className="card" delay={gi * 80} key={g.area}>
            <h3 className="skill-area">{g.area}</h3>
            {g.items.map((s, si) => (
              <SkillBar
                key={s.name}
                name={s.name}
                level={s.level}
                delay={si * 120}
              />
            ))}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =====================  interactive terminal  ===================== */

function Terminal() {
  const [history, setHistory] = useState([
    { t: "out", s: "interactive shell — type `help` to see commands" },
  ]);
  const [input, setInput] = useState("");
  const [flags, setFlags] = useState(0);
  const [awaitingName, setAwaitingName] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [history]);

  const print = (lines) =>
    setHistory((h) => [
      ...h,
      ...(Array.isArray(lines) ? lines : [lines]).map((s) => ({ t: "out", s })),
    ]);

  const run = async (raw) => {
    const cmdLine = raw.trim();
    setHistory((h) => [...h, { t: "cmd", s: cmdLine }]);
    if (!cmdLine) return;

    // solver name capture after a correct PDF-CTF submit
    if (awaitingName) {
      setAwaitingName(false);
      const name = cmdLine.slice(0, 60);
      try {
        await recordSolver(name);
        print([
          `Recorded. Welcome to the hall of fame queue, ${name}.`,
          "Abiral verifies solvers manually — check back soon.",
        ]);
      } catch {
        print(
          "Couldn't reach the recorder — screenshot this and message Abiral on LinkedIn.",
        );
      }
      return;
    }

    const [cmd, ...rest] = cmdLine.split(/\s+/);
    const arg = rest.join(" ");

    // flag submitted bare
    if (/^flag\{.+\}$/i.test(cmdLine)) return handleFlag(cmdLine);

    switch (cmd.toLowerCase()) {
      case "help":
        print([
          "help              this menu",
          "whoami            who is this guy",
          "ls projects       list repositories",
          "cat certs         certifications",
          "ctf               competition history",
          "contact           links & socials",
          "wget `challenge.pdf`  download the PDF CTF",
          "submit <flag>     submit a flag{...}",
          "hall of fame      PDF-CTF solvers",
          "sudo hire abiral  worth a shot",
          "clear             wipe the screen",
        ]);
        break;
      case "whoami":
        print([`${profile.name} — ${profile.tagline}`, profile.summary]);
        break;
      case "ls":
        print(projects.map((p) => `drwxr-xr-x  ${p.id}/  — ${p.title}`));
        break;
      case "cat":
        if (arg.includes("cert"))
          print(
            certifications.map(
              (c) => `[VERIFIED] ${c.title} — ${c.issuer}, ${c.date}`,
            ),
          );
        else print(`cat: ${arg || "?"}: No such file. Try \`cat certs\`.`);
        break;
      case "ctf":
        print(
          ctfs.map(
            (c) =>
              `[${c.date}] ${c.event} — ${c.host}${c.result ? ` — ${c.result}` : ""}`,
          ),
        );
        break;
      case "contact":
        print(
          Object.entries(links)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v.replace("mailto:", "")}`),
        );
        break;
      case "wget":
        if (arg === "challenge.pdf") {
          print([
            "Resolving cv... connected.",
            "Saving to: 'challenge.pdf'",
            "challenge.pdf saved [100%]",
          ]);
          const a = document.createElement("a");
          a.href = "/1996.pdf";
          a.download = "1996.pdf";
          a.click();
          print(["", "Solve it, then: submit flag{...}"]);
        } else
          print(`wget: ${arg || "?"}: not found. Try \`wget challenge.pdf\`.`);
        break;
      case "submit":
        if (!arg) print("usage: submit flag{...}");
        else await handleFlag(arg);
        break;
      case "hall":
        printHall();
        break;
      case "sudo":
        if (arg.toLowerCase().includes("hire"))
          print(terminalConfig.sudoHireResponse);
        else
          print(
            `${profile.handle} is not in the sudoers file. This incident will be reported.`,
          );
        break;
      case "clear":
        setHistory([]);
        break;
      case "rm":
        print("rm: permission denied. Nice try though.");
        break;
      case "exit":
        print("There is no escape. (Close the tab, that works.)");
        break;
      default:
        print(`${cmd}: command not found. Type \`help\`.`);
    }
  };

  const printHall = () => {
    const hof = terminalConfig.hallOfFame;
    if (!hof.length)
      return print([
        "HALL OF FAME",
        "────────────",
        "empty. the challenge awaits its first blood.",
      ]);
    print([
      "HALL OF FAME",
      "────────────",
      ...hof.map(
        (s, i) => `#${i + 1}  ${s.name}  (${s.date})  ${s.note || ""}`,
      ),
    ]);
  };

  const handleFlag = async (flag) => {
    // easy flag: base64 hidden in boot output & page source
    if (btoa(flag) === terminalConfig.easyFlagB64) {
      setFlags((f) => Math.max(f, 1));
      print(terminalConfig.easyFlagResponse);
      return;
    }
    // PDF CTF: verify against hash, decrypt reward with the flag itself
    const { enabled, flagSha256, encryptedReward } = terminalConfig.pdfCtf;
    if (!enabled) {
      print(
        "Incorrect — or the main challenge isn't armed yet. (If you found the easy one, decode harder.)",
      );
      return;
    }
    const hash = await sha256hex(flag);
    if (hash !== flagSha256) {
      print("Incorrect flag. The PDF does not give up its secrets easily.");
      return;
    }
    setFlags(2);
    let reward = "";
    try {
      reward = await decryptReward(flag, encryptedReward);
    } catch {
      reward =
        "(reward decryption failed — tell Abiral his ciphertext is broken)";
    }
    print([
      "██  CORRECT — CHALLENGE SOLVED  ██",
      "",
      ...reward.split("\n"),
      "",
      "Enter your name/handle for the hall of fame:",
    ]);
    setAwaitingName(true);
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      const v = input;
      setInput("");
      run(v);
    }
  };

  return (
    <section className="term-sec" id="terminal">
      <CmdHeader cmd="bash --interactive" id="term-head" />
      <div className="term" onClick={() => inputRef.current?.focus()}>
        <div className="term-bar">
          <span className="tl red" />
          <span className="tl yellow" />
          <span className="tl green" />
          <span className="term-title">
            {profile.handle}@{profile.host}: ~
          </span>
          <span className="term-flags">
            {flags > 0 && `⚑ ${flags}/2 flags`}
          </span>
        </div>
        <div className="term-body">
          {history.map((h, i) =>
            h.t === "cmd" ? (
              <div key={i}>
                <span className="prompt">{PROMPT}</span> {h.s}
              </div>
            ) : (
              <div key={i} className="term-out">
                {h.s || "\u00A0"}
              </div>
            ),
          )}
          <div className="term-input-row">
            <span className="prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label="terminal input"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>
    </section>
  );
}

/* =====================  status bar  =============================== */

function StatusBar() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="statusbar">
      <span className="sb-seg sb-green">
        [0] {profile.handle}@{profile.host}
      </span>
      <span className="sb-seg">{stats[0].value} thm rooms</span>
      <span className="sb-seg hide-m">{profile.tagline.toLowerCase()}</span>
      <span className="sb-fill" />
      <span className="sb-seg">{time}</span>
      <span className="sb-seg sb-online">
        <span className="dot" /> {profile.status}
      </span>
    </div>
  );
}

/* =====================  app  ====================================== */

export default function App() {
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem("booted") === "1",
  );
  const finishBoot = useCallback(() => {
    sessionStorage.setItem("booted", "1");
    setBooted(true);
  }, []);

  return (
    <>
      <div className="crt" aria-hidden="true" />
      {!booted ? (
        <Boot onDone={finishBoot} />
      ) : (
        <>
          <main className="page">
            <Whoami />
            <Projects />
            <Certifications />
            <CtfRecord />
            <Skills />
            <Terminal />
          </main>
          <StatusBar />
        </>
      )}
    </>
  );
}
