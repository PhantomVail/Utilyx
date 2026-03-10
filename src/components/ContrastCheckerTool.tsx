import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { MiniColorPicker } from "./MiniColorPicker";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface WCAGResult {
  ratio: number;
  aaSmall: boolean; aaLarge: boolean;
  aaaSmall: boolean; aaaLarge: boolean;
}

const PRESETS: { label: string; fg: string; bg: string }[] = [
  { label: "Black / White", fg: "#000000", bg: "#ffffff" },
  { label: "Navy / Cream", fg: "#1a1a2e", bg: "#f5f0e8" },
  { label: "Green / Dark", fg: "#00ff88", bg: "#0a0a0a" },
  { label: "Red / White", fg: "#dc2626", bg: "#ffffff" },
  { label: "Blue / Yellow", fg: "#1e40af", bg: "#fef08a" },
  { label: "Gray / Gray", fg: "#6b7280", bg: "#f3f4f6" },
];

export function ContrastCheckerTool() {
  const [fg, setFg] = useState("#1a1a2e");
  const [bg, setBg] = useState("#f5f0e8");
  const [showFgPicker, setShowFgPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const result = useMemo<WCAGResult | null>(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const l1 = luminance(...fgRgb);
    const l2 = luminance(...bgRgb);
    const ratio = contrastRatio(l1, l2);
    return {
      ratio,
      aaSmall: ratio >= 4.5, aaLarge: ratio >= 3,
      aaaSmall: ratio >= 7, aaaLarge: ratio >= 4.5,
    };
  }, [fg, bg]);

  const swap = () => { setFg(bg); setBg(fg); };

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <div className={`px-3 py-2 rounded-lg text-xs font-medium text-center ${pass ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
      <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
      {pass ? "PASS" : "FAIL"}
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        
        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Foreground</label>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-2 py-1.5">
            <button
              onClick={() => { setShowFgPicker(!showFgPicker); setShowBgPicker(false); }}
              className="w-7 h-7 rounded border border-border cursor-pointer shrink-0"
              style={{ backgroundColor: fg }}
            />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)}
              className="w-20 font-mono text-xs text-foreground bg-transparent focus:outline-none" />
          </div>
          {showFgPicker && (
            <div className="absolute top-full left-0 mt-2 z-20 bg-surface border border-border rounded-lg p-3 shadow-lg">
              <MiniColorPicker color={fg} onChange={setFg} />
            </div>
          )}
        </div>

        <button onClick={swap}
          className="px-3 py-2 bg-secondary text-muted-foreground hover:text-foreground rounded-lg text-xs font-medium transition-colors">
          ⇄ Swap
        </button>

        
        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Background</label>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-2 py-1.5">
            <button
              onClick={() => { setShowBgPicker(!showBgPicker); setShowFgPicker(false); }}
              className="w-7 h-7 rounded border border-border cursor-pointer shrink-0"
              style={{ backgroundColor: bg }}
            />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)}
              className="w-20 font-mono text-xs text-foreground bg-transparent focus:outline-none" />
          </div>
          {showBgPicker && (
            <div className="absolute top-full left-0 mt-2 z-20 bg-surface border border-border rounded-lg p-3 shadow-lg">
              <MiniColorPicker color={bg} onChange={setBg} />
            </div>
          )}
        </div>
      </div>

      
      {(showFgPicker || showBgPicker) && (
        <div className="fixed inset-0 z-10" onClick={() => { setShowFgPicker(false); setShowBgPicker(false); }} />
      )}

      
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Presets</label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setFg(p.fg); setBg(p.bg); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: p.fg }} />
              <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: p.bg }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="p-6" style={{ backgroundColor: bg, color: fg }}>
          <h3 className="text-2xl font-bold mb-2">Heading Text</h3>
          <p className="text-base mb-1">Normal body text — 16px regular weight paragraph for readability testing.</p>
          <p className="text-sm">Small text — 14px used for captions, labels, and secondary content.</p>
          <p className="text-xs mt-2 opacity-80">Tiny text — 12px fine print, footnotes, timestamps.</p>
        </div>
      </div>

      
      {result && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground font-mono">{result.ratio.toFixed(2)}:1</div>
              <div className="text-xs text-muted-foreground mt-0.5">Contrast Ratio</div>
            </div>
            <CopyButton text={`Contrast: ${result.ratio.toFixed(2)}:1 | FG: ${fg} | BG: ${bg}`} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Badge pass={result.aaSmall} label="AA Small" />
            <Badge pass={result.aaLarge} label="AA Large" />
            <Badge pass={result.aaaSmall} label="AAA Small" />
            <Badge pass={result.aaaLarge} label="AAA Large" />
          </div>

          <div className="text-[10px] text-muted-foreground space-y-0.5">
            <p>AA Small: ≥ 4.5:1 · AA Large: ≥ 3:1 · AAA Small: ≥ 7:1 · AAA Large: ≥ 4.5:1</p>
            <p>Large text = 18px+ bold or 24px+ regular</p>
          </div>
        </>
      )}
    </div>
  );
}
