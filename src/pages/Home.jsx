import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ── Google Fonts ── */
if (!document.getElementById("gf")) {
  const l = document.createElement("link");
  l.id = "gf"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(l);
}

/* ── Keyframes only — Tailwind can't express these ── */
if (!document.getElementById("hk")) {
  const s = document.createElement("style");
  s.id = "hk";
  s.textContent = `
    @keyframes float3d{0%,100%{transform:perspective(1000px) rotateX(8deg) rotateY(-12deg) translateY(0);}50%{transform:perspective(1000px) rotateX(5deg) rotateY(-8deg) translateY(-14px);}}
    @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
    @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
    @keyframes blob1{0%,100%{border-radius:60% 40% 54% 46%/58% 46% 54% 42%;transform:translate(0,0);}50%{border-radius:42% 58% 38% 62%/50% 62% 38% 50%;transform:translate(16px,-12px);}}
    @keyframes blob2{0%,100%{border-radius:50% 50% 60% 40%/45% 55% 45% 55%;transform:translate(0,0);}50%{border-radius:65% 35% 50% 50%/60% 40% 60% 40%;transform:translate(-14px,10px);}}
    @keyframes spinR{from{transform:translate(-50%,-50%) rotate(0);}to{transform:translate(-50%,-50%) rotate(360deg);}}
    @keyframes spinL{from{transform:translate(-50%,-50%) rotate(0);}to{transform:translate(-50%,-50%) rotate(-360deg);}}
    @keyframes pulseRing{0%{transform:scale(1);opacity:.7;}100%{transform:scale(1.7);opacity:0;}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
    @keyframes scanLine{0%{top:-30%;}100%{top:130%;}}
    @keyframes shimmer{0%{background-position:-300% 0;}100%{background-position:300% 0;}}
    @keyframes gradMove{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}

    .bebas{font-family:'Bebas Neue',sans-serif;}
    .dm-sans{font-family:'DM Sans',sans-serif;}
    .dm-mono{font-family:'DM Mono',monospace;}

    .float-card{animation:float3d 7s ease-in-out infinite;}
    .blob-a{animation:blob1 14s ease-in-out infinite;filter:blur(80px);}
    .blob-b{animation:blob2 18s ease-in-out infinite;filter:blur(100px);}
    .marquee-inner{animation:marquee 30s linear infinite;display:flex;gap:10px;width:max-content;}
    .marquee-inner:hover{animation-play-state:paused;}
    .cursor{display:inline-block;width:2px;height:.85em;background:#a3ff4e;vertical-align:middle;margin-left:1px;animation:blink .75s step-end infinite;}
    .ring-r{position:absolute;top:50%;left:50%;border-radius:50%;animation:spinR 26s linear infinite;}
    .ring-l{position:absolute;top:50%;left:50%;border-radius:50%;animation:spinL 18s linear infinite;}
    .scan{position:absolute;left:0;right:0;height:28%;background:linear-gradient(to bottom,rgba(163,255,78,0.06),transparent);animation:scanLine 3.2s linear infinite;pointer-events:none;}
    .skel{background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.11) 50%,rgba(255,255,255,0.04) 75%);background-size:300% 100%;animation:shimmer 2s linear infinite;}
    .au0{animation:fadeSlideUp .65s .05s both cubic-bezier(.22,1,.36,1);}
    .au1{animation:fadeSlideUp .65s .18s both cubic-bezier(.22,1,.36,1);}
    .au2{animation:fadeSlideUp .65s .32s both cubic-bezier(.22,1,.36,1);}
    .au3{animation:fadeSlideUp .65s .46s both cubic-bezier(.22,1,.36,1);}
    .au4{animation:fadeSlideUp .65s .60s both cubic-bezier(.22,1,.36,1);}
    .pulse-ring{animation:pulseRing 2s ease-out infinite;}
    .fcard{transition:transform .35s cubic-bezier(.175,.885,.32,1.275),border-color .25s,box-shadow .3s;}
    .fcard:hover{transform:perspective(800px) translateZ(20px) translateY(-9px);border-color:rgba(163,255,78,0.28)!important;box-shadow:0 32px 72px rgba(0,0,0,.9),0 0 0 1px rgba(163,255,78,0.06);}
    .fcard:hover .fnum{color:rgba(163,255,78,0.13)!important;}
    .fcard:hover .ficon{border-color:rgba(163,255,78,0.35)!important;color:#a3ff4e!important;background:rgba(163,255,78,0.07)!important;}
    .btn-lime{transition:transform .15s,box-shadow .15s,background .15s;}
    .btn-lime:hover{transform:translateY(-3px);box-shadow:0 0 52px rgba(163,255,78,0.55),0 14px 36px rgba(0,0,0,.7);background:#b8ff5a;}
    .btn-lime:active{transform:none;box-shadow:none;}
    .btn-ghost{transition:transform .15s,border-color .2s,color .2s;}
    .btn-ghost:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.25)!important;color:rgba(255,255,255,.85)!important;}
    .stat-cell{background:#0a0a0b;transition:background .25s;}
    .stat-cell:hover{background:#0e0e10;}
    .grad-text{background:linear-gradient(135deg,#fff 20%,#a3ff4e 90%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .grad-lime{background:linear-gradient(135deg,#a3ff4e,#5eff8f,#a3ff4e);background-size:200% 200%;animation:gradMove 4s ease infinite;}
    .text-hollow{-webkit-text-stroke:1.5px rgba(255,255,255,0.28);color:transparent;}
    .text-extrude{text-shadow:2px 2px 0 #1c3a1c,4px 4px 0 #0f200f,6px 6px 18px rgba(0,160,0,.1);}
  `;
  document.head.appendChild(s);
}

