import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { NumberStepper } from "./NumberStepper";

interface Ratio {
  w: number;
  h: number;
  label: string;
}

const PRESETS: Ratio[] = [
  { w: 1, h: 1, label: "1:1 Square" },
  { w: 4, h: 3, label: "4:3 Standard" },
  { w: 16, h: 9, label: "16:9 Widescreen" },
  { w: 21, h: 9, label: "21:9 Ultrawide" },
  { w: 3, h: 2, label: "3:2 Photo" },
  { w: 9, h: 16, label: "9:16 Story" },
  { w: 2, h: 3, label: "2:3 Portrait" },
  { w: 1, h: 1.414, label: "A4 Paper" },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(w: number, h: number): [number, number] {
  const d = gcd(w, h);
  return d > 0 ? [w / d, h / d] : [w, h];
}

export function AspectRatioTool() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const ratio = useMemo(() => simplify(width, height), [width, height]);
  const decimal = height > 0 ? (width / height).toFixed(4) : "—";

  const handleWidthChange = (w: number) => {
    if (lockRatio && height > 0) {
      const r = width / height;
      setWidth(w);
      setHeight(Math.round(w / r));
    } else {
      setWidth(w);
    }
  };

  const handleHeightChange = (h: number) => {
    if (lockRatio && width > 0) {
      const r = width / height;
      setHeight(h);
      setWidth(Math.round(h * r));
    } else {
      setHeight(h);
    }
  };

  const applyPreset = (p: Ratio) => {
    const scale = Math.max(Math.round(width / p.w), 1);
    setWidth(p.w * scale);
    setHeight(Math.round(p.h * scale));
  };

  const resolutions = useMemo(() => {
    if (ratio[0] === 0 || ratio[1] === 0) return [];
    const results: { w: number; h: number }[] = [];
    for (let mult = 1; mult < 200; mult++) {
      const w = ratio[0] * mult;
      const h = ratio[1] * mult;
      if (w >= 320 && h >= 240 && w <= 7680) {
        results.push({ w, h });
      }
      if (results.length >= 8) break;
    }
    return results;
  }, [ratio]);

  const maxPreview = 200;
  const previewScale = Math.min(maxPreview / width, maxPreview / height, 1);
  const previewW = Math.max(20, width * previewScale);
  const previewH = Math.max(20, height * previewScale);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Inputs */}
      <div className="flex gap-3 flex-wrap items-end">
        <NumberStepper label="Width" value={width} onChange={handleWidthChange} min={1} max={7680} step={10} width="w-28" />
        <button
          onClick={() => setLockRatio(!lockRatio)}
          className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors ${
            lockRatio
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {lockRatio ? "🔒 Locked" : "🔓 Free"}
        </button>
        <NumberStepper label="Height" value={height} onChange={handleHeightChange} min={1} max={7680} step={10} width="w-28" />
        <button
          onClick={() => { const t = width; setWidth(height); setHeight(t); }}
          className="px-3 py-2.5 text-xs font-medium rounded-lg bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors"
        >
          ↔ Swap
        </button>
      </div>

      {/* Results */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1.5">
          {[
            { label: "Ratio", value: `${ratio[0]}:${ratio[1]}` },
            { label: "Decimal", value: decimal },
            { label: "Pixels", value: `${(width * height).toLocaleString()} px` },
            { label: "Megapixels", value: `${((width * height) / 1e6).toFixed(2)} MP` },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-20 shrink-0">{r.label}</span>
              <code className="flex-1 font-mono text-sm text-foreground">{r.value}</code>
              <CopyButton text={r.value} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Visual preview */}
        <div className="flex items-center justify-center bg-surface border border-border rounded-lg p-4" style={{ minWidth: 120, minHeight: 120 }}>
          <div
            className="border-2 border-primary/40 rounded-md bg-primary/5 flex items-center justify-center"
            style={{ width: previewW, height: previewH }}
          >
            <span className="text-[10px] font-mono text-primary/60">{ratio[0]}:{ratio[1]}</span>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">Presets</label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Common resolutions */}
      {resolutions.length > 0 && (
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Resolutions at {ratio[0]}:{ratio[1]}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {resolutions.map((r) => (
              <button
                key={`${r.w}x${r.h}`}
                onClick={() => { setWidth(r.w); setHeight(r.h); }}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                  r.w === width && r.h === height
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {r.w}×{r.h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
