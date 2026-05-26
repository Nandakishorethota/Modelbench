import { Link } from "react-router-dom";

if (!document.getElementById("gf-about")) {
  const fontLink = document.createElement("link");
  fontLink.id = "gf-about";
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500&display=swap";
  document.head.appendChild(fontLink);
}

const WORKFLOW = [
  {
    step: "01",
    title: "Write one prompt",
    body: "Set a single question, instruction, or scenario so both answers begin from the same brief.",
  },
  {
    step: "02",
    title: "Choose two models",
    body: "Pair the assistants you want to examine and keep the comparison focused on their behavior.",
  },
  {
    step: "03",
    title: "Read side by side",
    body: "Notice tone, structure, accuracy, and useful detail without switching tabs or losing context.",
  },
];

const PRINCIPLES = [
  {
    label: "Controlled",
    title: "Same input, cleaner signal",
    body: "A shared prompt removes one of the biggest sources of noise when evaluating output.",
  },
  {
    label: "Readable",
    title: "Designed for close reading",
    body: "Parallel panels make differences in reasoning, formatting, and confidence easier to spot.",
  },
  {
    label: "Responsible",
    title: "Built with boundaries",
    body: "The demo experience stays deterministic, and production integrations should protect keys and user data.",
  },
];

export default function About() {
  return (
    <div className="about-page min-h-[calc(100vh-3.5rem)] text-white">
      <style>{`
        .about-page {
          background:
            radial-gradient(ellipse 62% 38% at 50% 0%, rgba(255,255,255,.055), transparent 72%),
            #0a0a0a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .about-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .about-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .about-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .about-card {
          transition: border-color .22s ease, transform .22s ease, background .22s ease;
        }
        .about-card:hover {
          border-color: rgba(255,255,255,.16) !important;
          background: rgba(255,255,255,.035) !important;
          transform: translateY(-3px);
        }
        .about-primary {
          transition: background .2s ease, transform .18s ease, box-shadow .2s ease;
        }
        .about-primary:hover {
          background: #e8e8e8;
          transform: translateY(-2px);
          box-shadow: 0 12px 34px rgba(255,255,255,.12);
        }
        .about-secondary {
          transition: border-color .2s ease, color .2s ease;
        }
        .about-secondary:hover {
          border-color: rgba(255,255,255,.27) !important;
          color: rgba(255,255,255,.9) !important;
        }
      `}</style>

      <div className="about-grid pointer-events-none fixed inset-0 opacity-80" />

      <main className="relative mx-auto max-w-5xl px-6 pb-20 pt-14 sm:pt-20">
        <section className="grid items-end gap-12 border-b border-white/[.07] pb-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="about-mono mb-6 text-[10px] uppercase tracking-[.32em] text-white/35">
              About / Search Bench
            </p>
            <h1 className="about-display max-w-2xl text-5xl font-normal leading-[1.05] tracking-[-.04em] text-white sm:text-6xl lg:text-[4.7rem]">
              Compare answers with the prompt held constant.
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-7 text-white/48">
              Search Bench is a calm workspace for testing how two AI assistants
              respond to the same question. It gives differences room to surface:
              clarity, depth, formatting, caution, and point of view.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/compare"
                className="about-primary about-mono inline-flex items-center gap-3 rounded-md bg-white px-6 py-3 text-[11px] font-medium uppercase tracking-[.16em] text-black"
              >
                Start comparing
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                to="/"
                className="about-secondary about-mono inline-flex items-center rounded-md border border-white/10 px-6 py-3 text-[11px] uppercase tracking-[.16em] text-white/45"
              >
                Return home
              </Link>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-xl border border-white/[.08] bg-white/[.025] p-6 sm:p-7">
            <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-white/[.05]" />
            <div className="flex items-center justify-between border-b border-white/[.07] pb-5">
              <span className="about-mono text-[10px] uppercase tracking-[.22em] text-white/28">
                Comparison brief
              </span>
              <span className="about-mono rounded-full border border-white/[.09] px-3 py-1 text-[9px] uppercase tracking-[.16em] text-white/42">
                Demo ready
              </span>
            </div>
            <div className="space-y-5 pt-6">
              {["Prompt", "Model A", "Model B", "Review"].map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <span className="about-mono text-[10px] text-white/23">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="about-mono text-[11px] uppercase tracking-[.18em] text-white/55">
                    {item}
                  </span>
                  <span className="h-px flex-1 bg-white/[.07]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="about-mono mb-3 text-[10px] uppercase tracking-[.28em] text-white/28">
                How it works
              </p>
              <h2 className="about-display text-3xl tracking-[-.03em] text-white/90">
                A simple evaluation loop
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/38">
              Keep the setup identical, then judge the responses on what matters
              for your task.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WORKFLOW.map(({ step, title, body }) => (
              <article
                key={step}
                className="about-card min-h-52 rounded-xl border border-white/[.07] bg-[#101010] p-6"
              >
                <p className="about-mono mb-10 text-[10px] tracking-[.24em] text-white/25">
                  {step}
                </p>
                <h3 className="about-display mb-3 text-xl text-white/85">{title}</h3>
                <p className="text-sm leading-6 text-white/42">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-9 border-y border-white/[.07] py-14 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="about-mono mb-3 text-[10px] uppercase tracking-[.28em] text-white/28">
              Principles
            </p>
            <h2 className="about-display text-3xl tracking-[-.03em] text-white/90">
              What the bench is for
            </h2>
          </div>
          <div className="space-y-7">
            {PRINCIPLES.map(({ label, title, body }) => (
              <article key={label} className="grid gap-3 sm:grid-cols-[124px_1fr]">
                <p className="about-mono pt-1 text-[10px] uppercase tracking-[.23em] text-white/28">
                  {label}
                </p>
                <div>
                  <h3 className="mb-2 text-base font-medium text-white/78">{title}</h3>
                  <p className="max-w-lg text-sm leading-6 text-white/42">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 rounded-xl border border-white/[.08] bg-white/[.025] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="about-mono mb-3 text-[10px] uppercase tracking-[.28em] text-white/28">
              A note on production
            </p>
            <h2 className="about-display mb-3 text-2xl text-white/90">
              Demo output first. Private integrations next.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-white/43">
              The default experience uses deterministic demo responses. If you
              connect real models, keep credentials on your server and process
              prompts according to your privacy policy.
            </p>
          </div>
          <Link
            to="/compare"
            className="about-primary about-mono inline-flex shrink-0 items-center justify-center rounded-md bg-white px-7 py-3 text-[11px] font-medium uppercase tracking-[.16em] text-black"
          >
            Open compare
          </Link>
        </section>
      </main>
    </div>
  );
}
