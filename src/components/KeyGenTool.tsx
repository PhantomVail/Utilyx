import { useState, useCallback } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { NumberStepper } from "./NumberStepper";
import { RefreshCw, Download, Eye, EyeOff } from "lucide-react";

type Charset = "base64" | "hex" | "alpha" | "alphanum" | "numeric" | "symbols" | "custom";
type Difficulty = "easy" | "medium" | "hard" | "extreme";

const CHARSETS: Record<Exclude<Charset, "custom">, string> = {
  base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  hex: "0123456789abcdef",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  alphanum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  numeric: "0123456789",
  symbols: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?",
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; minLen: number; maxLen: number; defaultLen: number; charset: Charset }> = {
  easy: { label: "Easy", minLen: 8, maxLen: 16, defaultLen: 12, charset: "alphanum" },
  medium: { label: "Medium", minLen: 16, maxLen: 32, defaultLen: 24, charset: "alphanum" },
  hard: { label: "Hard", minLen: 32, maxLen: 64, defaultLen: 48, charset: "base64" },
  extreme: { label: "Extreme", minLen: 64, maxLen: 128, defaultLen: 96, charset: "symbols" },
};

const CHARSET_OPTIONS: { id: Charset; label: string }[] = [
  { id: "base64", label: "Base64" },
  { id: "hex", label: "Hex" },
  { id: "alpha", label: "Alpha" },
  { id: "alphanum", label: "Alphanum" },
  { id: "numeric", label: "Numeric" },
  { id: "symbols", label: "Symbols" },
  { id: "custom", label: "Custom" },
];

function generateUnbiased(length: number, chars: string): string {
  const result: string[] = [];
  const max = Math.floor(0xFFFFFFFF / chars.length) * chars.length;
  while (result.length < length) {
    const arr = new Uint32Array(length * 2);
    crypto.getRandomValues(arr);
    for (const v of arr) {
      if (v < max) result.push(chars[v % chars.length]);
      if (result.length === length) break;
    }
  }
  return result.join("");
}

function generateKey(length: number, chars: string): string {
  return generateUnbiased(length, chars);
}

