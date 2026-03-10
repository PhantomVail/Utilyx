import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

type EscapeMode = "json" | "html" | "url" | "regex" | "sql" | "csv" | "cstring" | "xml";

const MODES: { id: EscapeMode; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "url", label: "URL" },
  { id: "regex", label: "Regex" },
  { id: "sql", label: "SQL" },
  { id: "csv", label: "CSV" },
  { id: "cstring", label: "C/JS String" },
  { id: "xml", label: "XML" },
];

function escapeStr(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json": return JSON.stringify(input).slice(1, -1);
    case "html": return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    case "url": return encodeURIComponent(input);
    case "regex": return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    case "sql": return input.replace(/'/g, "''").replace(/\\/g, "\\\\");
    case "csv": return input.includes(",") || input.includes('"') || input.includes("\n") ? `"${input.replace(/"/g, '""')}"` : input;
    case "cstring": return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\0/g, "\\0");
    case "xml": return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
}

function unescapeStr(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json": try { return JSON.parse(`"${input}"`); } catch { return input; }
    case "html": return input.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    case "url": try { return decodeURIComponent(input); } catch { return input; }
    case "regex": return input.replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
    case "sql": return input.replace(/''/g, "'").replace(/\\\\/g, "\\");
    case "csv": if (input.startsWith('"') && input.endsWith('"')) return input.slice(1, -1).replace(/""/g, '"'); return input;
    case "cstring": return input.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\0/g, "\0").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    case "xml": return input.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }
}

export function StringEscapeTool() {
  const [input, setInput] = useState('Hello "World"\nLine 2 <tag> & \'quote\'');
  const [mode, setMode] = useState<EscapeMode>("json");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");
  const { CopyButton } = useCopyToClipboard();

  const output = useMemo(() => {
    return direction === "escape" ? escapeStr(input, mode) : unescapeStr(input, mode);
  }, [input, mode, direction]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Format</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${mode === m.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Direction</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["escape", "unescape"] as const).map((d) => (
              <button key={d} onClick={() => setDirection(d)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${direction === d ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5 h-7">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Input</label>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5 h-7">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="w-full h-48 bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground overflow-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>

      <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
        <span>Input: {input.length} chars</span>
        <span>·</span>
        <span>Output: {output.length} chars</span>
        <span>·</span>
        <span>Δ {output.length - input.length > 0 ? "+" : ""}{output.length - input.length}</span>
      </div>
    </div>
  );
}
