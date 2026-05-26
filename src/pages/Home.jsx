import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ── Google Fonts ── */
if (!document.getElementById("gf")) {
  const l = document.createElement("link");
  l.id = "gf"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700;900&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(l);
}

/* ── Keyframes ── */
if (!document.getElementById("hk")) {
  const s = document.createElement("style");
  s.id = "hk";
  s.textContent = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
    @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
    @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
    @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
    @keyframes shimmerBW{0%{background-position:-400% 0;}100%{background-position:400% 0;}}
    @keyframes spinR{from{transform:translate(-50%,-50%) rotate(0);}to{transform:translate(-50%,-50%) rotate(360deg);}}
    @keyframes spinL{from{transform:translate(-50%,-50%) rotate(0);}to{transform:translate(-50%,-50%) rotate(-360deg);}}

    .font-playfair{font-family:'Playfair Display',Georgia,serif;}
    .font-inter{font-family:'Inter',system-ui,sans-serif;}
    .font-mono{font-family:'JetBrains Mono',monospace;}

    .au0{animation:fadeUp .6s .05s both cubic-bezier(.22,1,.36,1);}
    .au1{animation:fadeUp .6s .15s both cubic-bezier(.22,1,.36,1);}
    .au2{animation:fadeUp .6s .28s both cubic-bezier(.22,1,.36,1);}
    .au3{animation:fadeUp .6s .40s both cubic-bezier(.22,1,.36,1);}
    .au4{animation:fadeUp .6s .52s both cubic-bezier(.22,1,.36,1);}

    .float-card{animation:floatY 6s ease-in-out infinite;}

    .marquee-inner{animation:marquee 32s linear infinite;display:flex;gap:8px;width:max-content;}
    .marquee-inner:hover{animation-play-state:paused;}

    .cursor-bw{display:inline-block;width:1.5px;height:.82em;background:rgba(255,255,255,.5);vertical-align:middle;margin-left:2px;animation:blink .8s step-end infinite;}

    .skel-bw{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:400% 100%;animation:shimmerBW 2s linear infinite;}

    .panel-hover{transition:border-color .25s,box-shadow .25s,transform .25s;}
    .panel-hover:hover{border-color:rgba(255,255,255,.14)!important;box-shadow:0 24px 60px rgba(0,0,0,.8);transform:translateY(-4px);}

    .btn-primary{background:#fff;color:#000;transition:background .2s,transform .15s,box-shadow .2s;}
    .btn-primary:hover{background:#e8e8e8;transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,255,255,.12);}
    .btn-primary:active{transform:none;box-shadow:none;}

    .btn-ghost-bw{border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.35);transition:border-color .2s,color .2s,transform .15s;}
    .btn-ghost-bw:hover{border-color:rgba(255,255,255,.25);color:rgba(255,255,255,.75);transform:translateY(-1px);}

    .ring-r{position:absolute;top:50%;left:50%;border-radius:50%;animation:spinR 30s linear infinite;}
    .ring-l{position:absolute;top:50%;left:50%;border-radius:50%;animation:spinL 20s linear infinite;}

    .stat-cell-bw{background:#0a0a0a;transition:background .2s;}
    .stat-cell-bw:hover{background:#0e0e0e;}

    .feature-card{transition:border-color .25s,transform .3s;}
    .feature-card:hover{border-color:rgba(255,255,255,.12)!important;transform:translateY(-5px);}
    .feature-card:hover .fnum{opacity:.07!important;}
    .feature-card:hover .ficon{border-color:rgba(255,255,255,.2)!important;color:#fff!important;}
  `;
  document.head.appendChild(s);
}

/* ── Typewriter (unchanged logic) ── */
const PROMPTS = [
  "Explain quantum entanglement simply",
  "Debug this React useEffect memory leak",
  "Write a cold email for a VC pitch",
  "Compare REST vs GraphQL APIs",
  "Summarise the French Revolution",
  "What are SOLID principles in OOP?",
];
function useTypewriter(strs, speed = 50, pause = 2000) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState("type");
  const ch = useRef(0);
  useEffect(() => {
    let t;
    const s = strs[i];
    if (phase === "type") {
      if (ch.current < s.length) t = setTimeout(() => setText(s.slice(0, ++ch.current)), speed + Math.random() * 28);
      else t = setTimeout(() => setPhase("wait"), pause);
    } else if (phase === "wait") {
      t = setTimeout(() => setPhase("erase"), 200);
    } else {
      if (ch.current > 0) t = setTimeout(() => setText(s.slice(0, --ch.current)), speed * .4);
      else { setI(x => (x + 1) % strs.length); setPhase("type"); }
    }
    return () => clearTimeout(t);
  }, [text, phase, i]);
  return text;
}

/* ── Scroll reveal (unchanged logic) ── */
function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(24px)";
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.transition = `opacity .7s ${delay}s cubic-bezier(.22,1,.36,1),transform .7s ${delay}s cubic-bezier(.22,1,.36,1)`;
        el.style.opacity = "1"; el.style.transform = "translateY(0)";
        obs.unobserve(el);
      }
    }, { threshold: .1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}
function Reveal({ children, delay = 0, className = "" }) {
  const r = useRef(null);
  useReveal(r, delay);
  return <div ref={r} className={className}>{children}</div>;
}

/* ── Animated counter (unchanged logic) ── */
function Counter({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      const dur = 1300; let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        setV(Math.round((1 - (1 - p) ** 3) * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ── Data ── */
const MODELS = [
  { label: "GPT-4o",      dot: "#888" },
  { label: "Claude 3.5",  dot: "#aaa" },
  { label: "Gemini 1.5",  dot: "#777" },
  { label: "Llama 3.1",   dot: "#999" },
  { label: "Mistral",     dot: "#bbb" },
  { label: "Command R+",  dot: "#888" },
  { label: "GPT-4 Turbo", dot: "#aaa" },
  { label: "Grok-2",      dot: "#777" },
  { label: "Phi-3",       dot: "#999" },
];

const FEATURES = [
  {
    n: "01", title: "One prompt, two truths",
    body: "Both models receive the exact same input. Every difference is purely model behavior — not phrasing, not order.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  },
  {
    n: "02", title: "Real render fidelity",
    body: "Markdown, code blocks, bullet lists — rendered as each model intended. No plain-text washing.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    n: "03", title: "Zero-friction demo",
    body: "Ships with deterministic demo answers so you can evaluate UX before touching any API key.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    n: "04", title: "Bring your own keys",
    body: "Works with any provider that speaks the chat completions contract. Fully open.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
];

/* ── Section label shared style ── */
const SectionLabel = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
    <div style={{ width: 24, height: 1, background: "rgba(255,255,255,.25)" }} />
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9, letterSpacing: ".28em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.3)",
    }}>{text}</span>
  </div>
);

/* ════════════════════════════
   PAGE
════════════════════════════ */
export default function Home() {
  const typed = useTypewriter(PROMPTS);

  return (
    <div className="font-inter" style={{ background: "#0a0a0a", color: "#fff", overflowX: "hidden", minHeight: "100vh" }}>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* Radial vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,.03) 0%, transparent 65%)",
        }} />

        {/* Vertical rule */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "52%", width: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,.07) 30%, rgba(255,255,255,.07) 70%, transparent)",
        }} className="hidden lg:block" />

        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 1100,
          margin: "0 auto", padding: "112px 24px",
          display: "grid", gap: 64, alignItems: "center",
        }} className="lg:grid-cols-2">

          {/* LEFT */}
          <div>
            {/* Live badge */}
            <div className="au0" style={{
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32,
              padding: "7px 16px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.03)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: .6 }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase",
                color: "rgba(255,255,255,.45)",
              }}>AI Benchmark · Live</span>
            </div>

            {/* Headline */}
            <h1 className="au1 font-playfair" style={{
              fontSize: "clamp(4rem,9vw,8rem)",
              fontWeight: 700, lineHeight: .92,
              marginBottom: 32,
            }}>
              <span style={{ display: "block", color: "#fff" }}>Which AI</span>
              <span style={{
                display: "block",
                WebkitTextStroke: "1px rgba(255,255,255,.25)",
                color: "transparent",
              }}>Actually</span>
              <span style={{ display: "block", color: "#fff" }}>Wins?</span>
            </h1>

            {/* Typewriter */}
            <div className="au2" style={{
              marginBottom: 28, maxWidth: 480,
              borderLeft: "1px solid rgba(255,255,255,.2)",
              padding: "14px 18px",
              background: "rgba(255,255,255,.02)",
              borderRadius: "0 8px 8px 0",
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase",
                color: "rgba(255,255,255,.2)", marginBottom: 8,
              }}>prompt demo</p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13, color: "rgba(255,255,255,.65)",
              }}>{typed}</span>
              <span className="cursor-bw" />
            </div>

            {/* Sub */}
            <p className="au3" style={{
              fontSize: 15, color: "rgba(255,255,255,.35)",
              lineHeight: 1.85, maxWidth: 420, marginBottom: 36, fontWeight: 300,
            }}>
              Send one prompt to two AI models simultaneously. Read answers side-by-side — differences, blind spots, and strengths jump out instantly.
            </p>

            {/* CTAs */}
            <div className="au4" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              <Link to="/compare"
                className="btn-primary font-mono"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 28px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500,
                }}>
                Start Comparing
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#how" className="btn-ghost-bw"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase",
                }}>
                How it works
              </a>
            </div>

            {/* Trust pills */}
            <div className="au4" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["No login required", "Free demo mode", "10+ providers"].map(p => (
                <span key={p} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: ".06em",
                  padding: "5px 14px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.07)",
                  color: "rgba(255,255,255,.22)",
                  background: "rgba(255,255,255,.02)",
                }}>{p}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — mockup */}
          <div className="hidden lg:flex" style={{ alignItems: "center", justifyContent: "center" }}>
            <HeroMockup />
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: .2, pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(255,255,255,.5), transparent)" }} />
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,.06)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: "14px 0",
        background: "rgba(0,0,0,.4)",
      }}>
        {/* Fade edges */}
        {["left:0,right:auto", "right:0,left:auto"].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            [i === 0 ? "left" : "right"]: 0, width: 80,
            background: `linear-gradient(to ${i === 0 ? "right" : "left"}, #0a0a0a, transparent)`,
            zIndex: 1, pointerEvents: "none",
          }} />
        ))}
        <div className="marquee-inner">
          {[...MODELS, ...MODELS].map((m, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 999, flexShrink: 0,
              border: "1px solid rgba(255,255,255,.07)",
              background: "rgba(255,255,255,.01)",
              cursor: "default", userSelect: "none",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase",
                color: "rgba(255,255,255,.3)",
              }}>{m.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <Reveal className="max-w-[1100px] mx-auto px-6 lg:px-14 py-28">
        <SectionLabel text="By the numbers" />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1, background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.06)",
        }}>
          {[
            { to: 2,   s: "×",       label: "Models compared at once" },
            { to: 100, s: "%",       label: "Identical prompt delivery" },
            { to: 0,   s: " clicks", label: "To see the full demo" },
            { to: 10,  s: "+",       label: "Supported providers" },
          ].map(({ to, s, label }) => (
            <div key={label} className="stat-cell-bw" style={{ padding: "36px 32px" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 64, fontWeight: 700,
                color: "#fff", lineHeight: 1, marginBottom: 10,
              }}>
                <Counter to={to} suffix={s} />
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.28)", fontWeight: 300 }}>{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ══ FEATURES ══ */}
      <section id="how" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 96px" }}>
        <Reveal style={{ marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <SectionLabel text="How it works" />
              <h2 className="font-playfair" style={{ fontSize: "clamp(2.4rem,4.5vw,4.5rem)", fontWeight: 700, lineHeight: .95 }}>
                Engineered for<br />
                <span style={{ color: "rgba(255,255,255,.45)" }}>instant clarity</span>
              </h2>
            </div>
            <Link to="/compare" className="btn-primary font-mono"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 22px", borderRadius: 8, textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500, flexShrink: 0,
              }}>
              Try it now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 1, background: "rgba(255,255,255,.06)",
        }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.n} f={f} delay={i * 0.08} />)}
        </div>
      </section>

      {/* ══ SPLIT DEMO ══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.06)", background: "#0d0d0d" }}>
        <Reveal className="max-w-[1100px] mx-auto px-6 lg:px-14 py-28"
          style={{ display: "grid", gap: 64, alignItems: "center" }}
          className="lg:grid-cols-2 max-w-[1100px] mx-auto px-6 lg:px-14 py-28">
          <div>
            <SectionLabel text="What you'll see" />
            <h2 className="font-playfair" style={{ fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 700, lineHeight: .95, marginBottom: 24 }}>
              Two columns.<br />
              <span style={{ color: "rgba(255,255,255,.4)" }}>One verdict.</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.32)", lineHeight: 1.85, fontWeight: 300, marginBottom: 32 }}>
              Each model's reply renders in its own panel — markdown, code, lists, all intact. Spot verbosity, missing context, or hallucinations at a glance.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Send one prompt to both models simultaneously",
                "Answers load into side-by-side scrollable panels",
                "Compare tone, depth, accuracy, and verbosity",
                "Spot hallucinations or missing context instantly",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 18, height: 18, flexShrink: 0, marginTop: 2,
                    border: "1px solid rgba(255,255,255,.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.42)", fontWeight: 300, lineHeight: 1.65 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <SplitPreview />
        </Reveal>
      </section>

      {/* ══ QUOTE ══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <Reveal className="max-w-[700px] mx-auto px-6 py-24" style={{ textAlign: "center" }}>
          <div className="font-playfair" style={{ fontSize: 72, color: "rgba(255,255,255,.06)", lineHeight: 1, marginBottom: 8, userSelect: "none" }}>"</div>
          <blockquote style={{
            fontSize: "clamp(1rem,1.8vw,1.3rem)",
            color: "rgba(255,255,255,.42)", lineHeight: 1.75,
            fontStyle: "italic", fontFamily: "'Playfair Display', serif", fontWeight: 400,
            marginBottom: 24,
          }}>
            The only way to truly know which model fits your workflow is to ask them the same question and read their answers in the same breath.
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: "rgba(255,255,255,.12)" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase",
              color: "rgba(255,255,255,.18)",
            }}>AI Search Bench · Philosophy</span>
            <div style={{ height: 1, width: 40, background: "rgba(255,255,255,.12)" }} />
          </div>
        </Reveal>
      </section>

      {/* ══ FINAL CTA ══ */}
      <Reveal>
        <section style={{ position: "relative", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,.06)", padding: "128px 24px", textAlign: "center" }}>
          {/* Rings */}
          <div className="ring-r" style={{ width: 640, height: 640, border: "1px solid rgba(255,255,255,.03)" }} />
          <div className="ring-l" style={{ width: 430, height: 430, border: "1px solid rgba(255,255,255,.045)" }} />
          <div className="ring-r" style={{ width: 270, height: 270, border: "1px solid rgba(255,255,255,.035)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <SectionLabel text="Ready to see for yourself?" />
            <h2 className="font-playfair" style={{
              fontSize: "clamp(3.5rem,8vw,7.5rem)",
              fontWeight: 700, lineHeight: .92,
              marginBottom: 24,
            }}>
              Stop guessing.<br />
              <span style={{ color: "rgba(255,255,255,.35)" }}>Start comparing.</span>
            </h2>
            <p style={{
              fontSize: 14, color: "rgba(255,255,255,.28)", maxWidth: 320,
              margin: "0 auto 40px", lineHeight: 1.8, fontWeight: 300,
            }}>
              No account. No API key. No nonsense. Just open the page and compare.
            </p>
            <Link to="/compare" className="btn-primary font-mono"
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "14px 36px", borderRadius: 8, textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500,
              }}>
              Open the compare tool
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: "rgba(255,255,255,.15)", marginTop: 20, letterSpacing: ".06em",
            }}>Free · Open source · No tracking</p>
          </div>
        </section>
      </Reveal>

      {/* ══ FOOTER ══ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,.06)",
        padding: "24px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        background: "#080808",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 14, height: 14, border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 5, height: 5, background: "#fff" }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".06em" }}>AI Search Bench</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Docs", "GitHub", "Privacy"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: "rgba(255,255,255,.18)", textDecoration: "none", letterSpacing: ".06em",
              transition: "color .2s",
            }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,.5)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.18)"}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,.12)", letterSpacing: ".05em" }}>
          © {new Date().getFullYear()} · Demo only
        </span>
      </footer>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ f, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(16px)";
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.transition = `opacity .6s ${delay}s ease, transform .6s ${delay}s cubic-bezier(.22,1,.36,1)`;
        el.style.opacity = "1"; el.style.transform = "translateY(0)";
        obs.unobserve(el);
      }
    }, { threshold: .08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="feature-card"
      style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.06)", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 28, height: 28, pointerEvents: "none",
        borderTop: "1px solid rgba(255,255,255,.1)", borderRight: "1px solid rgba(255,255,255,.1)",
      }} />

      <div className="fnum font-playfair" style={{
        fontSize: 52, fontWeight: 700, lineHeight: 1,
        color: "#fff", opacity: .04, marginBottom: 20, transition: "opacity .3s",
      }}>{f.n}</div>

      <div className="ficon" style={{
        width: 36, height: 36,
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, color: "rgba(255,255,255,.4)",
        transition: "border-color .25s, color .25s",
      }}>
        <f.Icon />
      </div>

      <h3 style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12.5, fontWeight: 500, color: "#fff", marginBottom: 12, lineHeight: 1.35,
      }}>{f.title}</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", lineHeight: 1.8, fontWeight: 300 }}>{f.body}</p>
    </div>
  );
}

/* ── 3D floating mockup ── */
function HeroMockup() {
  return (
    <div className="float-card" style={{
      width: "100%", maxWidth: 480,
      filter: "drop-shadow(0 48px 100px rgba(0,0,0,.95))",
    }}>
      <div style={{
        borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.1)",
        background: "#111",
      }}>
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "#0d0d0d",
        }}>
          {["#555", "#444", "#444"].map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, color: "rgba(255,255,255,.18)", letterSpacing: ".04em",
            }}>compare — AI Search Bench</span>
          </div>
        </div>

        {/* Prompt bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "rgba(255,255,255,.015)",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,.3)" }}>›_</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,.4)" }}>
            Explain quantum entanglement simply
          </span>
        </div>

        {/* Model headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          {[{ n: "GPT-4o" }, { n: "Claude 3.5" }].map(({ n }, i) => (
            <div key={n} style={{
              padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
              borderLeft: i === 1 ? "1px solid rgba(255,255,255,.06)" : "none",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.3)", flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,.28)", letterSpacing: ".1em" }}>{n}</span>
            </div>
          ))}
        </div>

        {/* Skeleton content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {[[88, 100, 70, 100, 52, 78, 40], [75, 100, 88, 52, 100, 62, 76]].map((lines, pi) => (
            <div key={pi} style={{
              padding: 16, minHeight: 150,
              borderLeft: pi === 1 ? "1px solid rgba(255,255,255,.06)" : "none",
            }}>
              {lines.map((w, i) => (
                <div key={i} className="skel-bw" style={{
                  height: 5, marginBottom: 8, borderRadius: 3, width: `${w}%`,
                  animationDelay: `${i * .14}s`,
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,.05)",
          padding: "10px 14px", display: "flex", gap: 8,
          background: "#0d0d0d",
        }}>
          <div style={{ flex: 1, height: 26, borderRadius: 6, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.03)" }} />
          <div style={{ width: 36, height: 26, borderRadius: 6, background: "#fff", opacity: .7, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Mini split preview ── */
function SplitPreview() {
  return (
    <div className="panel-hover" style={{
      borderRadius: 12, overflow: "hidden",
      border: "1px solid rgba(255,255,255,.08)",
      background: "#0d0d0d",
    }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8.5, letterSpacing: ".2em", textTransform: "uppercase",
          color: "rgba(255,255,255,.25)", marginBottom: 8,
        }}>Prompt</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 300 }}>What's the difference between ML and AI?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        {["GPT-4o", "Claude 3.5"].map((n, i) => (
          <div key={n} style={{
            padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
            borderLeft: i === 1 ? "1px solid rgba(255,255,255,.06)" : "none",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.3)", flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".1em" }}>{n}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[[100, 80, 65, 100, 50], [78, 100, 58, 90, 72, 44]].map((lines, i) => (
          <div key={i} style={{ padding: 16, borderLeft: i === 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
            {lines.map((w, j) => (
              <div key={j} style={{
                height: 6, borderRadius: 3, marginBottom: 8,
                width: `${w}%`,
                background: `rgba(255,255,255,${j % 2 === 0 ? ".07" : ".04"})`,
              }} />
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,.06)",
        padding: "10px 14px", display: "flex", gap: 8,
        background: "#0a0a0a",
      }}>
        <div style={{ flex: 1, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }} />
        <div style={{ width: 32, height: 28, borderRadius: 6, background: "#fff", opacity: .65, flexShrink: 0 }} />
      </div>
    </div>
  );
}