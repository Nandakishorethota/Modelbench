/** @typedef {{ id: string; label: string; shortLabel: string; accent: string; style: 'gpt' | 'claude' | 'gemini' | 'perplexity' }} ModelDef */

/** @type {ModelDef[]} */
export const MODEL_OPTIONS = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    shortLabel: "ChatGPT",
    accent: "#10a37f",
    style: "gpt",
  },
  {
    id: "claude",
    label: "Claude",
    shortLabel: "Claude",
    accent: "#d97757",
    style: "claude",
  },
  {
    id: "gemini",
    label: "Gemini",
    shortLabel: "Gemini",
    accent: "#4285f4",
    style: "gemini",
  },
  {
    id: "perplexity",
    label: "Perplexity",
    shortLabel: "Perplexity",
    accent: "#20808d",
    style: "perplexity",
  },
];

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickVariant(seed, n) {
  return seed % n;
}

/**
 * Calls Supabase Edge Function `compare-models` when env + client exist; otherwise demo text.
 * @param {string} prompt
 * @param {{ id: string }} leftModel
 * @param {{ id: string }} rightModel
 * @param {import("@supabase/supabase-js").SupabaseClient | null} supabase
 */
export async function runComparePair(prompt, leftModel, rightModel, supabase) {
  const q = prompt.trim();
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  async function demoPair() {
    const [L, R] = await Promise.all([
      runModelSearch(q, leftModel),
      runModelSearch(q, rightModel),
    ]);
    return { leftText: L.text, rightText: R.text };
  }

  if (supabase && url && anon) {
    try {
      const { data, error } = await supabase.functions.invoke("compare-models", {
        body: {
          prompt: q,
          leftModelId: leftModel.id,
          rightModelId: rightModel.id,
        },
      });
      if (error) {
        throw new Error(error.message ?? "Edge function request failed");
      }
      if (data && data.ok === false) {
        throw new Error(data.message ?? "compare-models returned an error");
      }
      const leftText = String(data?.left?.text ?? "").trim();
      const rightText = String(data?.right?.text ?? "").trim();
      if (leftText || rightText) {
        return {
          leftText: leftText || "_(No text for this column.)_",
          rightText: rightText || "_(No text for this column.)_",
          warning: null,
        };
      }
      throw new Error("compare-models returned empty replies");
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      const demo = await demoPair();
      return {
        ...demo,
        warning: `Could not load live answers (${detail}).\n\nShowing built-in demo replies instead. Deploy the **compare-models** Edge Function and provider secrets on Supabase to use real models.`,
      };
    }
  }

  return { ...(await demoPair()), warning: null };
}

/**
 * Demo replies when Supabase is not configured.
 * @param {string} prompt
 * @param {ModelDef} model
 * @returns {Promise<{ text: string }>}
 */
export function runModelSearch(prompt, model) {
  const trimmed = prompt.trim();
  const seed = hashString(`${model.id}:${trimmed}`);
  const delay = 350 + (seed % 900);

  return new Promise((resolve) => {
    setTimeout(() => {
      const v = pickVariant(seed, 3);
      const topic = trimmed || "your topic";
      const text = buildDemoAnswer(model.style, topic, v, seed);
      resolve({ text });
    }, delay);
  });
}

function buildDemoAnswer(style, topic, variant, seed) {
  const t = topic.slice(0, 280);
  switch (style) {
    case "gpt":
      return gptStyle(t, variant, seed);
    case "claude":
      return claudeStyle(t, variant, seed);
    case "gemini":
      return geminiStyle(t, variant, seed);
    case "perplexity":
      return perplexityStyle(t, variant, seed);
    default:
      return gptStyle(t, variant, seed);
  }
}

function gptStyle(topic, variant, seed) {
  const refs = ["[1]", "[2]", "[3]"].slice(0, 1 + (seed % 3));
  return `## Quick answer\n\nHere’s a direct response about **${topic}**.\n\n### What to do\n1. Restate what you need in one sentence (goal + constraints).\n2. Pull the best-supported facts you can find, and say what is uncertain.\n3. End with a short recommendation or next step.\n\n### Takeaways\n- **Be specific**: time range, audience, and format matter.\n- **Check assumptions**: if a detail is missing, say what you’re assuming.\n\n### Sources (illustrative)\n${refs.map((r) => `- Reference ${r} (placeholder)`).join("\n")}\n\n_${variant === 0 ? "If you share more context, I can narrow this further." : variant === 1 ? "Want a pros/cons list or a step-by-step plan instead?" : "Tell me if you want this shorter or more technical."}_`;
}

function claudeStyle(topic, variant, seed) {
  const aside =
    variant === 0
      ? "Happy to go deeper—tell me who this is for (beginner vs expert)."
      : variant === 1
        ? "If you’re choosing between options, list your constraints and I’ll compare them explicitly."
        : "If you want a neutral summary only, say so and I’ll minimize recommendations.";
  return `### ${topic}\n\nThanks for the question. I’ll answer as if you’re looking for a clear, practical explanation you can use or share.\n\n**Core idea.** Most good answers start by clarifying definitions, then explaining the mechanism or trade-offs, then giving a concrete recommendation that matches your constraints.\n\n**Useful angles to consider**\n- **Scope**: what’s in/out for "${topic}"?\n- **Evidence**: what would convince you the answer is reliable?\n- **Action**: what should you do in the next hour vs next month?\n\n**Suggested next step**\nAsk for one of: a checklist, a worked example, a comparison table, or a “common mistakes” section—those formats usually make the output easier to apply.\n\n_${aside}_\n\n_(Demo text: connect a real model API to replace this.)_`;
}

function geminiStyle(topic, variant, seed) {
  return `### Summary: ${topic}\n\n**Short answer:** Treat this as a question where the best reply depends on your goal (learn, decide, build, or communicate). A strong answer is usually correct, scoped, and easy to scan.\n\n**A simple framework**\n\n| If you want… | Ask for… |\n|--------------|----------|\n| Speed | bullet takeaways |\n| Depth | assumptions + reasoning |\n| Decisions | options + risks |\n\n**Practical checklist**\n1. State the outcome you want.\n2. Add constraints (time, budget, tools).\n3. Request the output shape (paragraphs vs bullets).\n\n_Note: this is sample text (${variant}, run ${seed % 1000}) for UI preview._`;
}

function perplexityStyle(topic, variant, seed) {
  return `### Answer\n\nFor “${topic}”, a strong response usually separates **what we know**, **what is debated**, and **what to do next**—especially if sources disagree.\n\n**Key points**\n- Start with the definition or scope so the reader knows what question is being answered.\n- Prefer claims you can support; label speculation clearly.\n- Close with a crisp recommendation or a small set of options.\n\n**References (illustrative)**\n[1] Overview article / documentation (placeholder).\n[2] Practitioner guide or standard reference (placeholder).\n[3] ${variant === 1 ? "Case study or example" : "FAQ-style explainer"} (placeholder).\n\n---\nIf you want this to read like a specific assistant (more formal, more casual, more technical), say the tone you want.`;
}
