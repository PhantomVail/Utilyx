import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

function encodeEntities(text: string, mode: "named" | "numeric" | "hex"): string {
  const named: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;",
    "¥": "&yen;", "—": "&mdash;", "–": "&ndash;", "…": "&hellip;",
    "×": "&times;", "÷": "&divide;", "±": "&plusmn;", "≠": "&ne;",
    "≤": "&le;", "≥": "&ge;", "∞": "&infin;", "°": "&deg;",
    " ": "&nbsp;",
  };

  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code <= 127 && !named[ch]) return ch;
      if (mode === "named" && named[ch]) return named[ch];
      if (mode === "hex") return `&#x${code.toString(16).toUpperCase()};`;
      return `&#${code};`;
    })
    .join("");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&copy;/g, "©").replace(/&reg;/g, "®").replace(/&trade;/g, "™")
    .replace(/&euro;/g, "€").replace(/&pound;/g, "£").replace(/&yen;/g, "¥")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&hellip;/g, "…")
    .replace(/&times;/g, "×").replace(/&divide;/g, "÷").replace(/&plusmn;/g, "±")
    .replace(/&ne;/g, "≠").replace(/&le;/g, "≤").replace(/&ge;/g, "≥")
    .replace(/&infin;/g, "∞").replace(/&deg;/g, "°")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

export function HtmlEntityTool() {
  const [input, setInput] = useState('<div class="hello">Price: €29 — 50% off © 2025</div>');
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [mode, setMode] = useState<"named" | "numeric" | "hex">("named");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (direction === "encode") return encodeEntities(input, mode);
    return decodeEntities(input);
  }, [input, direction, mode]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">
            Direction
          </label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["encode", "decode"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  direction === d
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        {direction === "encode" && (
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">
              Mode
            </label>
            <div className="flex bg-secondary rounded-lg overflow-hidden">
              {(["named", "numeric", "hex"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    mode === m
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-28 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          spellCheck={false}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Output
          </label>
          <button
            onClick={copy}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap min-h-[7rem]">
          {output}
        </pre>
      </div>
    </div>
  );
}
