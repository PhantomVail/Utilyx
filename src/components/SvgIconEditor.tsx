import { useState, useRef, useCallback } from "react";
import { Download, Copy, Check, Plus, Trash2 } from "lucide-react";
import { MiniColorPicker } from "./MiniColorPicker";
import { NumberStepper } from "./NumberStepper";

type ShapeType = "rect" | "circle" | "line" | "polygon" | "text";

interface SvgShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fill: boolean;
  strokeWidth: number;
  rotation: number;
  opacity: number;
  text?: string;
  fontSize?: number;
  sides?: number;
  borderRadius?: number;
}

let shapeCounter = 0;
const newId = () => `svg_${++shapeCounter}_${Date.now()}`;

const CANVAS = 100;

const ICON_PRESETS: { name: string; shapes: Omit<SvgShape, "id">[] }[] = [
  { name: "Badge", shapes: [
    { type: "circle", x: 50, y: 50, width: 70, height: 70, color: "#f70a45", fill: true, strokeWidth: 0, rotation: 0, opacity: 100 },
    { type: "circle", x: 50, y: 50, width: 55, height: 55, color: "#ff6b8a", fill: false, strokeWidth: 2, rotation: 0, opacity: 60 },
  ]},
  { name: "Star", shapes: [
    { type: "polygon", x: 50, y: 50, width: 40, height: 40, color: "#feca57", fill: true, strokeWidth: 0, rotation: 0, opacity: 100, sides: 5 },
  ]},
  { name: "Play", shapes: [
    { type: "circle", x: 50, y: 50, width: 80, height: 80, color: "#ff6b6b", fill: true, strokeWidth: 0, rotation: 0, opacity: 100 },
    { type: "polygon", x: 55, y: 50, width: 30, height: 30, color: "#ffffff", fill: true, strokeWidth: 0, rotation: 0, opacity: 100, sides: 3 },
  ]},
  { name: "Shield", shapes: [
    { type: "rect", x: 50, y: 45, width: 50, height: 60, color: "#00cec9", fill: true, strokeWidth: 0, rotation: 0, opacity: 100, borderRadius: 8 },
    { type: "rect", x: 50, y: 45, width: 38, height: 48, color: "#ffffff", fill: false, strokeWidth: 2, rotation: 0, opacity: 60, borderRadius: 5 },
  ]},
];

