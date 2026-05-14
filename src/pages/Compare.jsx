import { useCallback, useMemo, useState } from "react";
import { MODEL_OPTIONS, runComparePair } from "../lib/compareEngine";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";

/* ───────────────────────────
   helpers
────────────────────────── */
function modelById(id) {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[0];
}

/* ───────────────────────────
   CUSTOM DROPDOWN (NEW)
────────────────────────── */
function ModelDropdown({ value, onChange, options, align = "left" }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((m) => m.id === value) || options[0];

  return (
    <div className="relative w-full">
      {/* trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
        border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: selected.accent }}
          />
          <span className="text-white/90">{selected.label}</span>
        </div>
        <span className="text-white/40 text-xs">▾</span>
      </button>

      {/* dropdown */}
      {open && (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div
            className={`absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl
            border border-white/10 bg-[#0d0d10] shadow-xl
            ${align === "right" ? "right-0" : "left-0"}`}
          >
            {options.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm
                hover:bg-white/10 transition
                ${m.id === value ? "bg-white/10" : ""}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: m.accent }}
                />
                <span className="text-white/80">{m.label}</span>

                {m.id === value && (
                  <span className="ml-auto text-xs text-[#a3ff4e]">
                    selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────────
   formatted renderer
────────────────────────── */
function FormattedAnswer({ text }) {
  if (!text) return null;

  return (
    <div className="space-y-3 text-[14px] leading-relaxed text-white/70">
      {text.split("\n").map((line, i) => {
        const key = `${i}-${line.slice(0, 10)}`;

        if (line.startsWith("## ")) {
          return (
            <h2 key={key} className="text-white text-base font-semibold mt-4">
              {line.slice(3)}
            </h2>
          );
        }

        if (line.startsWith("### ")) {
          return (
            <h3 key={key} className="text-white/90 text-sm font-semibold mt-3">
              {line.slice(4)}
            </h3>
          );
        }

        if (/^\s*[-*•]\s/.test(line)) {
          return (
            <div key={key} className="flex gap-2">
              <span className="text-[#a3ff4e]">▸</span>
              <span>{line.replace(/^\s*[-*•]\s/, "")}</span>
            </div>
          );
        }

        if (!line.trim()) return <div key={key} className="h-2" />;

        return (
          <p key={key} className="text-white/60">
            {line}
          </p>
        );
      })}
    </div>
  );
}

/* ───────────────────────────
   MAIN PAGE
────────────────────────── */
export default function Compare() {
  const [prompt, setPrompt] = useState(
    
  );

  const [leftId, setLeftId] = useState("chatgpt");
  const [rightId, setRightId] = useState("claude");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [leftText, setLeftText] = useState(null);
  const [rightText, setRightText] = useState(null);

  const liveBackend = isSupabaseConfigured();

  const leftModel = useMemo(() => modelById(leftId), [leftId]);
  const rightModel = useMemo(() => modelById(rightId), [rightId]);

  /* run compare */
  const runCompare = useCallback(async () => {
    const q = prompt.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setLeftText(null);
    setRightText(null);

    try {
      const result = await runComparePair(
        q,
        leftModel,
        rightModel,
        getSupabase()
      );

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
    <div className="min-h-screen bg-[#07080a] text-white dm-sans">

      {/* TOP BAR */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[#07080a]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3ff4e] shadow-[0_0_10px_#a3ff4e]" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#a3ff4e] dm-mono">
              AI Compare Lab
            </span>
          </div>

          <span className="text-xs text-white/30">
            {liveBackend ? "Live API" : "Demo Mode"}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">

        {/* ERROR */}
        {error && (
          <div className="border border-red-500/20 bg-red-950/30 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* INPUT */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d10] overflow-hidden shadow-xl">

          {/* MODEL SELECTORS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3 border-b border-white/10">

            <ModelDropdown
              value={leftId}
              onChange={setLeftId}
              options={MODEL_OPTIONS}
              align="left"
            />

            <ModelDropdown
              value={rightId}
              onChange={setRightId}
              options={MODEL_OPTIONS}
              align="right"
            />
          </div>

          {/* PROMPT */}
          <div className="p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-transparent outline-none text-sm text-white/80 placeholder:text-white/30"
              placeholder="Ask anything..."
            />

            <div className="flex justify-between mt-3">
              <button
                onClick={swapModels}
                className="text-xs text-white/40 hover:text-white"
              >
                swap models
              </button>

              <button
                onClick={runCompare}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#a3ff4e] text-black text-xs font-semibold
                           hover:shadow-[0_0_40px_rgba(163,255,78,0.4)]
                           active:scale-95 transition"
              >
                {loading ? "Running..." : "Compare"}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="grid lg:grid-cols-2 gap-4">

          <Panel
            title={leftModel.label}
            accent={leftModel.accent}
            loading={loading}
            text={leftText}
          />

          <Panel
            title={rightModel.label}
            accent={rightModel.accent}
            loading={loading}
            text={rightText}
          />
        </div>

        {!hasResults && !loading && (
          <p className="text-center text-white/30 text-sm">
            Run a comparison to see AI differences side-by-side
          </p>
        )}
      </div>
    </div>
  );
}

/* PANEL */
function Panel({ title, accent, loading, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d10] overflow-hidden">

      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
        <span className="text-sm font-medium">{title}</span>
      </div>

      <div className="p-4 min-h-[280px] max-h-[70vh] overflow-auto">

        {loading && !text && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && text && <FormattedAnswer text={text} />}

        {!loading && !text && (
          <div className="text-white/20 text-sm">
            Response will appear here
          </div>
        )}
      </div>
    </div>
  );
}