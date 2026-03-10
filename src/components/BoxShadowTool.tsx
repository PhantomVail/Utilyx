import { useState } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { CustomSlider } from "./CustomSlider";
import { MiniColorPicker } from "./MiniColorPicker";
import { NumberStepper } from "./NumberStepper";
import { Plus, Trash2 } from "lucide-react";

interface Shadow {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

let nextId = 1;

function makeShadow(): Shadow {
  return { id: nextId++, x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 15, inset: false };
}

function shadowToCSS(s: Shadow): string {
  const r = parseInt(s.color.slice(1, 3), 16);
  const g = parseInt(s.color.slice(3, 5), 16);
  const b = parseInt(s.color.slice(5, 7), 16);
  const a = (s.opacity / 100).toFixed(2);
  return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(${r}, ${g}, ${b}, ${a})`;
}

export function BoxShadowTool() {
  const [shadows, setShadows] = useState<Shadow[]>([makeShadow()]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(12);
  const [showShadowPicker, setShowShadowPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showBoxPicker, setShowBoxPicker] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const cssValue = shadows.map(shadowToCSS).join(",\n    ");
  const fullCSS = `box-shadow:\n    ${cssValue};`;

  const active = shadows[activeIdx] || shadows[0];

  const update = (patch: Partial<Shadow>) => {
    setShadows((prev) =>
      prev.map((s, i) => (i === activeIdx ? { ...s, ...patch } : s))
    );
  };

  const addShadow = () => {
    const ns = makeShadow();
    setShadows((prev) => [...prev, ns]);
    setActiveIdx(shadows.length);
  };

  const removeShadow = (idx: number) => {
    if (shadows.length <= 1) return;
    setShadows((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => Math.min(prev, shadows.length - 2));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Preview */}
      <div
        className="rounded-xl border border-border overflow-hidden flex items-center justify-center"
        style={{ background: bgColor, minHeight: 220 }}
      >
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 transition-shadow duration-200"
          style={{
            background: boxColor,
            borderRadius: `${borderRadius}px`,
            boxShadow: shadows.map(shadowToCSS).join(", "),
          }}
        />
      </div>

      {/* Layer tabs */}
      <div className="flex gap-1.5 flex-wrap items-center">
        {shadows.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeIdx === i
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Layer {i + 1}
            {shadows.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); removeShadow(i); }}
                className="hover:text-destructive"
              >
                <Trash2 size={10} />
              </span>
            )}
          </button>
        ))}
        <button
          onClick={addShadow}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Controls */}
      {active && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface border border-border rounded-lg p-4">
          <CustomSlider label="Offset X" value={active.x} onChange={(v) => update({ x: v })} min={-50} max={50} />
          <CustomSlider label="Offset Y" value={active.y} onChange={(v) => update({ y: v })} min={-50} max={50} />
          <CustomSlider label="Blur" value={active.blur} onChange={(v) => update({ blur: v })} min={0} max={100} suffix="px" />
          <CustomSlider label="Spread" value={active.spread} onChange={(v) => update({ spread: v })} min={-50} max={50} suffix="px" />
          <CustomSlider label="Opacity" value={active.opacity} onChange={(v) => update({ opacity: v })} min={0} max={100} suffix="%" />

          <div className="flex items-end gap-3">
            <div className="relative">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Shadow Color</label>
              <button
                onClick={() => { setShowShadowPicker(!showShadowPicker); setShowBgPicker(false); setShowBoxPicker(false); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border hover:bg-surface-hover transition-colors"
              >
                <div className="w-5 h-5 rounded border border-border" style={{ background: active.color }} />
                <span className="font-mono text-xs text-muted-foreground">{active.color}</span>
              </button>
              {showShadowPicker && (
                <div className="absolute z-20 top-full mt-1 bg-surface border border-border rounded-lg p-3 shadow-lg">
                  <MiniColorPicker color={active.color} onChange={(hex) => update({ color: hex })} />
                </div>
              )}
            </div>
            <button
              onClick={() => update({ inset: !active.inset })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                active.inset
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Inset
            </button>
          </div>
        </div>
      )}

      {/* Appearance controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Background</label>
          <button
            onClick={() => { setShowBgPicker(!showBgPicker); setShowShadowPicker(false); setShowBoxPicker(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="w-5 h-5 rounded border border-border" style={{ background: bgColor }} />
            <span className="font-mono text-xs text-muted-foreground">{bgColor}</span>
          </button>
          {showBgPicker && (
            <div className="absolute z-20 top-full mt-1 bg-surface border border-border rounded-lg p-3 shadow-lg">
              <MiniColorPicker color={bgColor} onChange={setBgColor} />
            </div>
          )}
        </div>
        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Box Color</label>
          <button
            onClick={() => { setShowBoxPicker(!showBoxPicker); setShowShadowPicker(false); setShowBgPicker(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="w-5 h-5 rounded border border-border" style={{ background: boxColor }} />
            <span className="font-mono text-xs text-muted-foreground">{boxColor}</span>
          </button>
          {showBoxPicker && (
            <div className="absolute z-20 top-full mt-1 bg-surface border border-border rounded-lg p-3 shadow-lg">
              <MiniColorPicker color={boxColor} onChange={setBoxColor} />
            </div>
          )}
        </div>
        <NumberStepper label="Radius" value={borderRadius} onChange={setBorderRadius} min={0} max={100} width="w-16" />
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">CSS Output</label>
          <CopyButton text={fullCSS} />
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-x-auto whitespace-pre">
          {fullCSS}
        </pre>
      </div>
    </div>
  );
}
