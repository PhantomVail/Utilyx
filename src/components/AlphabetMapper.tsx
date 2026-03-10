import { useState, useMemo, useCallback } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function AlphabetMapper() {
  const [mapping, setMapping] = useState<string[]>(ALPHABET.split(""));
  const [input, setInput] = useState("Hello World");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const { CopyButton } = useCopyToClipboard();

  const swap = useCallback((i: number, j: number) => {
    if (i === j) return;
    setMapping((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const reverseMapping = useMemo(() => {
    const rev = new Array(26).fill("");
    mapping.forEach((ch, i) => {
      const idx = ch.charCodeAt(0) - 65;
      if (idx >= 0 && idx < 26) rev[idx] = ALPHABET[i];
    });
    return rev;
  }, [mapping]);

  const encrypt = useCallback((text: string) => {
    return text.split("").map((ch) => {
      const upper = ch.toUpperCase();
      const idx = ALPHABET.indexOf(upper);
      if (idx === -1) return ch;
      const mapped = mapping[idx];
      return ch === upper ? mapped : mapped.toLowerCase();
    }).join("");
  }, [mapping]);

  const decrypt = useCallback((text: string) => {
    return text.split("").map((ch) => {
      const upper = ch.toUpperCase();
      const idx = mapping.indexOf(upper);
      if (idx === -1) return ch;
      const original = ALPHABET[idx];
      return ch === upper.toUpperCase() && ch === upper ? original : original.toLowerCase();
    }).join("");
  }, [mapping]);

  const output = useMemo(() => {
    return mode === "encrypt" ? encrypt(input) : decrypt(input);
  }, [input, mode, encrypt, decrypt]);

  const presets = useMemo(() => ({
    identity: ALPHABET.split(""),
    reverse: [...ALPHABET].reverse(),
    random: () => {
      const arr = ALPHABET.split("");
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    rot13: ALPHABET.split("").map((_, i) => ALPHABET[(i + 13) % 26]),
  }), []);

  const changedCount = mapping.filter((ch, i) => ch !== ALPHABET[i]).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            onClick={() => setMode("encrypt")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "encrypt" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode("decrypt")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "decrypt" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Decrypt
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {changedCount}/26 letters remapped
        </span>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Alphabet Mapping — drag to swap letters
        </label>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="flex gap-0.5 mb-1">
            {ALPHABET.split("").map((ch, i) => (
              <div key={`orig-${i}`} className="flex-1 text-center text-[11px] font-mono text-muted-foreground py-1">
                {ch}
              </div>
            ))}
          </div>
          <div className="flex gap-0.5 mb-1">
            {mapping.map((ch, i) => (
              <div key={`arrow-${i}`}
                className={`flex-1 text-center text-[8px] ${ch !== ALPHABET[i] ? "text-primary" : "text-muted-foreground/30"}`}>
                ↓
              </div>
            ))}
          </div>
          <div className="flex gap-0.5">
            {mapping.map((ch, i) => (
              <button
                key={`map-${i}`}
                draggable
                onDragStart={() => setDragFrom(i)}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => {
                  if (dragFrom !== null) swap(dragFrom, i);
                  setDragFrom(null);
                  setDragOver(null);
                }}
                onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
                className={`flex-1 text-center text-[11px] font-mono font-medium py-1.5 rounded transition-all cursor-grab active:cursor-grabbing select-none ${
                  dragOver === i
                    ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                    : ch !== ALPHABET[i]
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-foreground"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setMapping(presets.identity)}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors">
          Reset (A→A)
        </button>
        <button onClick={() => setMapping(presets.reverse)}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors">
          Reverse (A→Z)
        </button>
        <button onClick={() => setMapping(presets.rot13)}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors">
          ROT13
        </button>
        <button onClick={() => setMapping(presets.random())}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors">
          Random
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg p-3">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Manual Edit — click to set each position
        </label>
        <div className="flex flex-wrap gap-1">
          {mapping.map((ch, i) => (
            <div key={`edit-${i}`} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-mono text-muted-foreground">{ALPHABET[i]}</span>
              <button
                onClick={() => {
                  const nextChar = ALPHABET[(ALPHABET.indexOf(ch) + 1) % 26];
                  setMapping((prev) => {
                    const next = [...prev];
                    const otherIdx = next.indexOf(nextChar);
                    next[otherIdx] = next[i];
                    next[i] = nextChar;
                    return next;
                  });
                }}
                className={`w-7 h-7 text-[11px] font-mono font-medium rounded transition-colors ${
                  ch !== ALPHABET[i]
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                {ch}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={3}
          spellCheck={false}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setInput(output); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); }}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Use as input
            </button>
            <CopyButton text={output} />
          </div>
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap break-all">
          {output}
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Mapping Key</label>
          <CopyButton text={mapping.join("")} />
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground tracking-wider">
          {mapping.join("")}
        </div>
      </div>
    </div>
  );
}
