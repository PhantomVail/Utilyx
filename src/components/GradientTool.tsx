import { useState, useMemo } from "react";
import { Plus, Trash2, Copy, Check, RotateCw } from "lucide-react";
import { MiniColorPicker } from "./MiniColorPicker";
import { NumberStepper } from "./NumberStepper";
import { CustomSlider } from "./CustomSlider";

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

let stopCounter = 0;
const newStopId = () => `stop_${++stopCounter}`;

type GradientType = "linear" | "radial" | "conic";

const PRESETS: { name: string; stops: { color: string; position: number }[]; angle?: number }[] = [
  { name: "Sunset", stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }] },
  { name: "Ocean", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] },
  { name: "Forest", stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }] },
  { name: "Fire", stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }] },
  { name: "Midnight", stops: [{ color: "#0f0c29", position: 0 }, { color: "#302b63", position: 50 }, { color: "#24243e", position: 100 }] },
  { name: "Cotton Candy", stops: [{ color: "#ffecd2", position: 0 }, { color: "#fcb69f", position: 100 }] },
  { name: "Aurora", stops: [{ color: "#00d2ff", position: 0 }, { color: "#928dab", position: 50 }, { color: "#3a7bd5", position: 100 }] },
  { name: "Neon", stops: [{ color: "#ff00ff", position: 0 }, { color: "#00ffff", position: 50 }, { color: "#ff00ff", position: 100 }] },
];

export function GradientTool() {
  const [stops, setStops] = useState<GradientStop[]>([
    { id: newStopId(), color: "#f70a45", position: 0 },
    { id: newStopId(), color: "#00cec9", position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<GradientType>("linear");
  const [copied, setCopied] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops]);

  const cssValue = useMemo(() => {
    const colorStops = sortedStops.map(s => `${s.color} ${s.position}%`).join(", ");
    switch (type) {
      case "linear": return `linear-gradient(${angle}deg, ${colorStops})`;
      case "radial": return `radial-gradient(circle, ${colorStops})`;
      case "conic": return `conic-gradient(from ${angle}deg, ${colorStops})`;
    }
  }, [sortedStops, angle, type]);

  const fullCSS = `background: ${cssValue};`;

  const tailwindClass = useMemo(() => {
    if (type !== "linear" || stops.length !== 2) return "/* Use custom CSS for complex gradients */";
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const dirs: Record<number, string> = { 0: "to-t", 45: "to-tr", 90: "to-r", 135: "to-br", 180: "to-b", 225: "to-bl", 270: "to-l", 315: "to-tl" };
    const dir = dirs[angle] || `[${angle}deg]`;
    return `bg-gradient-${dir} from-[${sorted[0].color}] to-[${sorted[1].color}]`;
  }, [stops, angle, type]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const addStop = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    let pos = 50;
    if (sorted.length >= 2) {
      // Find largest gap
      let maxGap = 0, gapPos = 50;
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1].position - sorted[i].position;
        if (gap > maxGap) { maxGap = gap; gapPos = sorted[i].position + gap / 2; }
      }
      pos = Math.round(gapPos);
    }
    setStops([...stops, { id: newStopId(), color: "#ffffff", position: pos }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter(s => s.id !== id));
    if (pickerOpen === id) setPickerOpen(null);
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setStops(preset.stops.map(s => ({ ...s, id: newStopId() })));
    if (preset.angle !== undefined) setAngle(preset.angle);
  };

  const barGradient = `linear-gradient(90deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})`;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Preview */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ background: cssValue, height: 180 }} />

      {/* Gradient bar with draggable stops */}
      <div className="space-y-1">
        <div className="relative h-6 rounded-lg border border-border" style={{ background: barGradient }}>
          {stops.map(s => (
            <div
              key={s.id}
              className="absolute top-0 h-full flex flex-col items-center"
              style={{ left: `${s.position}%`, transform: "translateX(-50%)" }}
            >
              <button
                onClick={() => setPickerOpen(pickerOpen === s.id ? null : s.id)}
                className={`w-3 h-full rounded-sm border-2 cursor-pointer ${pickerOpen === s.id ? "border-primary" : "border-white"} shadow-md`}
                style={{ backgroundColor: s.color }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {stops.map(s => (
            <div key={s.id} className="relative">
              {pickerOpen === s.id && (
                <div className="absolute z-20 top-0 left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
                  <MiniColorPicker color={s.color} onChange={(c) => updateStop(s.id, { color: c })} />
                  <div className="flex items-center gap-1 mt-2">
                    <input value={s.color} onChange={(e) => updateStop(s.id, { color: e.target.value })}
                      className="w-20 bg-background border border-border rounded px-1.5 py-1 font-mono text-[10px] text-foreground" />
                    <NumberStepper label="" value={s.position} onChange={(v) => updateStop(s.id, { position: v })} min={0} max={100} step={1} width="w-10" />
                    <button onClick={() => removeStop(s.id)} disabled={stops.length <= 2}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-30 ml-1"><Trash2 size={11} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Type</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["linear", "radial", "conic"] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${type === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {(type === "linear" || type === "conic") && (
          <>
            <NumberStepper label="Angle°" value={angle} onChange={setAngle} min={0} max={360} step={15} width="w-12" />
            <button onClick={() => setAngle((angle + 45) % 360)}
              className="px-2.5 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border" title="Rotate 45°">
              <RotateCw size={14} />
            </button>
          </>
        )}
        <button onClick={addStop}
          className="px-2.5 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border flex items-center gap-1 text-xs">
          <Plus size={12} /> Add Stop
        </button>
      </div>

      {/* Presets */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Presets</label>
        <div className="flex gap-1.5 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => loadPreset(p)}
              className="w-10 h-6 rounded-md border border-border hover:ring-2 hover:ring-primary/30 transition-all"
              title={p.name}
              style={{ background: `linear-gradient(135deg, ${p.stops.map(s => `${s.color} ${s.position}%`).join(", ")})` }} />
          ))}
        </div>
      </div>

      {/* Stops list */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Color Stops</label>
        <div className="space-y-1">
          {sortedStops.map(s => (
            <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-surface">
              <button onClick={() => setPickerOpen(pickerOpen === s.id ? null : s.id)}
                className="w-6 h-6 rounded border border-border cursor-pointer shrink-0" style={{ backgroundColor: s.color }} />
              <input value={s.color} onChange={(e) => updateStop(s.id, { color: e.target.value })}
                className="w-20 bg-background border border-border rounded px-2 py-1 font-mono text-xs text-foreground" />
              <CustomSlider value={s.position} onChange={(v) => updateStop(s.id, { position: v })} min={0} max={100} step={1} width="flex-1" showValue={false} />
              <span className="text-xs text-muted-foreground w-8 text-right font-mono">{s.position}%</span>
              <button onClick={() => removeStop(s.id)} disabled={stops.length <= 2}
                className="text-muted-foreground hover:text-destructive disabled:opacity-30 shrink-0"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">CSS</span>
            <button onClick={() => copyText(fullCSS, "css")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {copied === "css" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
              {copied === "css" ? "Copied" : "Copy"}
            </button>
          </div>
          <code className="block text-xs font-mono text-foreground break-all">{fullCSS}</code>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Tailwind</span>
            <button onClick={() => copyText(tailwindClass, "tw")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {copied === "tw" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
              {copied === "tw" ? "Copied" : "Copy"}
            </button>
          </div>
          <code className="block text-xs font-mono text-foreground break-all">{tailwindClass}</code>
        </div>
      </div>
    </div>
  );
}
