import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function analyzeFrequency(text: string): { char: string; count: number; pct: number }[] {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
    }
  }
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => ({
    char: ch,
    count: counts[ch] || 0,
    pct: total > 0 ? ((counts[ch] || 0) / total) * 100 : 0,
  }));
}

// English letter frequency (approximate)
const ENGLISH_FREQ: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1,
  R: 6.0, D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2,
  G: 2.0, Y: 2.0, P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.2, X: 0.2,
  Q: 0.1, Z: 0.1,
};

function entropyBits(text: string): number {
  const counts: Record<string, number> = {};
  for (const ch of text) counts[ch] = (counts[ch] || 0) + 1;
  const len = text.length;
  if (len === 0) return 0;
  let entropy = 0;
  for (const count of Object.values(counts)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function indexOfCoincidence(text: string): number {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const n = clean.length;
  if (n <= 1) return 0;
  const counts: Record<string, number> = {};
  for (const ch of clean) counts[ch] = (counts[ch] || 0) + 1;
  let sum = 0;
  for (const c of Object.values(counts)) sum += c * (c - 1);
  return sum / (n * (n - 1));
}

export function FreqAnalysisTool() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.");
  const { CopyButton } = useCopyToClipboard();

  const freq = useMemo(() => analyzeFrequency(input), [input]);
  const maxPct = Math.max(...freq.map((f) => f.pct), 1);
  const entropy = useMemo(() => entropyBits(input), [input]);
  const ic = useMemo(() => indexOfCoincidence(input), [input]);

  const totalLetters = freq.reduce((s, f) => s + f.count, 0);
  const uniqueChars = new Set(input).size;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Input */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={4}
          placeholder="Enter or paste text to analyze..."
          spellCheck={false}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Letters", value: totalLetters.toString() },
          { label: "Unique Chars", value: uniqueChars.toString() },
          { label: "Entropy", value: `${entropy.toFixed(3)} bits` },
          { label: "IC", value: ic.toFixed(4) },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-lg px-3 py-2.5 text-center">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">{s.label}</div>
            <div className="font-mono text-sm text-foreground font-medium">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-3 text-xs text-muted-foreground">
        <span className="text-foreground font-medium">IC interpretation:</span>{" "}
        {ic > 0.06 ? "Likely monoalphabetic cipher or plaintext (IC ≈ 0.065 for English)" :
         ic > 0.04 ? "Possibly polyalphabetic cipher (lower IC)" :
         "Very flat distribution — strong encryption or random text"}
      </div>

      {/* Frequency bars */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Letter Frequency
        </label>
        <div className="space-y-0.5">
          {freq.filter((f) => f.count > 0 || f.pct > 0).length > 0 ? (
            freq.map((f) => (
              <div key={f.char} className="flex items-center gap-2 group">
                <span className="text-[11px] font-mono text-muted-foreground w-4 text-right">{f.char}</span>
                <div className="flex-1 h-4 relative">
                  {/* Text bar */}
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/20 rounded-sm transition-all"
                    style={{ width: `${(f.pct / maxPct) * 100}%` }}
                  />
                  {/* English reference line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary/40"
                    style={{ left: `${((ENGLISH_FREQ[f.char] || 0) / maxPct) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-14 text-right">
                  {f.pct.toFixed(1)}% ({f.count})
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground text-center py-4">No alphabetic characters found</div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-3 h-2 bg-primary/20 rounded-sm" /> Your text
          </span>
          <span className="flex items-center gap-1">
            <div className="w-px h-3 bg-primary/40" /> English average
          </span>
        </div>
      </div>
    </div>
  );
}
