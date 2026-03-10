import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = h / 360;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), s, v];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}


function SatBrightCanvas({
  hue, sat, bright, onChange
}: {
  hue: number; sat: number; bright: number;
  onChange: (s: number, v: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const lw = rect.width;
    const lh = rect.height;

    const [r, g, b] = hsvToRgb(hue, 1, 1);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, lw, lh);

    const whiteGrad = ctx.createLinearGradient(0, 0, lw, 0);
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, lw, lh);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, lh);
    blackGrad.addColorStop(0, "rgba(0,0,0,0)");
    blackGrad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, lw, lh);

    const x = sat * lw;
    const y = (1 - bright) * lh;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hue, sat, bright]);

  useEffect(() => { draw(); }, [draw]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    onChange(s, v);
  }, [onChange]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg cursor-crosshair border border-border"
      style={{ aspectRatio: "280/180" }}
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); handlePointer(e); }}
      onPointerMove={(e) => { if (dragging.current) handlePointer(e); }}
      onPointerUp={() => { dragging.current = false; }}
    />
  );
}

function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    onChange(h);
  }, [onChange]);

  const percent = (hue / 360) * 100;

  return (
    <div
      ref={trackRef}
      className="relative h-4 rounded-full cursor-pointer border border-border"
      style={{
        background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); handlePointer(e); }}
      onPointerMove={(e) => { if (dragging.current) handlePointer(e); }}
      onPointerUp={() => { dragging.current = false; }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-foreground shadow-lg"
        style={{ left: `${percent}%`, backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      />
    </div>
  );
}

function AlphaSlider({ alpha, color, onChange }: { alpha: number; color: string; onChange: (a: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const a = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(Math.round(a * 100) / 100);
  }, [onChange]);

  return (
    <div
      ref={trackRef}
      className="relative h-4 rounded-full cursor-pointer border border-border"
      style={{
        background: `linear-gradient(to right, transparent, ${color}), repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--surface)) 0% 50%) 0 0 / 8px 8px`,
      }}
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); handlePointer(e); }}
      onPointerMove={(e) => { if (dragging.current) handlePointer(e); }}
      onPointerUp={() => { dragging.current = false; }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-foreground shadow-lg"
        style={{ left: `${alpha * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}


function ColorRow({ label, value }: { label: string; value: string }) {
  const { CopyButton } = useCopyToClipboard();
  return (
    <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest w-10 shrink-0">{label}</span>
      <code className="flex-1 font-mono text-sm text-foreground truncate">{value}</code>
      <CopyButton text={value} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
    </div>
  );
}


export function ColorConverter() {
  const [hsv, setHsv] = useState<[number, number, number]>([145, 0.75, 0.77]);
  const [alpha, setAlpha] = useState(1);
  const [hexInput, setHexInput] = useState("#22c55e");

  const rgb = useMemo(() => hsvToRgb(hsv[0], hsv[1], hsv[2]), [hsv]);
  const hex = useMemo(() => rgbToHex(...rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(...rgb), [rgb]);

  // Sync hex input display
  useEffect(() => { setHexInput(hex); }, [hex]);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      setHsv(rgbToHsv(...parsed));
    }
  };

  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const rgbaStr = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  const hslStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  const cssVar = `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex sm:flex-col gap-3 shrink-0">
          <div
            className="w-20 h-20 rounded-lg border border-border glow-border"
            style={{ backgroundColor: alpha < 1 ? rgbaStr : hex }}
          />
          <div
            className="w-20 h-6 rounded border border-border"
            style={{
              background: `repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--surface)) 0% 50%) 0 0 / 8px 8px`,
            }}
          >
            <div className="w-full h-full rounded" style={{ backgroundColor: rgbaStr }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <SatBrightCanvas
            hue={hsv[0]}
            sat={hsv[1]}
            bright={hsv[2]}
            onChange={(s, v) => setHsv([hsv[0], s, v])}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Hue</label>
          <HueSlider hue={hsv[0]} onChange={(h) => setHsv([h, hsv[1], hsv[2]])} />
        </div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Opacity</label>
          <AlphaSlider alpha={alpha} color={hex} onChange={setAlpha} />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Hex</label>
        <input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="#000000"
          spellCheck={false}
        />
      </div>

      <div className="grid gap-2">
        <ColorRow label="HEX" value={hex} />
        <ColorRow label="RGB" value={rgbStr} />
        {alpha < 1 && <ColorRow label="RGBA" value={rgbaStr} />}
        <ColorRow label="HSL" value={hslStr} />
        <ColorRow label="CSS" value={cssVar} />
      </div>
    </div>
  );
}
