import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import { MiniColorPicker } from "./MiniColorPicker";
import { NumberStepper } from "./NumberStepper";

export function QrCodeTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showFgPicker, setShowFgPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [margin, setMargin] = useState(4);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    QRCode.toCanvas(canvas, text, {
      width: size,
      margin,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorLevel,
    }).catch(() => {
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#ff4444";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Invalid input", size / 2, size / 2);
      }
    });
  }, [text, size, fgColor, bgColor, margin, errorLevel]);

  useEffect(() => { draw(); }, [draw]);

  const download = (format: "png" | "svg") => {
    if (format === "png") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `qrcode-${size}x${size}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      QRCode.toString(text, {
        type: "svg",
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      }).then(svg => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = `qrcode-${size}x${size}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    }
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        rows={3}
        placeholder="Enter text or URL..."
      />

      <div className="flex gap-3 flex-wrap items-end">
        <NumberStepper label="Size" value={size} onChange={setSize} min={128} max={1024} step={32} width="w-16" />
        <NumberStepper label="Margin" value={margin} onChange={setMargin} min={0} max={10} step={1} width="w-10" />
        
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Error Level</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["L", "M", "Q", "H"] as const).map(l => (
              <button key={l} onClick={() => setErrorLevel(l)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${errorLevel === l ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Foreground</label>
          <button onClick={() => { setShowFgPicker(!showFgPicker); setShowBgPicker(false); }}
            className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: fgColor }} />
          {showFgPicker && (
            <div className="absolute z-20 top-[52px] left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
              <MiniColorPicker color={fgColor} onChange={setFgColor} />
            </div>
          )}
        </div>

        <div className="relative">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Background</label>
          <button onClick={() => { setShowBgPicker(!showBgPicker); setShowFgPicker(false); }}
            className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: bgColor }} />
          {showBgPicker && (
            <div className="absolute z-20 top-[52px] left-0 bg-card border border-border rounded-lg p-2 shadow-xl">
              <MiniColorPicker color={bgColor} onChange={setBgColor} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded" style={{ width: Math.min(size, 300), height: Math.min(size, 300) }} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => download("png")}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Download size={14} /> PNG
        </button>
        <button onClick={() => download("svg")}
          className="px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2 border border-border">
          <Download size={14} /> SVG
        </button>
        <button onClick={copyToClipboard}
          className="px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2 border border-border">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
