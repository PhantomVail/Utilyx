import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateGrid(key: string): string[][] {
  const seen = new Set<string>();
  const letters: string[] = [];
  // Add key letters first (J→I substitution)
  for (const ch of (key + ALPHABET).toUpperCase().replace(/J/g, "I")) {
    if (/[A-Z]/.test(ch) && !seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }
  // Build 5x5 grid
  const grid: string[][] = [];
  for (let r = 0; r < 5; r++) {
    grid.push(letters.slice(r * 5, r * 5 + 5));
  }
  return grid;
}

function findPos(grid: string[][], ch: string): [number, number] {
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++)
      if (grid[r][c] === ch) return [r, c];
  return [0, 0];
}

function prepareText(text: string): string[] {
  const clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const pairs: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const a = clean[i];
    const b = i + 1 < clean.length ? clean[i + 1] : "X";
    if (a === b) {
      pairs.push(a + "X");
      i++;
    } else {
      pairs.push(a + b);
      i += 2;
    }
  }
  if (pairs.length > 0 && pairs[pairs.length - 1].length === 1) {
    pairs[pairs.length - 1] += "X";
  }
  return pairs;
}

function playfairProcess(text: string, key: string, decrypt: boolean): string {
  const grid = generateGrid(key);
  const pairs = prepareText(text);
  const shift = decrypt ? 4 : 1; // 4 = -1 mod 5

  return pairs.map((pair) => {
    const [r1, c1] = findPos(grid, pair[0]);
    const [r2, c2] = findPos(grid, pair[1]);

    if (r1 === r2) {
      // Same row: shift columns
      return grid[r1][(c1 + shift) % 5] + grid[r2][(c2 + shift) % 5];
    } else if (c1 === c2) {
      // Same column: shift rows
      return grid[(r1 + shift) % 5][c1] + grid[(r2 + shift) % 5][c2];
    } else {
      // Rectangle: swap columns
      return grid[r1][c2] + grid[r2][c1];
    }
  }).join(" ");
}

export function PlayfairTool() {
  const [input, setInput] = useState("HELLO WORLD");
  const [key, setKey] = useState("MONARCHY");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { CopyButton } = useCopyToClipboard();

  const grid = useMemo(() => generateGrid(key), [key]);
  const output = useMemo(() => playfairProcess(input, key, mode === "decrypt"), [input, key, mode]);
  const pairs = useMemo(() => prepareText(input), [input]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-surface border border-border rounded-lg p-3 text-xs text-muted-foreground">
        The Playfair cipher encrypts pairs of letters using a 5×5 grid. J is merged with I. Repeated letters in a pair are split with X.
      </div>

      {/* Mode toggle */}
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

      {/* Key */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Keyword
        </label>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
          className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase"
          placeholder="KEYWORD"
          spellCheck={false}
        />
      </div>

      {/* 5x5 Grid visualization */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Polybius Square
        </label>
        <div className="inline-grid grid-cols-5 gap-1">
          {grid.flat().map((ch, i) => {
            const isFromKey = key.toUpperCase().replace(/J/g, "I").includes(ch);
            return (
              <div
                key={i}
                className={`w-9 h-9 flex items-center justify-center rounded-md font-mono text-sm font-medium transition-colors ${
                  isFromKey
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                {ch}
              </div>
            );
          })}
        </div>
      </div>

      {/* Digraphs preview */}
      {mode === "encrypt" && pairs.length > 0 && (
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Prepared Pairs
          </label>
          <div className="flex flex-wrap gap-1.5">
            {pairs.map((p, i) => (
              <span key={i} className="px-2 py-1 bg-secondary text-foreground font-mono text-xs rounded border border-border">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none uppercase"
          rows={3}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setInput(output.replace(/\s/g, "")); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); }}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Use as input
            </button>
            <CopyButton text={output.replace(/\s/g, "")} />
          </div>
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap">
          {output}
        </pre>
      </div>

      {/* Quick keywords */}
      <div className="flex flex-wrap gap-1.5">
        {["MONARCHY", "PLAYFAIR", "CIPHER", "KEYWORD", "SECRET"].map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              key === k ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