/* ── Typewriter ── */
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

/* ── Scroll reveal ── */
function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(28px)";
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

/* ── Animated counter ── */
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
  { label: "GPT-4o",      dot: "#10a37f" },
  { label: "Claude 3.5",  dot: "#d4a76a" },
  { label: "Gemini 1.5",  dot: "#4285f4" },
  { label: "Llama 3.1",   dot: "#8b5cf6" },
  { label: "Mistral",     dot: "#f97316" },
  { label: "Command R+",  dot: "#ec4899" },
  { label: "GPT-4 Turbo", dot: "#10a37f" },
  { label: "Grok-2",      dot: "#22d3ee" },
  { label: "Phi-3",       dot: "#eab308" },
];

const FEATURES = [
  {
    n: "01", title: "One prompt, two truths",
    body: "Both models get the exact same input. Every difference is purely model behavior — not phrasing, not order.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  },
  {
    n: "02", title: "Real render fidelity",
    body: "Markdown, code blocks, bullet lists — rendered as each model intended. No plain-text washing.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    n: "03", title: "Zero-friction demo",
    body: "Ships with deterministic demo answers so you can evaluate UX before touching any API key.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    n: "04", title: "Bring your own keys",
    body: "Works with any provider that speaks the chat completions contract. Fully open.",
    Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
];

/* ════════════════════════════
   PAGE
════════════════════════════ */
export default function Home() {
  const typed = useTypewriter(PROMPTS);

  return (
    <div className="dm-sans bg-[#07080a] text-white overflow-x-hidden min-h-screen">

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

        {/* Ambient blobs */}
        <div className="blob-a absolute -top-24 -left-24 w-[620px] h-[620px] bg-[rgba(163,255,78,0.09)] pointer-events-none" />
        <div className="blob-b absolute -bottom-12 -right-12 w-[520px] h-[520px] bg-[rgba(56,189,248,0.06)] pointer-events-none" />

        {/* Vertical divider */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-[52%] w-px bg-gradient-to-b from-transparent via-[rgba(163,255,78,0.1)] to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 lg:px-14 grid lg:grid-cols-2 gap-16 items-center min-h-screen py-28 lg:py-0">

          {/* LEFT */}
          <div>
            {/* Live badge */}
            <div className="au0 inline-flex items-center gap-2.5 mb-9 px-4 py-2 rounded-full border border-[rgba(163,255,78,0.22)] bg-[rgba(163,255,78,0.05)]">
              <span className="relative flex w-2 h-2">
                <span className="pulse-ring absolute inset-0 rounded-full bg-[#a3ff4e] opacity-60" />
                <span className="relative rounded-full w-2 h-2 bg-[#a3ff4e]" />
              </span>
              <span className="dm-mono text-[10px] tracking-[.24em] uppercase text-[#a3ff4e] font-medium">AI Benchmark · Live</span>
            </div>

            {/* Headline */}
            <h1 className="au1 bebas leading-[.9] mb-8" style={{ fontSize: "clamp(5rem,10vw,9rem)" }}>
              <span className="block text-white text-extrude">Which AI</span>
              <span className="block text-hollow">Actually</span>
              <span className="block text-[#a3ff4e]">Wins?</span>
            </h1>

            {/* Typewriter box */}
            <div className="au2 mb-8 max-w-[490px] rounded-r-lg border border-[rgba(163,255,78,0.1)] bg-[rgba(163,255,78,0.025)]"
                 style={{ borderLeft: "2px solid #a3ff4e", padding: "14px 16px" }}>
              <p className="dm-mono text-[9px] tracking-[.22em] uppercase text-[rgba(163,255,78,0.5)] mb-2">prompt demo</p>
              <span className="dm-mono text-[13px] text-[rgba(255,255,255,0.8)]">{typed}</span>
              <span className="cursor" />
            </div>

            {/* Sub */}
            <p className="au3 text-[15px] text-[rgba(255,255,255,0.36)] leading-[1.85] max-w-[420px] mb-10 font-light">
              Send one prompt to two AI models simultaneously. Read answers side-by-side — differences, blind spots, and strengths jump out instantly.
            </p>

            {/* CTAs */}
            <div className="au4 flex flex-wrap gap-3 mb-12">
              <Link to="/compare"
                    className="btn-lime dm-mono inline-flex items-center gap-3 grad-lime text-black px-8 py-4 text-[11px] font-medium tracking-[.1em] uppercase no-underline rounded-lg">
                Start Comparing
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#how"
                 className="btn-ghost dm-mono inline-flex items-center gap-2.5 border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.42)] px-7 py-4 text-[11px] tracking-[.07em] uppercase no-underline rounded-lg">
                How it works
              </a>
            </div>

            {/* Trust pills */}
            <div className="au4 flex flex-wrap gap-2">
              {["No login required", "Free demo mode", "10+ providers"].map(p => (
                <span key={p} className="dm-mono text-[10px] tracking-[.06em] px-3.5 py-1.5 rounded-full border border-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.02)]">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — floating 3D mockup */}
          <div className="hidden lg:flex items-center justify-center">
            <HeroMockup />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
          <span className="dm-mono text-[8px] tracking-[.18em] uppercase">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[rgba(255,255,255,.5)] to-transparent" />
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="relative border-t border-b border-[rgba(255,255,255,0.06)] py-4 overflow-hidden bg-[rgba(0,0,0,0.35)]">
        <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#07080a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#07080a] to-transparent z-10 pointer-events-none" />
        <div className="marquee-inner">
          {[...MODELS, ...MODELS].map((m, i) => (
            <span key={i}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.01)] flex-shrink-0 cursor-default select-none hover:border-[rgba(163,255,78,0.2)] hover:bg-[rgba(163,255,78,0.03)] transition-colors duration-200">
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: m.dot, boxShadow: `0 0 7px ${m.dot}80` }} />
              <span className="dm-mono text-[10px] tracking-[.13em] uppercase text-[rgba(255,255,255,0.33)]">{m.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <Reveal className="max-w-[1100px] mx-auto px-6 lg:px-14 py-28">
        <div className="flex items-center gap-3 mb-10">
          <span className="inline-block w-7 h-px bg-[#a3ff4e]" />
          <span className="dm-mono text-[9px] tracking-[.28em] uppercase text-[rgba(163,255,78,0.5)]">By the numbers</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-[rgba(255,255,255,0.07)]"
             style={{ gap: "1px", background: "rgba(255,255,255,0.07)" }}>
          {[
            { to: 2,   s: "×",       label: "Models compared at once" },
            { to: 100, s: "%",       label: "Identical prompt delivery" },
            { to: 0,   s: " clicks", label: "To see the full demo" },
            { to: 10,  s: "+",       label: "Supported providers" },
          ].map(({ to, s, label }) => (
            <div key={label} className="stat-cell p-8 lg:p-11 group relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(163,255,78,0)] to-transparent group-hover:via-[rgba(163,255,78,0.45)] transition-all duration-500" />
              <div className="bebas grad-text text-[68px] lg:text-[82px] leading-none mb-2 tabular-nums">
                <Counter to={to} suffix={s} />
              </div>
              <p className="dm-sans text-[12.5px] text-[rgba(255,255,255,0.3)] font-light">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ══ FEATURES ══ */}
      <section id="how" className="max-w-[1100px] mx-auto px-6 lg:px-14 pb-32">
        <Reveal className="flex items-end justify-between flex-wrap gap-6 mb-14 pb-12 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-7 h-px bg-[#a3ff4e]" />
              <span className="dm-mono text-[9px] tracking-[.28em] uppercase text-[rgba(163,255,78,0.5)]">How it works</span>
            </div>
            <h2 className="bebas text-[clamp(2.8rem,5vw,5rem)] leading-[.93] text-white">
              Engineered for<br />
              <span className="text-[#a3ff4e]">instant clarity</span>
            </h2>
          </div>
          <Link to="/compare"
                className="btn-lime dm-mono inline-flex items-center gap-2.5 grad-lime text-black px-6 py-3.5 text-[11px] font-medium tracking-[.1em] uppercase no-underline rounded-lg flex-shrink-0">
            Try it now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
             style={{ gap: "1px", background: "rgba(255,255,255,0.07)" }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.n} f={f} delay={i * 0.09} />)}
        </div>
      </section>

      {/* ══ SPLIT DEMO ══ */}
      <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0b0b0d]">
        <Reveal className="max-w-[1100px] mx-auto px-6 lg:px-14 py-28 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-7 h-px bg-[#a3ff4e]" />
              <span className="dm-mono text-[9px] tracking-[.28em] uppercase text-[rgba(163,255,78,0.5)]">What you'll see</span>
            </div>
            <h2 className="bebas text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[.95] text-white mb-7">
              Two columns.<br />
              <span className="text-[#a3ff4e]">One verdict.</span>
            </h2>
            <p className="text-[14.5px] text-[rgba(255,255,255,0.34)] leading-[1.85] font-light mb-10">
              Each model's reply renders in its own panel — markdown, code, lists, all intact. Spot verbosity, missing context, or hallucinations at a glance.
            </p>
            <ul className="space-y-4">
              {[
                "Send one prompt to both models simultaneously",
                "Answers load into side-by-side scrollable panels",
                "Compare tone, depth, accuracy, and verbosity",
                "Spot hallucinations or missing context instantly",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 group cursor-default">
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 rounded border border-[rgba(163,255,78,0.22)] bg-[rgba(163,255,78,0.04)] flex items-center justify-center">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#a3ff4e" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-[13.5px] text-[rgba(255,255,255,0.46)] font-light leading-[1.65] group-hover:text-[rgba(255,255,255,0.72)] transition-colors duration-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <SplitPreview />
        </Reveal>
      </section>

      {/* ══ QUOTE ══ */}
      <section className="border-t border-[rgba(255,255,255,0.07)]">
        <Reveal className="max-w-[760px] mx-auto px-6 lg:px-14 py-24 text-center">
          <div className="bebas text-[5rem] text-[rgba(255,255,255,0.05)] leading-none mb-4 select-none">"</div>
          <blockquote className="text-[clamp(1.1rem,2vw,1.4rem)] text-[rgba(255,255,255,0.5)] leading-[1.75] font-light italic mb-8">
            The only way to truly know which model fits your workflow is to ask them the same question and read their answers in the same breath.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-[rgba(163,255,78,0.3)]" />
            <span className="dm-mono text-[9px] tracking-[.2em] uppercase text-[rgba(255,255,255,0.18)]">AI Search Bench · Philosophy</span>
            <div className="h-px w-12 bg-[rgba(163,255,78,0.3)]" />
          </div>
        </Reveal>
      </section>

      {/* ══ FINAL CTA ══ */}
      <Reveal>
        <section className="relative overflow-hidden border-t border-[rgba(255,255,255,0.07)] py-36 px-6 text-center">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(ellipse 80% 55% at 50% 105%,rgba(163,255,78,0.07) 0%,transparent 70%)" }} />
          <div className="ring-r w-[660px] h-[660px] border border-[rgba(163,255,78,0.04)]" />
          <div className="ring-l w-[450px] h-[450px] border border-[rgba(163,255,78,0.07)]" />
          <div className="ring-r w-[290px] h-[290px] border border-[rgba(163,255,78,0.05)]" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[rgba(163,255,78,0.38)]" />
              <span className="dm-mono text-[9px] tracking-[.28em] uppercase text-[rgba(163,255,78,0.5)]">Ready to see for yourself?</span>
              <div className="h-px w-8 bg-[rgba(163,255,78,0.38)]" />
            </div>
            <h2 className="bebas leading-[.92] text-white mb-7" style={{ fontSize: "clamp(4rem,9.5vw,8rem)" }}>
              Stop guessing.<br />
              <span className="text-[#a3ff4e]">Start comparing.</span>
            </h2>
            <p className="text-[15px] text-[rgba(255,255,255,0.3)] max-w-[340px] mx-auto mb-12 leading-[1.8] font-light">
              No account. No API key. No nonsense. Just open the page and compare.
            </p>
            <Link to="/compare"
                  className="btn-lime dm-mono inline-flex items-center gap-3 grad-lime text-black px-12 py-4 text-[12px] font-medium tracking-[.12em] uppercase no-underline rounded-lg">
              Open the compare tool
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <p className="dm-mono text-[10px] text-[rgba(255,255,255,0.17)] mt-6 tracking-[.06em]">Free · Open source · No tracking</p>
          </div>
        </section>
      </Reveal>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] px-6 lg:px-14 py-7 flex justify-between items-center flex-wrap gap-4 bg-[#050507]">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff4e]" />
          <span className="dm-mono text-[11px] text-[rgba(255,255,255,0.28)] tracking-[.06em]">AI Search Bench</span>
        </div>
        <div className="flex gap-6">
          {["Docs", "GitHub", "Privacy"].map(l => (
            <a key={l} href="#" className="dm-mono text-[10px] text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.55)] transition-colors tracking-[.06em] no-underline">{l}</a>
          ))}
        </div>
        <span className="dm-mono text-[10px] text-[rgba(255,255,255,0.14)] tracking-[.05em]">© {new Date().getFullYear()} · Demo only</span>
      </footer>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ f, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(18px)";
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.transition = `opacity .6s ${delay}s ease,transform .6s ${delay}s cubic-bezier(.22,1,.36,1)`;
        el.style.opacity = "1"; el.style.transform = "translateY(0)";
        obs.unobserve(el);
      }
    }, { threshold: .08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="fcard bg-[#07080a] border border-[rgba(255,255,255,0.07)] p-8 lg:p-9 relative overflow-hidden">
      <div className="scan" />
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
           style={{ borderTop: "1px solid rgba(163,255,78,0.1)", borderRight: "1px solid rgba(163,255,78,0.1)" }} />
      <div className="fnum bebas text-[58px] leading-none mb-5 transition-colors duration-300"
           style={{ color: "rgba(255,255,255,0.04)" }}>{f.n}</div>
      <div className="ficon w-10 h-10 border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 rounded-lg text-[rgba(255,255,255,0.55)] transition-all duration-300">
        <f.Icon />
      </div>
      <h3 className="dm-mono text-[12.5px] font-medium text-white mb-3.5 leading-[1.35]">{f.title}</h3>
      <p className="dm-sans text-[13px] text-[rgba(255,255,255,0.32)] leading-[1.8] font-light">{f.body}</p>
    </div>
  );
}

/* ── 3D floating mockup ── */
function HeroMockup() {
  return (
    <div className="float-card relative w-full max-w-[490px]"
         style={{ filter: "drop-shadow(0 64px 120px rgba(0,0,0,.95)) drop-shadow(0 0 60px rgba(163,255,78,0.05))" }}>
      <div className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
           style={{ background: "#0d0d0f", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}>
        <div className="scan" />

        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#0a0a0c]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center">
            <span className="dm-mono text-[9px] text-[rgba(255,255,255,0.18)] tracking-[.04em]">compare — AI Search Bench</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(163,255,78,0.015)]">
          <span className="dm-mono text-[10px] text-[rgba(163,255,78,0.5)]">›_</span>
          <span className="dm-mono text-[11px] text-[rgba(255,255,255,0.42)]">Explain quantum entanglement simply</span>
        </div>

        {/* Model headers */}
        <div className="grid grid-cols-2 border-b border-[rgba(255,255,255,0.06)]">
          {[{ n: "GPT-4o", c: "#10a37f" }, { n: "Claude 3.5", c: "#d4a76a" }].map(({ n, c }, i) => (
            <div key={n} className={`px-4 py-2.5 flex items-center gap-1.5${i === 1 ? " border-l border-[rgba(255,255,255,0.06)]" : ""}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
              <span className="dm-mono text-[9px] text-[rgba(255,255,255,0.3)] tracking-[.1em]">{n}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-2">
          {[[88, 100, 70, 100, 52, 78, 40], [75, 100, 88, 52, 100, 62, 76, 36]].map((lines, pi) => (
            <div key={pi} className={`p-4 min-h-[160px]${pi === 1 ? " border-l border-[rgba(255,255,255,0.06)]" : ""}`}>
              {lines.map((w, i) => (
                <div key={i} className="skel h-[5px] mb-2 rounded" style={{ width: `${w}%`, animationDelay: `${i * .14}s` }} />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(255,255,255,0.05)] px-4 py-2.5 flex items-center gap-2 bg-[#0a0a0c]">
          <div className="flex-1 h-6 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]" />
          <div className="w-9 h-6 rounded grad-lime flex-shrink-0 opacity-90" />
        </div>
      </div>
      {/* Ground glow */}
      <div className="absolute -bottom-5 left-[15%] right-[15%] h-8 rounded-full pointer-events-none"
           style={{ background: "rgba(163,255,78,0.06)", filter: "blur(20px)" }} />
    </div>
  );
}

/* ── Mini split preview ── */
function SplitPreview() {
  return (
    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.09)] bg-[#0a0a0c]"
         style={{ boxShadow: "0 30px 80px rgba(0,0,0,.8),0 0 0 1px rgba(163,255,78,0.02)" }}>
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(163,255,78,0.01)]">
        <p className="dm-mono text-[8.5px] tracking-[.2em] uppercase text-[rgba(163,255,78,0.45)] mb-2">Prompt</p>
        <p className="text-[13px] text-[rgba(255,255,255,0.58)] font-light">What's the difference between ML and AI?</p>
      </div>
      <div className="grid grid-cols-2 border-b border-[rgba(255,255,255,0.06)]">
        {[{ n: "GPT-4o", c: "#10a37f" }, { n: "Claude 3.5", c: "#d4a76a" }].map(({ n, c }, i) => (
          <div key={n} className={`px-4 py-2.5 flex items-center gap-1.5${i === 1 ? " border-l border-[rgba(255,255,255,0.06)]" : ""}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 5px ${c}80` }} />
            <span className="dm-mono text-[9px] text-[rgba(255,255,255,0.27)] tracking-[.1em]">{n}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2">
        {[[100, 80, 65, 100, 50], [78, 100, 58, 90, 72, 44]].map((lines, i) => (
          <div key={i} className={`p-4${i === 1 ? " border-l border-[rgba(255,255,255,0.06)]" : ""}`}>
            {lines.map((w, j) => (
              <div key={j} className="h-1.5 rounded mb-2"
                   style={{ width: `${w}%`, background: `rgba(255,255,255,${j % 2 === 0 ? ".07" : ".045"})` }} />
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3 flex gap-2 bg-[#09090b]">
        <div className="flex-1 h-7 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]" />
        <div className="w-8 h-7 rounded flex-shrink-0 grad-lime opacity-85" />
      </div>
    </div>
  );
}