export function SvgIconEditor() {
  const [shapes, setShapes] = useState<SvgShape[]>([
    { id: newId(), type: "circle", x: 50, y: 50, width: 60, height: 60, color: "#f70a45", fill: true, strokeWidth: 2, rotation: 0, opacity: 100 },
    { id: newId(), type: "rect", x: 50, y: 50, width: 25, height: 25, color: "#ffffff", fill: true, strokeWidth: 0, rotation: 0, opacity: 100, borderRadius: 3 },
  ]);
  const [active, setActive] = useState<string | null>(() => shapes[0]?.id ?? null);
  const [viewSize, setViewSize] = useState(64);
  const [bgTransparent, setBgTransparent] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const activeShape = shapes.find(s => s.id === active);

  const updateShape = (id: string, updates: Partial<SvgShape>) => {
    setShapes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addShape = (type: ShapeType) => {
    const id = newId();
    const base: SvgShape = { id, type, x: 50, y: 50, width: 20, height: 20, color: "#ffffff", fill: true, strokeWidth: 2, rotation: 0, opacity: 100 };
    if (type === "text") Object.assign(base, { text: "A", fontSize: 24 });
    if (type === "polygon") Object.assign(base, { sides: 6 });
    if (type === "line") Object.assign(base, { fill: false, height: 0, x: 30, width: 40 });
    setShapes(prev => [...prev, base]);
    setActive(id);
  };

  const removeShape = (id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    if (active === id) setActive(null);
  };

  const loadPreset = (preset: typeof ICON_PRESETS[0]) => {
    const newShapes = preset.shapes.map(s => ({ ...s, id: newId() }));
    setShapes(newShapes);
    setActive(newShapes[0]?.id ?? null);
  };

  
  const toSvgCoords = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape) return;
    setActive(shapeId);
    setDragging(shapeId);
    const coords = toSvgCoords(e);
    dragStart.current = { mx: coords.x, my: coords.y, ox: shape.x, oy: shape.y };
  }, [shapes, toSvgCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const coords = toSvgCoords(e);
    const dx = coords.x - dragStart.current.mx;
    const dy = coords.y - dragStart.current.my;
    updateShape(dragging, {
      x: Math.max(0, Math.min(CANVAS, dragStart.current.ox + dx)),
      y: Math.max(0, Math.min(CANVAS, dragStart.current.oy + dy)),
    });
  }, [dragging, toSvgCoords]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const renderShape = (s: SvgShape, interactive = true) => {
    const common: Record<string, unknown> = {
      opacity: s.opacity / 100,
      transform: s.rotation ? `rotate(${s.rotation} ${s.x} ${s.y})` : undefined,
      stroke: s.fill ? "none" : s.color,
      strokeWidth: s.fill ? 0 : s.strokeWidth,
      fill: s.fill ? s.color : "none",
      style: interactive ? { cursor: "grab" } : undefined,
    };
    if (interactive) {
      common.onMouseDown = (e: React.MouseEvent) => handleMouseDown(e, s.id);
    }

    switch (s.type) {
      case "rect":
        return <rect key={s.id} x={s.x - s.width / 2} y={s.y - s.height / 2} width={s.width} height={s.height} rx={s.borderRadius || 0} {...common} />;
      case "circle":
        return <ellipse key={s.id} cx={s.x} cy={s.y} rx={s.width / 2} ry={s.height / 2} {...common} />;
      case "line":
        return <line key={s.id} x1={s.x - s.width / 2} y1={s.y} x2={s.x + s.width / 2} y2={s.y + (s.height || 0)} stroke={s.color} strokeWidth={s.strokeWidth || 2} strokeLinecap="round" opacity={s.opacity / 100} style={interactive ? { cursor: "grab" } : undefined} onMouseDown={interactive ? ((e: React.MouseEvent) => handleMouseDown(e, s.id)) : undefined} />;
      case "polygon": {
        const sides = s.sides || 5;
        const r = Math.min(s.width, s.height) / 2;
        const pts = Array.from({ length: sides }, (_, i) => {
          const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
          return `${s.x + r * Math.cos(angle)},${s.y + r * Math.sin(angle)}`;
        }).join(" ");
        return <polygon key={s.id} points={pts} {...common} />;
      }
      case "text":
        return <text key={s.id} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central" fontSize={s.fontSize || 16} fill={s.color} opacity={s.opacity / 100} style={interactive ? { cursor: "grab", userSelect: "none" } : undefined} onMouseDown={interactive ? ((e: React.MouseEvent) => handleMouseDown(e, s.id)) : undefined}>{s.text || "T"}</text>;
    }
  };

  const getSvgCode = () => {
    const bg = bgTransparent ? "" : `\n  <rect width="${CANVAS}" height="${CANVAS}" fill="${bgColor}"/>`;
    const shapesCode = shapes.map(s => {
      const fillAttr = s.fill ? `fill="${s.color}" stroke="none"` : `fill="none" stroke="${s.color}" stroke-width="${s.strokeWidth}"`;
      const op = s.opacity < 100 ? ` opacity="${s.opacity / 100}"` : "";
      const rot = s.rotation ? ` transform="rotate(${s.rotation} ${s.x} ${s.y})"` : "";
      switch (s.type) {
        case "rect": return `  <rect x="${s.x - s.width / 2}" y="${s.y - s.height / 2}" width="${s.width}" height="${s.height}"${s.borderRadius ? ` rx="${s.borderRadius}"` : ""} ${fillAttr}${op}${rot}/>`;
        case "circle": return `  <ellipse cx="${s.x}" cy="${s.y}" rx="${s.width / 2}" ry="${s.height / 2}" ${fillAttr}${op}${rot}/>`;
        case "line": return `  <line x1="${s.x - s.width / 2}" y1="${s.y}" x2="${s.x + s.width / 2}" y2="${s.y + (s.height || 0)}" stroke="${s.color}" stroke-width="${s.strokeWidth}" stroke-linecap="round"${op}/>`;
        case "polygon": {
          const sides = s.sides || 5;
          const r = Math.min(s.width, s.height) / 2;
          const pts = Array.from({ length: sides }, (_, i) => {
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            return `${s.x + r * Math.cos(angle)},${s.y + r * Math.sin(angle)}`;
          }).join(" ");
          return `  <polygon points="${pts}" ${fillAttr}${op}${rot}/>`;
        }
        case "text": return `  <text x="${s.x}" y="${s.y}" text-anchor="middle" dominant-baseline="central" font-size="${s.fontSize || 16}" fill="${s.color}"${op}>${s.text || "T"}</text>`;
        default: return "";
      }
    }).join("\n");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${viewSize}" height="${viewSize}">${bg}\n${shapesCode}\n</svg>`;
  };

  const downloadSvg = () => {
    const blob = new Blob([getSvgCode()], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `icon-${viewSize}x${viewSize}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const copySvg = async () => {
    await navigator.clipboard.writeText(getSvgCode());
    setCopied("svg");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyJsx = async () => {
    const jsx = getSvgCode()
      .replace(/stroke-width/g, "strokeWidth")
      .replace(/stroke-linecap/g, "strokeLinecap")
      .replace(/text-anchor/g, "textAnchor")
      .replace(/dominant-baseline/g, "dominantBaseline")
      .replace(/font-size/g, "fontSize");
    await navigator.clipboard.writeText(jsx);
    setCopied("jsx");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Presets</label>
        <div className="flex gap-1.5 flex-wrap">
          {ICON_PRESETS.map(p => (
            <button key={p.name} onClick={() => loadPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground hover:text-foreground border border-border transition-colors">
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="bg-surface border border-border rounded-lg p-3 flex items-center justify-center select-none"
          style={{ minWidth: 220, minHeight: 220 }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS} ${CANVAS}`}
            width={200}
            height={200}
            className="rounded"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => { if (e.target === svgRef.current || (e.target as SVGElement).tagName === "rect" && (e.target as SVGElement).getAttribute("fill") === "url(#checker)") setActive(null); }}
          >
            {bgTransparent ? (
              <>
                <defs>
                  <pattern id="checker" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="5" height="5" fill="#e0e0e0" />
                    <rect x="5" y="5" width="5" height="5" fill="#e0e0e0" />
                    <rect x="5" width="5" height="5" fill="#f5f5f5" />
                    <rect y="5" width="5" height="5" fill="#f5f5f5" />
                  </pattern>
                </defs>
                <rect width={CANVAS} height={CANVAS} fill="url(#checker)" />
              </>
            ) : (
              <rect width={CANVAS} height={CANVAS} fill={bgColor} />
            )}
            {shapes.map(s => renderShape(s, true))}
            
            {activeShape && (
              <rect
                x={activeShape.x - (activeShape.width || 10) / 2 - 2}
                y={activeShape.y - (activeShape.height || 10) / 2 - 2}
                width={(activeShape.width || 10) + 4}
                height={(activeShape.height || 10) + 4}
                fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth={0.8} strokeDasharray="2 2" rx={1}
                pointerEvents="none"
              />
            )}
          </svg>
        </div>

        
        <div className="flex-1 min-w-[200px] space-y-3">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Add Shape</label>
            <div className="flex gap-1 flex-wrap">
              {(["rect", "circle", "polygon", "line", "text"] as ShapeType[]).map(t => (
                <button key={t} onClick={() => addShape(t)}
                  className="px-2 py-1.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground hover:text-foreground border border-border capitalize">
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Layers</label>
            <div className="space-y-0.5 max-h-36 overflow-y-auto">
              {[...shapes].reverse().map(s => (
                <div key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${active === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <div className="w-3 h-3 rounded-sm border border-border shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="capitalize flex-1 truncate">{s.type}{s.type === "text" ? ` "${s.text}"` : ""}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeShape(s.id); }}
                    className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 size={10} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      {activeShape && (
        <div className="bg-surface border border-border rounded-lg p-3 space-y-3">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest capitalize">{activeShape.type} properties</div>
          
          {activeShape.type === "text" && (
            <input value={activeShape.text || ""} onChange={(e) => updateShape(activeShape.id, { text: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          )}

          <div className="flex gap-2 flex-wrap items-end">
            <div className="relative">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Color</label>
              <button onClick={() => setShowPicker(!showPicker)}
                className="w-7 h-7 rounded border-2 border-border cursor-pointer" style={{ backgroundColor: activeShape.color }} />
              {showPicker && (
                <div className="absolute z-20 top-[48px] left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
                  <MiniColorPicker color={activeShape.color} onChange={(c) => updateShape(activeShape.id, { color: c })} />
                </div>
              )}
            </div>
            <NumberStepper label="X" value={Math.round(activeShape.x)} onChange={(v) => updateShape(activeShape.id, { x: v })} min={0} max={100} step={1} width="w-10" />
            <NumberStepper label="Y" value={Math.round(activeShape.y)} onChange={(v) => updateShape(activeShape.id, { y: v })} min={0} max={100} step={1} width="w-10" />
            <NumberStepper label="W" value={activeShape.width} onChange={(v) => updateShape(activeShape.id, { width: v })} min={1} max={100} step={1} width="w-10" />
            <NumberStepper label="H" value={activeShape.height} onChange={(v) => updateShape(activeShape.id, { height: v })} min={1} max={100} step={1} width="w-10" />
            <NumberStepper label="Opacity" value={activeShape.opacity} onChange={(v) => updateShape(activeShape.id, { opacity: v })} min={0} max={100} step={5} width="w-10" />
            <NumberStepper label="Rotate°" value={activeShape.rotation} onChange={(v) => updateShape(activeShape.id, { rotation: v })} min={-180} max={180} step={5} width="w-10" />
          </div>
          
          <div className="flex gap-2 items-end flex-wrap">
            {activeShape.type !== "line" && (
              <button onClick={() => updateShape(activeShape.id, { fill: !activeShape.fill })}
                className={`px-2.5 py-1.5 rounded text-[10px] font-medium border transition-colors ${activeShape.fill ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
                {activeShape.fill ? "Filled" : "Stroke"}
              </button>
            )}
            {!activeShape.fill && <NumberStepper label="Stroke" value={activeShape.strokeWidth} onChange={(v) => updateShape(activeShape.id, { strokeWidth: v })} min={1} max={10} step={1} width="w-10" />}
            {activeShape.type === "rect" && <NumberStepper label="Radius" value={activeShape.borderRadius || 0} onChange={(v) => updateShape(activeShape.id, { borderRadius: v })} min={0} max={50} step={1} width="w-10" />}
            {activeShape.type === "polygon" && <NumberStepper label="Sides" value={activeShape.sides || 5} onChange={(v) => updateShape(activeShape.id, { sides: v })} min={3} max={12} step={1} width="w-10" />}
            {activeShape.type === "text" && <NumberStepper label="Size" value={activeShape.fontSize || 16} onChange={(v) => updateShape(activeShape.id, { fontSize: v })} min={8} max={60} step={1} width="w-10" />}
          </div>
        </div>
      )}

      
      <div className="flex gap-3 items-end flex-wrap">
        <NumberStepper label="Export Size" value={viewSize} onChange={setViewSize} min={16} max={512} step={8} width="w-14" />
        <button onClick={() => setBgTransparent(!bgTransparent)}
          className={`px-2.5 py-1.5 rounded text-[10px] font-medium border transition-colors ${bgTransparent ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
          {bgTransparent ? "Transparent BG" : "Solid BG"}
        </button>
        {!bgTransparent && (
          <div className="relative">
            <button onClick={() => setShowBgPicker(!showBgPicker)}
              className="w-7 h-7 rounded border-2 border-border cursor-pointer" style={{ backgroundColor: bgColor }} />
            {showBgPicker && (
              <div className="absolute z-20 bottom-9 left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
                <MiniColorPicker color={bgColor} onChange={setBgColor} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={downloadSvg}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Download size={14} /> Download SVG
        </button>
        <button onClick={copySvg}
          className="px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2 border border-border">
          {copied === "svg" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied === "svg" ? "Copied!" : "Copy SVG"}
        </button>
        <button onClick={copyJsx}
          className="px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2 border border-border">
          {copied === "jsx" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied === "jsx" ? "Copied!" : "Copy JSX"}
        </button>
      </div>

      
      <div className="bg-surface border border-border rounded-lg p-3">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">SVG Code</span>
        <pre className="text-xs font-mono text-foreground overflow-x-auto max-h-32 whitespace-pre-wrap break-all">{getSvgCode()}</pre>
      </div>
    </div>
  );
}