export function KeyGenTool() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [charset, setCharset] = useState<Charset>("alphanum");
  const [customChars, setCustomChars] = useState("ABCDEFabcdef0123456789");
  const [keyLength, setKeyLength] = useState(24);
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [separator, setSeparator] = useState("-");
  const [chunkSize, setChunkSize] = useState(0);
  const [includeSecret, setIncludeSecret] = useState(false);
  const [secretLength, setSecretLength] = useState(32);
  const [secretSeparator, setSecretSeparator] = useState(".");
  const [revealSecrets, setRevealSecrets] = useState(false);
  const [keys, setKeys] = useState<{ key: string; secret?: string }[]>([]);
  const { CopyButton } = useCopyToClipboard();

  const activeChars = charset === "custom" ? customChars : CHARSETS[charset];

  const generate = useCallback(() => {
    const result: { key: string; secret?: string }[] = [];
    for (let i = 0; i < count; i++) {
      let raw = generateKey(keyLength, activeChars);
      if (chunkSize > 0 && separator) {
        raw = raw.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.join(separator) ?? raw;
      }
      const key = `${prefix}${raw}${suffix}`;
      const secret = includeSecret ? generateKey(secretLength, CHARSETS.base64) : undefined;
      result.push({ key, secret });
    }
    setKeys(result);
  }, [count, keyLength, activeChars, prefix, suffix, separator, chunkSize, includeSecret, secretLength]);

  const applyDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    const cfg = DIFFICULTY_CONFIG[d];
    setKeyLength(cfg.defaultLen);
    setCharset(cfg.charset);
  };

  const output = keys.map((k) =>
    includeSecret && k.secret ? `${k.key}${secretSeparator}${k.secret}` : k.key
  ).join("\n");

  const maskedOutput = keys.map((k) =>
    includeSecret && k.secret
      ? `${k.key}${secretSeparator}${"•".repeat(Math.min(k.secret.length, 20))}…`
      : k.key
  ).join("\n");

  const downloadKeys = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keys-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Difficulty Preset</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
            <button key={d} onClick={() => applyDifficulty(d)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${difficulty === d ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {DIFFICULTY_CONFIG[d].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Character Set</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {CHARSET_OPTIONS.map((c) => (
            <button key={c.id} onClick={() => setCharset(c.id)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${charset === c.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {c.label}
            </button>
          ))}
        </div>
        {charset === "custom" && (
          <input type="text" value={customChars} onChange={(e) => setCustomChars(e.target.value)}
            placeholder="Enter custom characters…"
            className="mt-2 w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        )}
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <NumberStepper label="Key Length" value={keyLength} onChange={setKeyLength} min={4} max={256} />
        <NumberStepper label="Count" value={count} onChange={setCount} min={1} max={999999} />
        <NumberStepper label="Chunk Size" value={chunkSize} onChange={setChunkSize} min={0} max={64} />
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Prefix</label>
          <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. gsk_"
            className="w-28 bg-surface border border-border rounded-lg px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Suffix</label>
          <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g. _prod"
            className="w-28 bg-surface border border-border rounded-lg px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Separator</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {[{ v: "-", l: "Dash" }, { v: "_", l: "Under" }, { v: ".", l: "Dot" }, { v: "", l: "None" }].map((s) => (
              <button key={s.l} onClick={() => setSeparator(s.v)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${separator === s.v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Include Secret</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Append a separate secret portion to each key (e.g. key.secret)</div>
          </div>
          <button onClick={() => setIncludeSecret(!includeSecret)}
            className={`w-10 h-5 rounded-full transition-colors relative ${includeSecret ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${includeSecret ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
        {includeSecret && (
          <div className="flex gap-3 flex-wrap items-end pt-1 border-t border-border">
            <NumberStepper label="Secret Length" value={secretLength} onChange={setSecretLength} min={8} max={256} />
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Key·Secret Sep</label>
              <div className="flex bg-secondary rounded-lg overflow-hidden">
                {[{ v: ".", l: "Dot" }, { v: ":", l: "Colon" }, { v: "_", l: "Under" }, { v: "-", l: "Dash" }].map((s) => (
                  <button key={s.l} onClick={() => setSecretSeparator(s.v)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${secretSeparator === s.v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Live Preview</label>
        <div className="bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-xs text-foreground break-all">
          {(() => {
            let sample = generateKey(keyLength, activeChars);
            if (chunkSize > 0 && separator) {
              sample = sample.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.join(separator) ?? sample;
            }
            const full = `${prefix}${sample}${suffix}`;
            if (includeSecret) {
              return `${full}${secretSeparator}${generateKey(secretLength, CHARSETS.base64)}`;
            }
            return full;
          })()}
        </div>
        <div className="flex gap-2 mt-1.5 text-[10px] text-muted-foreground font-mono">
          <span>{activeChars.length} unique chars</span>
          <span>·</span>
          <span>{keyLength} length</span>
          <span>·</span>
          <span>~{(Math.log2(activeChars.length) * keyLength).toFixed(0)} bits entropy</span>
          {includeSecret && (
            <>
              <span>·</span>
              <span>+{secretLength} secret ({(Math.log2(64) * secretLength).toFixed(0)} bits)</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <RefreshCw size={14} />
          Generate {count.toLocaleString()} Key{count > 1 ? "s" : ""}
        </button>
        {keys.length > 0 && (
          <>
            <button onClick={downloadKeys}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2">
              <Download size={14} />
              Download .txt
            </button>
            {includeSecret && (
              <button onClick={() => setRevealSecrets(!revealSecrets)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2">
                {revealSecrets ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealSecrets ? "Hide" : "Reveal"} Secrets
              </button>
            )}
          </>
        )}
      </div>

      {keys.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Output — {keys.length.toLocaleString()} key{keys.length > 1 ? "s" : ""}
            </span>
            <CopyButton text={output} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto max-h-[400px] whitespace-pre-wrap leading-relaxed">
            {(() => {
              const display = includeSecret && !revealSecrets ? maskedOutput : output;
              const lines = display.split("\n");
              return lines.length > 500
                ? lines.slice(0, 500).join("\n") + `\n\n… and ${lines.length - 500} more (download for full list)`
                : display;
            })()}
          </pre>
        </div>
      )}
    </div>
  );
}
