import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { MiniColorPicker } from "./MiniColorPicker";
import { RefreshCw } from "lucide-react";

interface ColorInfo {
  hex: string;
  name: string;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#000000" : "#ffffff";
}

type Harmony = "complementary" | "analogous" | "triadic" | "split" | "tetradic" | "monochromatic";

function generatePalette(hex: string, harmony: Harmony): ColorInfo[] {
  const [h, s, l] = hexToHSL(hex);
  const wrap = (deg: number) => ((deg % 360) + 360) % 360;
  const pairs: [number, number, number][] = [];

  switch (harmony) {
    case "complementary": pairs.push([h, s, l], [wrap(h + 180), s, l]); break;
    case "analogous": pairs.push([wrap(h - 30), s, l], [h, s, l], [wrap(h + 30), s, l]); break;
    case "triadic": pairs.push([h, s, l], [wrap(h + 120), s, l], [wrap(h + 240), s, l]); break;
    case "split": pairs.push([h, s, l], [wrap(h + 150), s, l], [wrap(h + 210), s, l]); break;
    case "tetradic": pairs.push([h, s, l], [wrap(h + 90), s, l], [wrap(h + 180), s, l], [wrap(h + 270), s, l]); break;
    case "monochromatic":
      for (let i = 0; i < 5; i++) pairs.push([h, s, Math.max(10, Math.min(90, l - 30 + i * 15))]);
      break;
  }

  return pairs.map(([ph, ps, pl]) => ({
    hex: hslToHex(ph, ps, pl),
    name: `H:${ph} S:${ps}% L:${pl}%`,
  }));
}

function generateShades(hex: string): ColorInfo[] {
  const [h, s] = hexToHSL(hex);
  return [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((l) => ({
    hex: hslToHex(h, s, l),
    name: `${l}%`,
  }));
}

const HARMONIES: { id: Harmony; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split", label: "Split Comp." },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochromatic", label: "Monochrome" },
];

export function PaletteTool() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [harmony, setHarmony] = useState<Harmony>("analogous");
  const [showPicker, setShowPicker] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const palette = useMemo(() => generatePalette(baseColor, harmony), [baseColor, harmony]);
  const shades = useMemo(() => generateShades(baseColor), [baseColor]);

  const cssVars = palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n");
  const tailwind = palette.map((c) => `"${c.hex}"`).join(", ");

  const randomize = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 50 + Math.floor(Math.random() * 40);
    const l = 40 + Math.floor(Math.random() * 25);
    setBaseColor(hslToHex(h, s, l));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="flex gap-3 flex-wrap items-end">
        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Base Color
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border hover:bg-surface-hover transition-colors"
            >
              <div className="w-6 h-6 rounded border border-border" style={{ background: baseColor }} />
              <span className="font-mono text-xs text-muted-foreground">{baseColor}</span>
            </button>
            <button
              onClick={randomize}
              className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors border border-border"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          {showPicker && (
            <div className="absolute z-20 top-full mt-1 bg-surface border border-border rounded-lg p-3 shadow-lg">
              <MiniColorPicker color={baseColor} onChange={setBaseColor} />
            </div>
          )}
        </div>
      </div>

      
      <div className="flex flex-wrap gap-1.5">
        {HARMONIES.map((h) => (
          <button
            key={h.id}
            onClick={() => setHarmony(h.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              harmony === h.id
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Palette
        </label>
        <div className="flex rounded-xl overflow-hidden border border-border" style={{ height: 100 }}>
          {palette.map((c, i) => (
            <div
              key={i}
              className="flex-1 flex items-end justify-center pb-2 cursor-pointer hover:opacity-90 transition-opacity group relative"
              style={{ background: c.hex }}
              onClick={() => navigator.clipboard.writeText(c.hex)}
            >
              <span
                className="text-[10px] font-mono font-medium opacity-80 group-hover:opacity-100"
                style={{ color: getContrastColor(c.hex) }}
              >
                {c.hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Shades
        </label>
        <div className="flex rounded-xl overflow-hidden border border-border" style={{ height: 60 }}>
          {shades.map((c, i) => (
            <div
              key={i}
              className="flex-1 flex items-end justify-center pb-1 cursor-pointer hover:opacity-90 transition-opacity group"
              style={{ background: c.hex }}
              onClick={() => navigator.clipboard.writeText(c.hex)}
            >
              <span
                className="text-[8px] font-mono opacity-0 group-hover:opacity-100"
                style={{ color: getContrastColor(c.hex) }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">CSS Variables</label>
          <CopyButton text={`:root {\n${cssVars}\n}`} />
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-foreground overflow-x-auto">
{`:root {
${cssVars}
}`}
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Tailwind Config</label>
          <CopyButton text={`colors: [${tailwind}]`} />
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-foreground overflow-x-auto">
          colors: [{tailwind}]
        </div>
      </div>
    </div>
  );
}
