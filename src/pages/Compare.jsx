import { useCallback, useMemo, useState } from "react";
import { MODEL_OPTIONS, runComparePair } from "../lib/compareEngine";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";

/* ── Google Fonts ── */
if (!document.getElementById("gf-compare")) {
  const l = document.createElement("link");
  l.id = "gf-compare";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(l);
}

/* ── Keyframes & base styles ── */
if (!document.getElementById("hk-compare")) {
  const s = document.createElement("style");
  s.id = "hk-compare";
  s.textContent = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
    @keyframes shimmerBW{0%{background-position:-400% 0;}100%{background-position:400% 0;}}
    @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
    @keyframes spinDot{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}

    .font-playfair{font-family:'Playfair Display',Georgia,serif;}
    .font-inter{font-family:'Inter',system-ui,sans-serif;}
    .font-mono{font-family:'JetBrains Mono',monospace;}

    .fade-up{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.2) both;}

    .compare-page{
      background:
        radial-gradient(ellipse 55% 42% at 50% 0%,rgba(255,255,255,.06),transparent 74%),
        #0a0a0a;
    }
    .compare-rule{
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
    }
    .status-pill{
      background:rgba(255,255,255,.035);
      border:1px solid rgba(255,255,255,.08);
    }
    .composer-card{
      box-shadow:0 28px 90px rgba(0,0,0,.28);
    }
    .versus-mark{
      background:#0d0d0d;
      border:1px solid rgba(255,255,255,.08);
      color:rgba(255,255,255,.28);
    }
    .results-label::after{
      content:'';
      display:block;
      height:1px;
      flex:1;
      background:rgba(255,255,255,.07);
    }

    /* Shimmer loader */
    .shimmer-bw{
      background:linear-gradient(90deg,#1a1a1a 25%,#2a2a2a 50%,#1a1a1a 75%);
      background-size:400% 100%;
      animation:shimmerBW 1.8s ease infinite;
    }

    /* Card lift */
    .panel-card{
      transition:box-shadow .25s ease,border-color .25s ease,transform .25s ease;
    }
    .panel-card:hover{
      box-shadow:0 24px 64px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.08);
      border-color:rgba(255,255,255,.18)!important;
      transform:translateY(-3px);
    }

    /* Dropdown */
    .dropdown-item{transition:background .15s;}
    .dropdown-item:hover{background:rgba(255,255,255,.06);}
    .dropdown-item.selected{background:rgba(255,255,255,.04);}

    /* Buttons */
    .btn-primary{
      transition:background .2s,transform .15s,box-shadow .2s;
      background:#fff;color:#000;
    }
    .btn-primary:hover:not(:disabled){
      background:#e8e8e8;
      transform:translateY(-2px);
      box-shadow:0 12px 40px rgba(255,255,255,.15);
    }
    .btn-primary:active{transform:none;}
    .btn-primary:disabled{opacity:.4;cursor:not-allowed;}

    .btn-ghost{
      transition:border-color .2s,color .2s,transform .15s;
    }
    .btn-ghost:hover{
      border-color:rgba(255,255,255,.3)!important;
      color:rgba(255,255,255,.9)!important;
      transform:translateY(-1px);
    }

    /* Input focus */
    .prompt-area:focus{outline:none;border-color:rgba(255,255,255,.25)!important;}

    /* Typing cursor */
    .cursor::after{content:'|';animation:blink 1s step-end infinite;color:rgba(255,255,255,.4);}

    /* Decorative corner marks */
    .corner-mark::before,.corner-mark::after{
      content:'';position:absolute;width:10px;height:10px;
    }
    .corner-mark::before{top:-1px;left:-1px;border-top:1px solid rgba(255,255,255,.25);border-left:1px solid rgba(255,255,255,.25);}
    .corner-mark::after{bottom:-1px;right:-1px;border-bottom:1px solid rgba(255,255,255,.25);border-right:1px solid rgba(255,255,255,.25);}

    /* Spinner */
    .spin-ring{
      width:18px;height:18px;
      border:1.5px solid rgba(255,255,255,.1);
      border-top-color:rgba(255,255,255,.6);
      border-radius:50%;
      animation:spinDot .7s linear infinite;
    }

    /* Divider rule */
    .ruled{border:none;border-top:1px solid rgba(255,255,255,.07);margin:0;}

    /* Noise overlay for depth */
    .noise::before{
      content:'';position:absolute;inset:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events:none;opacity:.4;border-radius:inherit;
    }
  `;
  document.head.appendChild(s);
}

function modelById(id) {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[0];
}

/* ── MODEL DROPDOWN ── */
function ModelDropdown({ value, onChange, options, align = "left" }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((m) => m.id === value) || options[0];

  return (
    <div className="relative w-full font-inter">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg
          border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.03)]
          hover:bg-[rgba(255,255,255,.06)] hover:border-[rgba(255,255,255,.15)]
          transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
          <span className="font-mono text-[12px] text-white/70 tracking-wide">
            {selected.label}
          </span>
        </div>
        <span className="text-white/25 text-[10px]">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-20 mt-1.5 w-full rounded-lg overflow-hidden
              border border-[rgba(255,255,255,.1)] bg-[#111] shadow-2xl
              ${align === "right" ? "right-0" : "left-0"}`}
          >
            {options.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={`dropdown-item w-full flex items-center gap-3 px-4 py-2.5 text-left
                  ${m.id === value ? "selected" : ""}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="font-mono text-[12px] text-white/60 tracking-wide flex-1">
                  {m.label}
                </span>
                {m.id === value && (
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">active</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── FORMATTED ANSWER ── */
function FormattedAnswer({ text }) {
  if (!text) return null;
  return (
    <div className="space-y-3 font-inter text-[13.5px] leading-relaxed text-white/55">
      {text.split("\n").map((line, i) => {
        const key = `${i}-${line.slice(0, 10)}`;

        if (line.startsWith("## ")) {
          return (
            <h2 key={key}
              className="font-playfair text-white text-[15px] font-normal mt-5 tracking-wide"
              style={{ borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: "8px" }}>
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={key} className="font-inter text-white/80 text-[13px] font-medium mt-4 uppercase tracking-[.08em]">
              {line.slice(4)}
            </h3>
          );
        }
        if (/^\s*[-*•]\s/.test(line)) {
          return (
            <div key={key} className="flex gap-3">
              <span className="text-white/20 mt-[2px] text-[10px] pt-[3px]">◆</span>
              <span className="text-white/55">{line.replace(/^\s*[-*•]\s/, "")}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={key} className="h-2" />;
        return (
          <p key={key} className="text-white/50">{line}</p>
        );
      })}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function Compare() {
  const [prompt, setPrompt] = useState("");
  const [leftId, setLeftId] = useState("chatgpt");
  const [rightId, setRightId] = useState("claude");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leftText, setLeftText] = useState(null);
  const [rightText, setRightText] = useState(null);

  const liveBackend = isSupabaseConfigured();
  const leftModel = useMemo(() => modelById(leftId), [leftId]);
  const rightModel = useMemo(() => modelById(rightId), [rightId]);

  const runCompare = useCallback(async () => {
    const q = prompt.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setLeftText(null);
    setRightText(null);
    try {
      const result = await runComparePair(q, leftModel, rightModel, getSupabase());
      setLeftText(result.leftText);
      setRightText(result.rightText);
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [prompt, leftModel, rightModel]);

  const swapModels = useCallback(() => {
    setLeftId(rightId);
    setRightId(leftId);
  }, [leftId, rightId]);

  const hasResults = leftText || rightText;

  return (
    <div
      className="compare-page min-h-[calc(100vh-3.5rem)] text-white font-inter relative overflow-hidden"
    >
      {/* Fine grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative max-w-5xl mx-auto px-6 pb-16 pt-12 sm:pt-16 space-y-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono mb-5 text-[10px] uppercase tracking-[.32em] text-white/30">
              Comparison workspace
            </p>
            <h1 className="font-playfair max-w-2xl text-4xl font-normal leading-[1.08] tracking-[-.035em] text-white sm:text-5xl">
              Put two models to the same test.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/42">
              Write one prompt, select a pair, and inspect their responses side
              by side. The input stays fixed so the differences are easier to read.
            </p>
          </div>
          <div className="status-pill flex items-center gap-5 rounded-lg px-5 py-4">
            <div>
              <p className="font-mono mb-2 text-[9px] uppercase tracking-[.24em] text-white/25">
                Session
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[.16em] text-white/62">
                {liveBackend ? "Live API" : "Demo mode"}
              </p>
            </div>
            <span className="h-10 w-px bg-white/[.08]" />
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: liveBackend ? "rgba(255,255,255,.72)" : "rgba(255,255,255,.28)",
              }}
            />
          </div>
        </section>

        <div className="compare-rule h-px w-full" />

        {/* ── ERROR ── */}
        {error && (
          <div
            className="px-5 py-3.5 rounded-lg fade-up"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,80,80,.25)",
              color: "rgba(255,140,140,.8)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* ── INPUT CARD ── */}
        <div
          className="composer-card rounded-xl overflow-hidden panel-card relative corner-mark noise"
          style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.23em] text-white/26">
                Setup
              </p>
              <p className="mt-2 text-sm text-white/62">
                Select the assistants to compare
              </p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/22">
              Same prompt / parallel output
            </p>
          </div>

          {/* Model selectors row */}
          <div
            className="grid grid-cols-1 items-end gap-3 px-5 py-5 md:grid-cols-[1fr_auto_1fr]"
            style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}
          >
            <div className="space-y-1.5">
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/20">Model A</p>
              <ModelDropdown value={leftId} onChange={setLeftId} options={MODEL_OPTIONS} align="left" />
            </div>
            <div className="versus-mark hidden h-[42px] w-[42px] items-center justify-center rounded-lg font-mono text-[9px] uppercase tracking-[.18em] md:flex">
              vs
            </div>
            <div className="space-y-1.5">
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/20">Model B</p>
              <ModelDropdown value={rightId} onChange={setRightId} options={MODEL_OPTIONS} align="right" />
            </div>
          </div>

          {/* Prompt area */}
          <div className="px-5 py-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="font-mono text-[9px] uppercase tracking-[.2em] text-white/20">
                Prompt
              </label>
              <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/16">
                Ask once / compare twice
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="prompt-area w-full bg-transparent font-mono text-[13px] text-white/70
                placeholder:text-white/15 resize-none transition-all duration-200
                border border-[rgba(255,255,255,.07)] rounded-lg px-4 py-4"
              placeholder="Enter your prompt…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runCompare();
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <button
                onClick={swapModels}
                className="btn-ghost font-mono text-[11px] text-white/25 hover:text-white/60
                  px-3 py-1.5 rounded border border-transparent tracking-wide uppercase"
              >
                ⇄ Swap
              </button>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/15 hidden sm:block">
                  ⌘ + Enter
                </span>
                <button
                  onClick={runCompare}
                  disabled={loading}
                  className="btn-primary font-mono text-[11px] font-medium tracking-[.12em]
                    uppercase px-6 py-2.5 rounded-lg flex items-center gap-2.5"
                >
                  {loading && <div className="spin-ring" style={{ borderTopColor: "#000" }} />}
                  {loading ? "Running" : "Compare"}
                  {!loading && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="results-label flex items-center gap-5 pt-2">
          <span className="font-mono text-[10px] uppercase tracking-[.28em] text-white/28">
            Response panels
          </span>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Panel
            title={leftModel.label}
            index="A"
            loading={loading}
            text={leftText}
          />
          <Panel
            title={rightModel.label}
            index="B"
            loading={loading}
            text={rightText}
          />
        </div>

        {!hasResults && !loading && (
          <div className="text-center py-6 fade-up">
            <p className="font-mono text-[11px] text-white/15 uppercase tracking-[.2em]">
              Responses will appear side by side
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── PANEL ── */
function Panel({ title, index, loading, text }) {
  return (
    <div
      className="rounded-xl overflow-hidden panel-card relative noise"
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,.07)",
        minHeight: 360,
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="font-mono text-[9px] font-medium"
            style={{
              width: 20, height: 20,
              border: "1px solid rgba(255,255,255,.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,.4)",
            }}
          >
            {index}
          </div>
          <span className="font-playfair text-white/70 text-[13px] tracking-wide">
            {title}
          </span>
        </div>

        {loading && !text ? (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full bg-white"
                style={{
                  width: 3, height: 3,
                  opacity: 0.2,
                  animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[.2em] text-white/18">
            Output
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 overflow-auto" style={{ maxHeight: "70vh" }}>
        {loading && !text && (
          <div className="space-y-3 pt-1">
            {[90, 70, 85, 55, 78].map((w, i) => (
              <div
                key={i}
                className="shimmer-bw rounded"
                style={{ height: 10, width: `${w}%`, opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {!loading && text && (
          <div className="fade-up">
            <FormattedAnswer text={text} />
          </div>
        )}

        {!loading && !text && (
          <div className="h-full flex items-center justify-center py-16">
            <p className="font-mono text-[11px] text-white/15 uppercase tracking-[.15em]">
              Awaiting response
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
