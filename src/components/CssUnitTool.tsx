import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { NumberStepper } from "./NumberStepper";

const UNITS = ["px", "rem", "em", "pt", "%", "vw", "vh"] as const;
type Unit = typeof UNITS[number];

function convert(value: number, from: Unit, to: Unit, basePx: number, viewportW: number, viewportH: number, parentPx: number): number | null {
  let px: number;
  switch (from) {
    case "px": px = value; break;
    case "rem": px = value * basePx; break;
    case "em": px = value * parentPx; break;
    case "pt": px = value * (96 / 72); break;
    case "%": px = (value / 100) * parentPx; break;
    case "vw": px = (value / 100) * viewportW; break;
    case "vh": px = (value / 100) * viewportH; break;
    default: return null;
  }
  switch (to) {
    case "px": return px;
    case "rem": return px / basePx;
    case "em": return px / parentPx;
    case "pt": return px * (72 / 96);
    case "%": return (px / parentPx) * 100;
    case "vw": return (px / viewportW) * 100;
    case "vh": return (px / viewportH) * 100;
    default: return null;
  }
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export function CssUnitTool() {
  const [input, setInput] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [basePx, setBasePx] = useState(16);
  const [parentPx, setParentPx] = useState(16);
  const [viewportW, setViewportW] = useState(1920);
  const [viewportH, setViewportH] = useState(1080);
  const { CopyButton } = useCopyToClipboard();

  const results = useMemo(() => {
    const v = parseFloat(input);
    if (isNaN(v)) return null;
    return UNITS.filter((u) => u !== fromUnit).map((u) => {
      const result = convert(v, fromUnit, u, basePx, viewportW, viewportH, parentPx);
      return { unit: u, value: result !== null ? fmt(result) : "—" };
    });
  }, [input, fromUnit, basePx, parentPx, viewportW, viewportH]);

  const presets = [
    { label: "12px", v: "12", u: "px" as Unit },
    { label: "14px", v: "14", u: "px" as Unit },
    { label: "16px", v: "16", u: "px" as Unit },
    { label: "1rem", v: "1", u: "rem" as Unit },
    { label: "1.5rem", v: "1.5", u: "rem" as Unit },
    { label: "100%", v: "100", u: "%" as Unit },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Value
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="16"
            spellCheck={false}
          />
        </div>
        <div className="shrink-0">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Unit
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {UNITS.map((u) => (
              <button
                key={u}
                onClick={() => setFromUnit(u)}
                className={`px-2.5 py-2.5 text-xs font-medium transition-colors ${
                  fromUnit === u
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NumberStepper label="Root font-size" value={basePx} onChange={setBasePx} min={1} max={100} width="w-full" />
        <NumberStepper label="Parent font-size" value={parentPx} onChange={setParentPx} min={1} max={200} width="w-full" />
        <NumberStepper label="Viewport W" value={viewportW} onChange={setViewportW} min={320} max={7680} step={10} width="w-full" />
        <NumberStepper label="Viewport H" value={viewportH} onChange={setViewportH} min={240} max={4320} step={10} width="w-full" />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => { setInput(p.v); setFromUnit(p.u); }}
            className="px-3 py-1.5 text-xs font-mono bg-secondary text-muted-foreground rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-1.5">
          {results.map((r) => (
            <div
              key={r.unit}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group"
            >
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-12 shrink-0">
                {r.unit}
              </span>
              <code className="flex-1 font-mono text-sm text-foreground">
                {r.value}<span className="text-muted-foreground">{r.unit}</span>
              </code>
              <CopyButton
                text={`${r.value}${r.unit}`}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
