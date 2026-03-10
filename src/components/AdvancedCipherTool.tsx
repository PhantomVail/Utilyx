import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

// Beaufort cipher: C = (K - P) mod 26  |  P = (K - C) mod 26
// Both encrypt and decrypt use the same operation (symmetric)
function beaufort(text: string, key: string): string {
  if (!key) return text;
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    const p = ch.charCodeAt(0) - base;
    const kv = k.charCodeAt(ki % k.length) - 65;
    ki++;
    return String.fromCharCode(((kv - p + 26) % 26) + base);
  });
}

// Bifid cipher
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

const BIFID_ALPHA = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // no J

function bifidEncrypt(text: string, key: string): string {
  // Build 5x5 grid from key
  const seen = new Set<string>();
  const grid: string[] = [];
  for (const ch of (key + BIFID_ALPHA).toUpperCase().replace(/J/g, "I")) {
    if (/[A-Z]/.test(ch) && ch !== "J" && !seen.has(ch)) {
      seen.add(ch);
      grid.push(ch);
    }
  }

  const clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const rows: number[] = [];
  const cols: number[] = [];

  for (const ch of clean) {
    const idx = grid.indexOf(ch);
    rows.push(Math.floor(idx / 5));
    cols.push(idx % 5);
  }

  const combined = [...rows, ...cols];
  let result = "";
  for (let i = 0; i < combined.length; i += 2) {
    result += grid[combined[i] * 5 + combined[i + 1]];
  }
  return result;
}

function bifidDecrypt(text: string, key: string): string {
  const seen = new Set<string>();
  const grid: string[] = [];
  for (const ch of (key + BIFID_ALPHA).toUpperCase().replace(/J/g, "I")) {
    if (/[A-Z]/.test(ch) && ch !== "J" && !seen.has(ch)) {
      seen.add(ch);
      grid.push(ch);
    }
  }

  const clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const combined: number[] = [];

  for (const ch of clean) {
    const idx = grid.indexOf(ch);
    combined.push(Math.floor(idx / 5));
    combined.push(idx % 5);
  }

  const half = combined.length / 2;
  const rows = combined.slice(0, half);
  const cols = combined.slice(half);

  let result = "";
  for (let i = 0; i < rows.length; i++) {
    result += grid[rows[i] * 5 + cols[i]];
  }
  return result;
}

// Columnar transposition
function columnarEncrypt(text: string, key: string): string {
  if (!key) return text;
  const clean = text.replace(/[^A-Za-z ]/g, "");
  const cols = key.length;
  const rows = Math.ceil(clean.length / cols);

  // Fill grid row by row
  const grid: string[][] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const row: string[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(idx < clean.length ? clean[idx++] : "X");
    }
    grid.push(row);
  }

  // Read columns in key order
  const order = key.split("").map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch)).map((x) => x.i);
  let result = "";
  for (const ci of order) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][ci];
    }
    result += " ";
  }
  return result.trim();
}

function columnarDecrypt(text: string, key: string): string {
  if (!key) return text;
  const clean = text.replace(/\s/g, "");
  const cols = key.length;
  const rows = Math.ceil(clean.length / cols);
  const extra = clean.length % cols || cols;

  const order = key.split("").map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch)).map((x) => x.i);

  // Distribute characters to columns
  const columns: string[][] = Array.from({ length: cols }, () => []);
  let idx = 0;
  for (const ci of order) {
    const colLen = ci < extra ? rows : rows - (extra < cols ? 1 : 0);
    for (let r = 0; r < Math.min(colLen, rows); r++) {
      if (idx < clean.length) columns[ci].push(clean[idx++]);
    }
  }

  // Read row by row
  let result = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r < columns[c].length) result += columns[c][r];
    }
  }
  return result;
}

type AdvCipher = "beaufort" | "bifid" | "columnar";

const CIPHERS: { id: AdvCipher; label: string; desc: string }[] = [
  { id: "beaufort", label: "Beaufort", desc: "Symmetric variant of Vigenère — encryption = decryption" },
  { id: "bifid", label: "Bifid", desc: "Combines Polybius square substitution with fractionation" },
  { id: "columnar", label: "Columnar Transposition", desc: "Rearranges text by writing in rows and reading in key-sorted columns" },
];

export function AdvancedCipherTool() {
  const [cipher, setCipher] = useState<AdvCipher>("beaufort");
  const [input, setInput] = useState("HELLO WORLD");
  const [key, setKey] = useState("SECRET");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { CopyButton } = useCopyToClipboard();

  const isSymmetric = cipher === "beaufort";

  const output = useMemo(() => {
    try {
      switch (cipher) {
        case "beaufort":
          return beaufort(input, key);
        case "bifid":
          return mode === "encrypt" ? bifidEncrypt(input, key) : bifidDecrypt(input, key);
        case "columnar":
          return mode === "encrypt" ? columnarEncrypt(input, key) : columnarDecrypt(input, key);
      }
    } catch {
      return "Error processing input";
    }
  }, [cipher, input, key, mode]);

  // Columnar grid visualization
  const columnarGrid = useMemo(() => {
    if (cipher !== "columnar" || mode !== "encrypt" || !key) return null;
    const clean = input.replace(/[^A-Za-z ]/g, "");
    const cols = key.length;
    const rows = Math.ceil(clean.length / cols);
    const grid: string[][] = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(idx < clean.length ? clean[idx++] : "·");
      }
      grid.push(row);
    }
    const order = key.split("").map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch));
    return { grid, order, cols, rows };
  }, [cipher, mode, input, key]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cipher selector */}
      <div className="flex flex-wrap gap-1.5">
        {CIPHERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCipher(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              cipher === c.id ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {CIPHERS.find((c) => c.id === cipher)?.desc}
        {isSymmetric && <span className="text-primary ml-1">(self-inverse)</span>}
      </p>

      {/* Mode toggle */}
      {!isSymmetric && (
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
      )}

      {/* Key */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          {cipher === "columnar" ? "Key (column order)" : "Keyword"}
        </label>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter key..."
          spellCheck={false}
        />
      </div>

      {/* Columnar grid visualization */}
      {columnarGrid && (
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Transposition Grid
          </label>
          <div className="overflow-x-auto">
            <table className="text-xs font-mono">
              <thead>
                <tr>
                  {key.split("").map((ch, i) => {
                    const sortIdx = columnarGrid.order.findIndex((o) => o.i === i);
                    return (
                      <th key={i} className="w-8 h-8 text-center border border-border">
                        <div className="text-primary font-medium">{ch.toUpperCase()}</div>
                        <div className="text-muted-foreground/50 text-[9px]">{sortIdx + 1}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {columnarGrid.grid.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="w-8 h-8 text-center border border-border text-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Input */}
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

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setInput(output); if (!isSymmetric) setMode(mode === "encrypt" ? "decrypt" : "encrypt"); }}
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

      {/* Quick keywords */}
      <div className="flex flex-wrap gap-1.5">
        {["SECRET", "CIPHER", "KEYWORD", "ZEBRAS", "CRYPTO"].map((k) => (
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
