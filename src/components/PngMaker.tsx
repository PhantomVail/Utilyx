import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Download, Plus, Trash2, Move, Type, Square, Circle, Minus, Star, Triangle, Copy, Eye, EyeOff, ChevronUp, ChevronDown, Lock, Unlock, Image as ImageIcon, Keyboard } from "lucide-react";
import { MiniColorPicker } from "./MiniColorPicker";
import { NumberStepper } from "./NumberStepper";
import { FontPicker } from "./FontPicker";

const SYSTEM_FONTS = [
  "Arial","Helvetica","Verdana","Georgia","Trebuchet MS","Palatino",
  "Garamond","Courier New","Impact","Lucida Console","Lucida Sans",
  "Tahoma","Comic Sans MS","Segoe UI","monospace","serif","sans-serif",
];

const GOOGLE_FONTS = [
  "Inter","Space Grotesk","JetBrains Mono","Roboto","Poppins","Montserrat",
  "Open Sans","Lato","Raleway","Oswald","Playfair Display","Merriweather",
  "Source Code Pro","Fira Code","Ubuntu","Nunito","Quicksand","Outfit",
  "DM Sans","DM Serif Display","Bebas Neue","Archivo","Sora","Lexend",
  "Space Mono","IBM Plex Sans","IBM Plex Mono","Caveat","Pacifico",
  "Permanent Marker","Rubik","Karla","Work Sans","Manrope","Bitter",
  "Crimson Text","Inconsolata","Overpass","Comfortaa","Barlow",
  "Josefin Sans","Cabin","Arimo","Noto Sans","PT Sans","Libre Baskerville",
];

const FONTS = [...GOOGLE_FONTS, ...SYSTEM_FONTS];

const loadedFonts = new Set<string>();

function loadGoogleFont(fontName: string): Promise<void> {
  if (loadedFonts.has(fontName) || SYSTEM_FONTS.includes(fontName)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const encoded = fontName.replace(/ /g, "+");
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    loadedFonts.add(fontName);
    const check = () => {
      if (document.fonts.check(`16px "${fontName}"`)) {
        resolve();
      } else {
        setTimeout(check, 50);
      }
    };
    link.onload = () => setTimeout(check, 50);
    link.onerror = () => resolve();
    setTimeout(resolve, 3000);
  });
}

const PRESETS = [
  { label: "Social", w: 1200, h: 630 },
  { label: "IG Post", w: 1080, h: 1080 },
  { label: "IG Story", w: 1080, h: 1920 },
  { label: "Banner", w: 1920, h: 480 },
  { label: "Favicon", w: 512, h: 512 },
  { label: "Twitter", w: 1500, h: 500 },
  { label: "YT Thumb", w: 1280, h: 720 },
  { label: "LinkedIn", w: 1200, h: 627 },
];

const GRADIENTS = [
  { label: "None", colors: [] },
  { label: "Sunset", colors: ["#ff6b6b", "#feca57"] },
  { label: "Ocean", colors: ["#0652DD", "#1289A7"] },
  { label: "Cherry", colors: ["#f70a45", "#ff6b8a"] },
  { label: "Midnight", colors: ["#0f0c29", "#302b63", "#24243e"] },
  { label: "Emerald", colors: ["#11998e", "#38ef7d"] },
  { label: "Fire", colors: ["#f12711", "#f5af19"] },
  { label: "Noir", colors: ["#141414", "#333333"] },
  { label: "Candy", colors: ["#fc5c7d", "#6a82fb"] },
  { label: "Aurora", colors: ["#00d2ff", "#3a7bd5"] },
  { label: "Peach", colors: ["#ffecd2", "#fcb69f"] },
  { label: "Teal", colors: ["#11998e", "#38ef7d"] },
];

type LayerType = "text" | "rect" | "circle" | "line" | "star" | "triangle" | "image";

interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  visible: boolean;
  locked: boolean;
  text?: string;
  size?: number;
  color: string;
  font?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  letterSpacing?: number;
  opacity?: number;
  rotation?: number;
  width?: number;
  height?: number;
  fill?: boolean;
  strokeWidth?: number;
  borderRadius?: number;
  imageData?: string;
  imageWidth?: number;
  imageHeight?: number;
}

let layerCounter = 0;
const newId = () => `layer_${++layerCounter}_${Date.now()}`;

const SHORTCUTS_INFO = [
  { keys: "Ctrl+D", action: "Duplicate layer" },
  { keys: "Delete", action: "Delete layer" },
  { keys: "Ctrl+S", action: "Download PNG" },
  { keys: "↑↓←→", action: "Move layer (1%)" },
  { keys: "Shift+↑↓←→", action: "Move layer (5%)" },
  { keys: "Ctrl+]", action: "Bring forward" },
  { keys: "Ctrl+[", action: "Send backward" },
  { keys: "H", action: "Toggle visibility" },
  { keys: "L", action: "Toggle lock" },
  { keys: "+/−", action: "Resize (text/shape)" },
];

