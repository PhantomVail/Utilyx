import { useRef, useCallback, useEffect, useState } from "react";
import { hsvToRgb, rgbToHsv, hexToRgb, rgbToHex } from "../lib/colorUtils";

interface MiniColorPickerProps {
  color: string; // hex
  onChange: (hex: string) => void;
}

function SatBrightMini({ hue, sat, bright, onChange }: {
  hue: number; sat: number; bright: number; onChange: (s: number, v: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  const draw = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const lw = rect.width;
    const lh = rect.height;

    const [r, g, b] = hsvToRgb(hue, 1, 1);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, lw, lh);
    const wg = ctx.createLinearGradient(0, 0, lw, 0);
    wg.addColorStop(0, "rgba(255,255,255,1)");
    wg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, lw, lh);
    const bg = ctx.createLinearGradient(0, 0, 0, lh);
    bg.addColorStop(0, "rgba(0,0,0,0)");
    bg.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, lw, lh);

    ctx.beginPath();
    ctx.arc(sat * lw, (1 - bright) * lh, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sat * lw, (1 - bright) * lh, 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hue, sat, bright]);

  useEffect(() => { draw(); }, [draw]);

  const handle = useCallback((e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    onChange(s, v);
  }, [onChange]);

  return (
    <canvas ref={ref}
      className="w-full rounded cursor-crosshair border border-border"
      style={{ aspectRatio: "160/100" }}
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); handle(e); }}
      onPointerMove={(e) => { if (dragging.current) handle(e); }}
      onPointerUp={() => { dragging.current = false; }}
    />
  );
}

function HueMini({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const handle = useCallback((e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    onChange(Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360)));
  }, [onChange]);

  return (
    <div ref={ref}
      className="relative h-3 rounded-full cursor-pointer border border-border"
      style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); handle(e); }}
      onPointerMove={(e) => { if (dragging.current) handle(e); }}
      onPointerUp={() => { dragging.current = false; }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-foreground shadow"
        style={{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue}, 100%, 50%)` }} />
    </div>
  );
}

export function MiniColorPicker({ color, onChange }: MiniColorPickerProps) {
  const rgb = hexToRgb(color) || [0, 0, 0];
  const [h, s, v] = rgbToHsv(...rgb);
  const [hue, setHue] = useState(h);
  const [hexInput, setHexInput] = useState(color);

  // Sync hue when color changes externally
  useEffect(() => {
    const parsed = hexToRgb(color);
    if (parsed) {
      const [newH] = rgbToHsv(...parsed);
      if (newH !== 0 || s === 0) setHue(newH);
      setHexInput(color);
    }
  }, [color]);

  const handleSV = (ns: number, nv: number) => {
    const [r, g, b] = hsvToRgb(hue, ns, nv);
    onChange(rgbToHex(r, g, b));
  };

  const handleHue = (nh: number) => {
    setHue(nh);
    const [r, g, b] = hsvToRgb(nh, s, v);
    onChange(rgbToHex(r, g, b));
  };

  const handleHexInput = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) onChange(rgbToHex(...parsed));
  };

  return (
    <div className="space-y-2 w-48">
      <SatBrightMini hue={hue} sat={s} bright={v} onChange={handleSV} />
      <HueMini hue={hue} onChange={handleHue} />
      <input
        value={hexInput}
        onChange={(e) => handleHexInput(e.target.value)}
        className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        spellCheck={false}
      />
    </div>
  );
}