function buildIco(canvas: HTMLCanvasElement, size = 32): Blob {
  const tmp = document.createElement("canvas");
  tmp.width = size; tmp.height = size;
  const tctx = tmp.getContext("2d")!;
  tctx.drawImage(canvas, 0, 0, size, size);
  const imgData = tctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;
  const pixelDataSize = size * size * 4;
  const maskSize = size * Math.ceil(size / 32) * 4;
  const bmpSize = 40 + pixelDataSize + maskSize;
  const fileSize = 6 + 16 + bmpSize;
  const buf = new ArrayBuffer(fileSize);
  const view = new DataView(buf);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, size < 256 ? size : 0);
  view.setUint8(7, size < 256 ? size : 0);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, bmpSize, true);
  view.setUint32(18, 22, true);
  const bmpOff = 22;
  view.setUint32(bmpOff, 40, true);
  view.setInt32(bmpOff + 4, size, true);
  view.setInt32(bmpOff + 8, size * 2, true);
  view.setUint16(bmpOff + 12, 1, true);
  view.setUint16(bmpOff + 14, 32, true);
  view.setUint32(bmpOff + 16, 0, true);
  view.setUint32(bmpOff + 20, pixelDataSize + maskSize, true);
  const pixOff = bmpOff + 40;
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const si = (y * size + x) * 4;
      const di = pixOff + ((size - 1 - y) * size + x) * 4;
      view.setUint8(di, pixels[si + 2]);
      view.setUint8(di + 1, pixels[si + 1]);
      view.setUint8(di + 2, pixels[si]);
      view.setUint8(di + 3, pixels[si + 3]);
    }
  }
  return new Blob([buf], { type: "image/x-icon" });
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export function PngMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [gradientIdx, setGradientIdx] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [layers, setLayers] = useState<Layer[]>([
    { id: newId(), type: "text", text: "Utilyx", x: 5, y: 15, size: 72, color: "#ffffff", font: "Inter", bold: true, italic: false, visible: true, locked: false, align: "left", letterSpacing: 0, opacity: 100, rotation: 0 },
    { id: newId(), type: "text", text: "Privacy-first data tools", x: 5, y: 55, size: 28, color: "#888888", font: "Inter", bold: false, italic: false, visible: true, locked: false, align: "left", letterSpacing: 0, opacity: 100, rotation: 0 },
    { id: newId(), type: "rect", x: 3, y: 5, width: 94, height: 90, color: "#f70a45", fill: false, strokeWidth: 2, borderRadius: 12, visible: true, locked: false, opacity: 40, rotation: 0 },
  ]);
  const [activeLayer, setActiveLayer] = useState<string | null>(() => layers[0]?.id ?? null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{ id: string; handle: ResizeHandle; startX: number; startY: number; origX: number; origY: number; origW: number; origH: number } | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [hoverHandle, setHoverHandle] = useState<ResizeHandle>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const HANDLE_SIZE = 8;

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number) => {
    ctx.strokeStyle = "rgba(99, 102, 241, 0.7)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);
    const hs = HANDLE_SIZE;
    const handles = [
      [bx - hs / 2, by - hs / 2],
      [bx + bw / 2 - hs / 2, by - hs / 2],
      [bx + bw - hs / 2, by - hs / 2],
      [bx + bw - hs / 2, by + bh / 2 - hs / 2],
      [bx + bw - hs / 2, by + bh - hs / 2],
      [bx + bw / 2 - hs / 2, by + bh - hs / 2],
      [bx - hs / 2, by + bh - hs / 2],
      [bx - hs / 2, by + bh / 2 - hs / 2],
    ];
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(99, 102, 241, 0.9)";
    ctx.lineWidth = 1.5;
    for (const [hx, hy] of handles) {
      ctx.fillRect(hx, hy, hs, hs);
      ctx.strokeRect(hx, hy, hs, hs);
    }
  };

  const drawCanvas = useCallback((forExport = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    const grad = GRADIENTS[gradientIdx];
    if (grad.colors.length >= 2) {
      const rad = (gradientAngle * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(rad) * width / 2;
      const y1 = height / 2 - Math.sin(rad) * height / 2;
      const x2 = width / 2 + Math.cos(rad) * width / 2;
      const y2 = height / 2 + Math.sin(rad) * height / 2;
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.colors.forEach((c, i) => g.addColorStop(i / (grad.colors.length - 1), c));
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, width, height);

    for (const layer of layers) {
      if (!layer.visible) continue;
      const px = (layer.x / 100) * width;
      const py = (layer.y / 100) * height;
      const alpha = (layer.opacity ?? 100) / 100;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (layer.rotation) {
        const cx = px + ((layer.width ?? 0) / 200) * width;
        const cy = py + ((layer.height ?? 0) / 200) * height;
        ctx.translate(cx, cy);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      switch (layer.type) {
        case "text": {
          const style = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${layer.size}px "${layer.font}"`;
          ctx.font = style;
          ctx.fillStyle = layer.color;
          ctx.textBaseline = "top";
          if (layer.letterSpacing) {
            const chars = (layer.text || "").split("");
            let cx = px;
            for (const ch of chars) {
              ctx.fillText(ch, cx, py);
              cx += ctx.measureText(ch).width + (layer.letterSpacing || 0);
            }
          } else {
            const lines = (layer.text || "").split("\\n");
            lines.forEach((line, i) => {
              let lx = px;
              if (layer.align === "center") lx = px - ctx.measureText(line).width / 2;
              else if (layer.align === "right") lx = px - ctx.measureText(line).width;
              ctx.fillText(line, lx, py + i * ((layer.size || 32) * 1.3));
            });
          }

          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            const metrics = ctx.measureText(layer.text || "");
            const lineCount = (layer.text || "").split("\\n").length;
            const textH = (layer.size || 32) * 1.3 * lineCount;
            ctx.strokeStyle = "rgba(99, 102, 241, 0.7)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(px - 4, py - 4, metrics.width + 8, textH + 8);
            ctx.setLineDash([]);
          }
          break;
        }
        case "rect": {
          const w = ((layer.width || 10) / 100) * width;
          const h = ((layer.height || 10) / 100) * height;
          const br = layer.borderRadius || 0;
          ctx.beginPath();
          if (br > 0) {
            ctx.moveTo(px + br, py);
            ctx.lineTo(px + w - br, py);
            ctx.quadraticCurveTo(px + w, py, px + w, py + br);
            ctx.lineTo(px + w, py + h - br);
            ctx.quadraticCurveTo(px + w, py + h, px + w - br, py + h);
            ctx.lineTo(px + br, py + h);
            ctx.quadraticCurveTo(px, py + h, px, py + h - br);
            ctx.lineTo(px, py + br);
            ctx.quadraticCurveTo(px, py, px + br, py);
          } else {
            ctx.rect(px, py, w, h);
          }
          ctx.closePath();
          if (layer.fill !== false) {
            ctx.fillStyle = layer.color;
            ctx.fill();
          } else {
            ctx.strokeStyle = layer.color;
            ctx.lineWidth = layer.strokeWidth || 2;
            ctx.stroke();
          }
          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            drawResizeHandles(ctx, px - 2, py - 2, w + 4, h + 4);
          }
          break;
        }
        case "circle": {
          const rx = ((layer.width || 10) / 200) * width;
          const ry = ((layer.height || 10) / 200) * height;
          ctx.beginPath();
          ctx.ellipse(px + rx, py + ry, rx, ry, 0, 0, Math.PI * 2);
          if (layer.fill !== false) {
            ctx.fillStyle = layer.color;
            ctx.fill();
          } else {
            ctx.strokeStyle = layer.color;
            ctx.lineWidth = layer.strokeWidth || 2;
            ctx.stroke();
          }
          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            drawResizeHandles(ctx, px - 2, py - 2, rx * 2 + 4, ry * 2 + 4);
          }
          break;
        }
        case "line": {
          const lw = ((layer.width || 20) / 100) * width;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + lw, py);
          ctx.strokeStyle = layer.color;
          ctx.lineWidth = layer.strokeWidth || 2;
          ctx.stroke();
          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            const sw = layer.strokeWidth || 2;
            drawResizeHandles(ctx, px - 2, py - sw / 2 - 2, lw + 4, sw + 4);
          }
          break;
        }
        case "star": {
          const sr = ((layer.width || 10) / 200) * Math.min(width, height);
          const cx = px + sr, cy = py + sr;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a1 = (i * 72 - 90) * Math.PI / 180;
            const a2 = ((i * 72 + 36) - 90) * Math.PI / 180;
            ctx.lineTo(cx + sr * Math.cos(a1), cy + sr * Math.sin(a1));
            ctx.lineTo(cx + sr * 0.4 * Math.cos(a2), cy + sr * 0.4 * Math.sin(a2));
          }
          ctx.closePath();
          if (layer.fill !== false) { ctx.fillStyle = layer.color; ctx.fill(); }
          else { ctx.strokeStyle = layer.color; ctx.lineWidth = layer.strokeWidth || 2; ctx.stroke(); }
          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            drawResizeHandles(ctx, px - 2, py - 2, sr * 2 + 4, sr * 2 + 4);
          }
          break;
        }
        case "triangle": {
          const tw = ((layer.width || 10) / 100) * width;
          const th = ((layer.height || 10) / 100) * height;
          ctx.beginPath();
          ctx.moveTo(px + tw / 2, py);
          ctx.lineTo(px + tw, py + th);
          ctx.lineTo(px, py + th);
          ctx.closePath();
          if (layer.fill !== false) { ctx.fillStyle = layer.color; ctx.fill(); }
          else { ctx.strokeStyle = layer.color; ctx.lineWidth = layer.strokeWidth || 2; ctx.stroke(); }
          if (!forExport && layer.id === activeLayer) {
            ctx.globalAlpha = 1;
            drawResizeHandles(ctx, px - 2, py - 2, tw + 4, th + 4);
          }
          break;
        }
        case "image": {
          if (layer.imageData) {
            const img = new window.Image();
            img.src = layer.imageData;
            const iw = ((layer.width || 20) / 100) * width;
            const ih = ((layer.height || 20) / 100) * height;
            try { ctx.drawImage(img, px, py, iw, ih); } catch {}
            if (!forExport && layer.id === activeLayer) {
              ctx.globalAlpha = 1;
              drawResizeHandles(ctx, px - 2, py - 2, iw + 4, ih + 4);
            }
          }
          break;
        }
      }
      ctx.restore();
    }
  }, [width, height, bgColor, gradientIdx, gradientAngle, layers, activeLayer]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  useEffect(() => {
    const fonts = new Set(layers.filter(l => l.type === "text" && l.font).map(l => l.font!));
    Promise.all([...fonts].map(f => loadGoogleFont(f))).then(() => drawCanvas());
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "SELECT") return;

      const active = layers.find(l => l.id === activeLayer);

      if (e.key === "Delete" || e.key === "Backspace") {
        if (active && !active.locked) {
          e.preventDefault();
          setLayers(prev => prev.filter(l => l.id !== activeLayer));
          setActiveLayer(null);
        }
      }
      if (e.ctrlKey && e.key === "d") {
        if (active) {
          e.preventDefault();
          const dup = { ...active, id: newId(), x: active.x + 2, y: active.y + 2 };
          setLayers(prev => [...prev, dup]);
          setActiveLayer(dup.id);
        }
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        downloadImage();
      }
      if (e.key === "h" && !e.ctrlKey) {
        if (active) {
          e.preventDefault();
          updateLayer(active.id, { visible: !active.visible });
        }
      }
      if (e.key === "l" && !e.ctrlKey) {
        if (active) {
          e.preventDefault();
          updateLayer(active.id, { locked: !active.locked });
        }
      }
      const step = e.shiftKey ? 5 : 1;
      if (active && !active.locked) {
        if (e.key === "ArrowUp") { e.preventDefault(); updateLayer(active.id, { y: Math.max(0, active.y - step) }); }
        if (e.key === "ArrowDown") { e.preventDefault(); updateLayer(active.id, { y: Math.min(95, active.y + step) }); }
        if (e.key === "ArrowLeft") { e.preventDefault(); updateLayer(active.id, { x: Math.max(0, active.x - step) }); }
        if (e.key === "ArrowRight") { e.preventDefault(); updateLayer(active.id, { x: Math.min(95, active.x + step) }); }
      }
      if (active && !active.locked) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          if (active.type === "text") updateLayer(active.id, { size: Math.min(200, (active.size || 32) + 2) });
          else updateLayer(active.id, { width: Math.min(100, (active.width || 10) + 2), height: Math.min(100, (active.height || 10) + 2) });
        }
        if (e.key === "-") {
          e.preventDefault();
          if (active.type === "text") updateLayer(active.id, { size: Math.max(8, (active.size || 32) - 2) });
          else updateLayer(active.id, { width: Math.max(1, (active.width || 10) - 2), height: Math.max(1, (active.height || 10) - 2) });
        }
      }
      if (e.ctrlKey && e.key === "]") {
        if (active) {
          e.preventDefault();
          setLayers(prev => {
            const idx = prev.findIndex(l => l.id === active.id);
            if (idx < prev.length - 1) {
              const arr = [...prev];
              [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
              return arr;
            }
            return prev;
          });
        }
      }
      if (e.ctrlKey && e.key === "[") {
        if (active) {
          e.preventDefault();
          setLayers(prev => {
            const idx = prev.findIndex(l => l.id === active.id);
            if (idx > 0) {
              const arr = [...prev];
              [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
              return arr;
            }
            return prev;
          });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeLayer, layers]);

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "webp" | "svg" | "ico" | "bmp">("png");
  const [jpgQuality, setJpgQuality] = useState(92);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prev = activeLayer;
    setActiveLayer(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (exportFormat === "ico") {
          const blob = buildIco(canvas, 32);
          const link = document.createElement("a");
          link.download = `utilyx-favicon.ico`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        } else if (exportFormat === "svg") {
          const dataUrl = canvas.toDataURL("image/png");
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <image href="${dataUrl}" width="${width}" height="${height}"/>
</svg>`;
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const link = document.createElement("a");
          link.download = `utilyx-${width}x${height}.svg`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        } else {
          const mimeMap = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", bmp: "image/bmp" };
          const extMap = { png: "png", jpg: "jpg", webp: "webp", bmp: "bmp" };
          const mime = mimeMap[exportFormat] || "image/png";
          const ext = extMap[exportFormat] || "png";
          const quality = exportFormat === "jpg" ? jpgQuality / 100 : exportFormat === "webp" ? jpgQuality / 100 : undefined;
          const link = document.createElement("a");
          link.download = `utilyx-${width}x${height}.${ext}`;
          link.href = canvas.toDataURL(mime, quality);
          link.click();
        }
        setActiveLayer(prev);
      });
    });
  };

  const addLayer = (type: LayerType) => {
    const id = newId();
    const base: Layer = {
      id, type, x: 10, y: 10, color: "#ffffff", visible: true, locked: false, opacity: 100, rotation: 0,
    };
    switch (type) {
      case "text":
        Object.assign(base, { text: "New Text", size: 36, font: "Inter", bold: false, italic: false, align: "left", letterSpacing: 0 });
        break;
      case "rect":
        Object.assign(base, { width: 20, height: 15, fill: true, strokeWidth: 2, borderRadius: 0 });
        break;
      case "circle":
        Object.assign(base, { width: 15, height: 15, fill: true, strokeWidth: 2 });
        break;
      case "line":
        Object.assign(base, { width: 30, strokeWidth: 3 });
        break;
      case "star":
        Object.assign(base, { width: 10, fill: true, strokeWidth: 2 });
        break;
      case "triangle":
        Object.assign(base, { width: 15, height: 12, fill: true, strokeWidth: 2 });
        break;
    }
    setLayers([...layers, base]);
    setActiveLayer(id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const id = newId();
        const aspectW = (img.width / width) * 100;
        const aspectH = (img.height / height) * 100;
        const scale = Math.min(50 / aspectW, 50 / aspectH, 1);
        setLayers(prev => [...prev, {
          id, type: "image" as LayerType, x: 5, y: 5, color: "#ffffff",
          visible: true, locked: false, opacity: 100, rotation: 0,
          imageData: ev.target?.result as string,
          width: Math.round(aspectW * scale),
          height: Math.round(aspectH * scale),
          imageWidth: img.width, imageHeight: img.height,
        }]);
        setActiveLayer(id);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getLayerBounds = (l: Layer): { px: number; py: number; bw: number; bh: number } => {
    const px = (l.x / 100) * width;
    const py = (l.y / 100) * height;
    if (l.type === "text") {
      const canvas2 = canvasRef.current!;
      const ctx = canvas2.getContext("2d")!;
      ctx.font = `${l.italic ? "italic " : ""}${l.bold ? "bold " : ""}${l.size}px "${l.font}"`;
      return { px, py, bw: ctx.measureText(l.text || "").width, bh: (l.size || 32) * 1.3 };
    }
    if (l.type === "star") {
      const sr = ((l.width || 10) / 200) * Math.min(width, height);
      return { px, py, bw: sr * 2, bh: sr * 2 };
    }
    return { px, py, bw: ((l.width || 10) / 100) * width, bh: ((l.height || 10) / 100) * height };
  };

  const hitTestHandle = (mx: number, my: number, bx: number, by: number, bw: number, bh: number, canvasRect: DOMRect): ResizeHandle => {
    const scale = width / canvasRect.width;
    const hs = Math.max(HANDLE_SIZE * 3, 16 * scale); // very generous hit area scaled to canvas
    const positions: { handle: ResizeHandle; hx: number; hy: number }[] = [
      { handle: "nw", hx: bx, hy: by },
      { handle: "n", hx: bx + bw / 2, hy: by },
      { handle: "ne", hx: bx + bw, hy: by },
      { handle: "e", hx: bx + bw, hy: by + bh / 2 },
      { handle: "se", hx: bx + bw, hy: by + bh },
      { handle: "s", hx: bx + bw / 2, hy: by + bh },
      { handle: "sw", hx: bx, hy: by + bh },
      { handle: "w", hx: bx, hy: by + bh / 2 },
    ];
    for (const { handle, hx, hy } of positions) {
      if (Math.abs(mx - hx) < hs && Math.abs(my - hy) < hs) return handle;
    }
    return null;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    if (activeLayer) {
      const al = layers.find(l => l.id === activeLayer);
      if (al && al.type !== "text" && !al.locked && al.visible) {
        const { px, py, bw, bh } = getLayerBounds(al);
        const handle = hitTestHandle(mx, my, px, py, bw, bh, rect);
        if (handle) {
          setResizing({
            id: al.id, handle,
            startX: mx, startY: my,
            origX: al.x, origY: al.y,
            origW: al.width || 10, origH: al.height || 10,
          });
          return;
        }
      }
    }

    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      if (!l.visible || l.locked) continue;
      const { px, py, bw, bh } = getLayerBounds(l);

      if (mx >= px - 10 && mx <= px + bw + 10 && my >= py - 10 && my <= py + bh + 10) {
        setActiveLayer(l.id);
        setDragging(l.id);
        dragOffset.current = { x: mx - px, y: my - py };
        return;
      }
    }
    setActiveLayer(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (width / rect.width);
    const my = (e.clientY - rect.top) * (height / rect.height);

    if (resizing) {
      const dx = mx - resizing.startX;
      const dy = my - resizing.startY;
      const dxPct = (dx / width) * 100;
      const dyPct = (dy / height) * 100;
      const h = resizing.handle;
      let newX = resizing.origX, newY = resizing.origY;
      let newW = resizing.origW, newH = resizing.origH;

      if (h === "se" || h === "e" || h === "ne") newW = Math.max(1, resizing.origW + dxPct);
      if (h === "sw" || h === "w" || h === "nw") { newW = Math.max(1, resizing.origW - dxPct); newX = resizing.origX + dxPct; }
      if (h === "se" || h === "s" || h === "sw") newH = Math.max(1, resizing.origH + dyPct);
      if (h === "ne" || h === "n" || h === "nw") { newH = Math.max(1, resizing.origH - dyPct); newY = resizing.origY + dyPct; }

      updateLayer(resizing.id, { x: newX, y: newY, width: newW, height: newH });
      return;
    }

    if (dragging) {
      const newX = ((mx - dragOffset.current.x) / width) * 100;
      const newY = ((my - dragOffset.current.y) / height) * 100;
      updateLayer(dragging, { x: Math.max(-10, Math.min(100, newX)), y: Math.max(-10, Math.min(100, newY)) });
      return;
    }

    if (activeLayer) {
      const al = layers.find(l => l.id === activeLayer);
      if (al && al.type !== "text" && !al.locked && al.visible) {
        const { px, py, bw, bh } = getLayerBounds(al);
        const handle = hitTestHandle(mx, my, px, py, bw, bh, rect);
        setHoverHandle(handle);
        return;
      }
    }
    setHoverHandle(null);
  };

  const handleCanvasMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  const active = layers.find(l => l.id === activeLayer);

  const SHAPE_TOOLS: { type: LayerType; icon: React.ReactNode; label: string }[] = [
    { type: "text", icon: <Type size={14} />, label: "Text" },
    { type: "rect", icon: <Square size={14} />, label: "Rectangle" },
    { type: "circle", icon: <Circle size={14} />, label: "Circle" },
    { type: "line", icon: <Minus size={14} />, label: "Line" },
    { type: "star", icon: <Star size={14} />, label: "Star" },
    { type: "triangle", icon: <Triangle size={14} />, label: "Triangle" },
  ];

  return (
    <div className="space-y-4 animate-fade-in" ref={containerRef} tabIndex={-1}>
      <div className="flex gap-1 sm:gap-1.5 flex-wrap items-center">
        {SHAPE_TOOLS.map((t) => (
          <button key={t.type} onClick={() => addLayer(t.type)} title={`Add ${t.label}`}
            className="p-2 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors border border-border">
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
        <label className="p-2 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors border border-border cursor-pointer">
          <ImageIcon size={14} /> <span className="hidden sm:inline">Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <div className="ml-auto flex gap-1.5 shrink-0">
          <button onClick={() => setShowShortcuts(!showShortcuts)}
            className={`p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border transition-colors ${showShortcuts ? "bg-primary/15 text-primary border-primary/20" : ""}`}
            title="Keyboard shortcuts">
            <Keyboard size={14} />
          </button>
        </div>
      </div>

      {showShortcuts && (
        <div className="bg-surface border border-border rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
          {SHORTCUTS_INFO.map((s) => (
            <div key={s.keys} className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono text-primary shrink-0">{s.keys}</kbd>
              <span className="text-muted-foreground">{s.action}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-2 overflow-hidden">
        <canvas ref={canvasRef} className="w-full rounded"
          style={{ aspectRatio: `${width}/${height}`, maxHeight: "380px", objectFit: "contain", cursor: (() => { const h = resizing?.handle || hoverHandle; if (!h) return "move"; if (h === "nw" || h === "se") return "nwse-resize"; if (h === "ne" || h === "sw") return "nesw-resize"; if (h === "n" || h === "s") return "ns-resize"; return "ew-resize"; })() }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Preset</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }}
                className={`px-2 py-1.5 text-[10px] font-medium transition-colors ${width === p.w && height === p.h ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <NumberStepper label="Width" value={width} onChange={setWidth} min={100} max={4096} step={10} width="w-16" />
        <NumberStepper label="Height" value={height} onChange={setHeight} min={100} max={4096} step={10} width="w-16" />
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Background</label>
        <div className="flex gap-2 flex-wrap items-start">
          <div className="relative">
            <button onClick={() => { setShowBgPicker(!showBgPicker); setGradientIdx(0); }}
              className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: bgColor }} />
            {showBgPicker && (
              <div className="absolute z-10 top-10 left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
                <MiniColorPicker color={bgColor} onChange={(c) => { setBgColor(c); setGradientIdx(0); }} />
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-wrap">
            {GRADIENTS.map((g, i) => (
              <button key={g.label} onClick={() => setGradientIdx(i)} title={g.label}
                className={`w-7 h-7 rounded-md border-2 transition-all ${gradientIdx === i ? "border-primary scale-110" : "border-border"}`}
                style={{ background: g.colors.length >= 2 ? `linear-gradient(135deg, ${g.colors.join(", ")})` : bgColor }} />
            ))}
          </div>
          {GRADIENTS[gradientIdx].colors.length >= 2 && (
            <NumberStepper label="Angle" value={gradientAngle} onChange={setGradientAngle} min={0} max={360} step={15} width="w-12" />
          )}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Layers ({layers.length})</label>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {[...layers].reverse().map((l) => (
            <div key={l.id} onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all border ${activeLayer === l.id ? "bg-primary/10 border-primary/20 text-primary" : "bg-surface border-border text-foreground hover:bg-surface-hover"}`}>
              <button onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { visible: !l.visible }); }} className="text-muted-foreground hover:text-foreground shrink-0">
                {l.visible ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { locked: !l.locked }); }} className="text-muted-foreground hover:text-foreground shrink-0">
                {l.locked ? <Lock size={11} /> : <Unlock size={11} />}
              </button>
              <span className="truncate flex-1 font-mono text-[11px]">{l.type === "text" ? l.text : l.type}{l.type === "image" ? " 📷" : ""}</span>
              <div className="w-3 h-3 rounded-sm shrink-0 border border-border/50" style={{ backgroundColor: l.color }} />
              <button onClick={(e) => { e.stopPropagation(); const dup = { ...l, id: newId(), x: l.x + 2, y: l.y + 2 }; setLayers(prev => [...prev, dup]); setActiveLayer(dup.id); }}
                className="text-muted-foreground hover:text-foreground shrink-0"><Copy size={11} /></button>
              <button onClick={(e) => { e.stopPropagation(); setLayers(prev => prev.filter(x => x.id !== l.id)); if (activeLayer === l.id) setActiveLayer(null); }}
                className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 size={11} /></button>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div className="bg-surface border border-border rounded-lg p-3 space-y-3">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {active.type} properties
          </div>

          {active.type === "text" && (
            <>
              <input value={active.text || ""} onChange={(e) => updateLayer(active.id, { text: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" spellCheck={false}
                placeholder="Text (use \n for newline)" />
              <div className="flex gap-2 flex-wrap items-end">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Font</label>
                  <FontPicker value={active.font || "Inter"} onChange={(font) => { updateLayer(active.id, { font }); loadGoogleFont(font).then(() => drawCanvas()); }} fonts={FONTS} />
                </div>
                <NumberStepper label="Size" value={active.size || 32} onChange={(v) => updateLayer(active.id, { size: v })} min={8} max={300} step={1} width="w-12" />
                <NumberStepper label="Spacing" value={active.letterSpacing || 0} onChange={(v) => updateLayer(active.id, { letterSpacing: v })} min={-5} max={30} step={1} width="w-10" />
                <div className="flex gap-0.5 items-end">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Style</label>
                  <div className="flex gap-0.5">
                    <button onClick={() => updateLayer(active.id, { bold: !active.bold })}
                      className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center border ${active.bold ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
                      B</button>
                    <button onClick={() => updateLayer(active.id, { italic: !active.italic })}
                      className={`w-7 h-7 rounded text-xs italic flex items-center justify-center border ${active.italic ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
                      I</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Align</label>
                  <div className="flex bg-secondary rounded-lg overflow-hidden">
                    {(["left", "center", "right"] as const).map((a) => (
                      <button key={a} onClick={() => updateLayer(active.id, { align: a })}
                        className={`px-2 py-1.5 text-[10px] font-medium ${active.align === a ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                        {a === "left" ? "⫷" : a === "center" ? "≡" : "⫸"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {(active.type === "rect" || active.type === "circle" || active.type === "triangle" || active.type === "star") && (
            <div className="flex gap-2 flex-wrap items-end">
              <NumberStepper label="Width %" value={active.width || 10} onChange={(v) => updateLayer(active.id, { width: v })} min={1} max={100} step={1} width="w-12" />
              {active.type !== "star" && (
                <NumberStepper label="Height %" value={active.height || 10} onChange={(v) => updateLayer(active.id, { height: v })} min={1} max={100} step={1} width="w-12" />
              )}
              <div className="flex gap-0.5 items-end">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Fill</label>
                <div className="flex gap-0.5">
                  <button onClick={() => updateLayer(active.id, { fill: true })}
                    className={`px-2 py-1.5 rounded text-[10px] border ${active.fill !== false ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
                    Solid</button>
                  <button onClick={() => updateLayer(active.id, { fill: false })}
                    className={`px-2 py-1.5 rounded text-[10px] border ${active.fill === false ? "bg-primary/15 border-primary/20 text-primary" : "bg-background border-border text-muted-foreground"}`}>
                    Stroke</button>
                </div>
              </div>
              {active.fill === false && (
                <NumberStepper label="Stroke" value={active.strokeWidth || 2} onChange={(v) => updateLayer(active.id, { strokeWidth: v })} min={1} max={20} step={1} width="w-10" />
              )}
              {active.type === "rect" && (
                <NumberStepper label="Radius" value={active.borderRadius || 0} onChange={(v) => updateLayer(active.id, { borderRadius: v })} min={0} max={200} step={2} width="w-12" />
              )}
            </div>
          )}

          {active.type === "line" && (
            <div className="flex gap-2 items-end">
              <NumberStepper label="Length %" value={active.width || 20} onChange={(v) => updateLayer(active.id, { width: v })} min={1} max={100} step={1} width="w-12" />
              <NumberStepper label="Thickness" value={active.strokeWidth || 2} onChange={(v) => updateLayer(active.id, { strokeWidth: v })} min={1} max={20} step={1} width="w-10" />
            </div>
          )}

          {active.type === "image" && (
            <div className="flex gap-2 items-end">
              <NumberStepper label="Width %" value={active.width || 20} onChange={(v) => updateLayer(active.id, { width: v })} min={1} max={100} step={1} width="w-12" />
              <NumberStepper label="Height %" value={active.height || 20} onChange={(v) => updateLayer(active.id, { height: v })} min={1} max={100} step={1} width="w-12" />
            </div>
          )}

          <div className="flex gap-2 flex-wrap items-end">
            {active.type !== "image" && (
              <div className="relative">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Color</label>
                <button onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: active.color }} />
                {showColorPicker && (
                  <div className="absolute z-20 top-[52px] left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
                    <MiniColorPicker color={active.color} onChange={(c) => updateLayer(active.id, { color: c })} />
                  </div>
                )}
              </div>
            )}
            <NumberStepper label="X %" value={Math.round(active.x)} onChange={(v) => updateLayer(active.id, { x: v })} min={-10} max={100} step={1} width="w-10" />
            <NumberStepper label="Y %" value={Math.round(active.y)} onChange={(v) => updateLayer(active.id, { y: v })} min={-10} max={100} step={1} width="w-10" />
            <NumberStepper label="Opacity" value={active.opacity ?? 100} onChange={(v) => updateLayer(active.id, { opacity: v })} min={0} max={100} step={5} width="w-10" />
            <NumberStepper label="Rotate°" value={active.rotation ?? 0} onChange={(v) => updateLayer(active.id, { rotation: v })} min={-180} max={180} step={5} width="w-10" />
          </div>
        </div>
      )}

      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Format</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["png", "jpg", "webp", "svg", "ico", "bmp"] as const).map((f) => (
              <button key={f} onClick={() => setExportFormat(f)}
                className={`px-2.5 py-1.5 text-[10px] font-mono font-medium uppercase transition-colors ${exportFormat === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {(exportFormat === "jpg" || exportFormat === "webp") && (
          <NumberStepper label="Quality %" value={jpgQuality} onChange={setJpgQuality} min={10} max={100} step={5} width="w-12" />
        )}
        {exportFormat === "ico" && (
          <span className="text-[10px] text-muted-foreground py-2">Exports as 32×32 favicon</span>
        )}
      </div>
      <button onClick={downloadImage}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        <Download size={16} /> Download {exportFormat.toUpperCase()} ({exportFormat === "ico" ? "32×32" : `${width}×${height}`})
      </button>
    </div>
  );
}
