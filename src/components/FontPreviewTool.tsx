import { useState } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

const FONT_STACKS: { name: string; value: string; type: string }[] = [
  { name: "System UI", value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", type: "Sans" },
  { name: "Inter", value: "'Inter', system-ui, sans-serif", type: "Sans" },
  { name: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif", type: "Sans" },
  { name: "SF Pro", value: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", type: "Sans" },
  { name: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", type: "Sans" },
  { name: "Roboto", value: "'Roboto', 'Helvetica Neue', Arial, sans-serif", type: "Sans" },
  { name: "Georgia", value: "Georgia, 'Times New Roman', Times, serif", type: "Serif" },
  { name: "Palatino", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", type: "Serif" },
  { name: "Times", value: "'Times New Roman', Times, serif", type: "Serif" },
  { name: "Charter", value: "Charter, 'Bitstream Charter', Georgia, serif", type: "Serif" },
  { name: "Mono (System)", value: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", type: "Mono" },
  { name: "Courier New", value: "'Courier New', Courier, monospace", type: "Mono" },
  { name: "Cascadia", value: "'Cascadia Code', 'Fira Code', monospace", type: "Mono" },
  { name: "Cursive", value: "'Brush Script MT', 'Segoe Script', cursive", type: "Other" },
  { name: "Fantasy", value: "Papyrus, fantasy", type: "Other" },
];

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const PANGRAMS = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "How vexingly quick daft zebras jump",
  "Sphinx of black quartz, judge my vow",
  "Two driven jocks help fax my big quiz",
];

export function FontPreviewTool() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [selectedFont, setSelectedFont] = useState(0);
  const [weight, setWeight] = useState(400);
  const [size, setSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [filterType, setFilterType] = useState("All");
  const { CopyButton } = useCopyToClipboard();

  const font = FONT_STACKS[selectedFont];
  const filtered = filterType === "All" ? FONT_STACKS : FONT_STACKS.filter((f) => f.type === filterType);

  const cssOutput = `font-family: ${font.value};\nfont-weight: ${weight};\nfont-size: ${size}px;\nletter-spacing: ${letterSpacing}em;\nline-height: ${lineHeight};`;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Preview Text</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        <div className="flex gap-1.5 mt-1.5">
          {PANGRAMS.map((p, i) => (
            <button key={i} onClick={() => setText(p)}
              className="px-2 py-1 bg-secondary text-[10px] text-muted-foreground hover:text-foreground rounded transition-colors truncate max-w-[120px]">
              {p.slice(0, 15)}…
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <p style={{ fontFamily: font.value, fontWeight: weight, fontSize: `${size}px`, letterSpacing: `${letterSpacing}em`, lineHeight }}
          className="text-foreground break-words">
          {text}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Weight</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {WEIGHTS.map((w) => (
              <button key={w} onClick={() => setWeight(w)}
                className={`px-2 py-1.5 text-xs font-mono transition-colors ${weight === w ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {w}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Size</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`px-2 py-1.5 text-xs font-mono transition-colors ${size === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Letter Spacing</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {[-0.05, -0.02, 0, 0.02, 0.05, 0.1, 0.2].map((s) => (
              <button key={s} onClick={() => setLetterSpacing(s)}
                className={`px-2 py-1.5 text-xs font-mono transition-colors ${letterSpacing === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Line Height</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {[1, 1.2, 1.4, 1.5, 1.6, 1.8, 2].map((h) => (
              <button key={h} onClick={() => setLineHeight(h)}
                className={`px-2 py-1.5 text-xs font-mono transition-colors ${lineHeight === h ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font list */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Font Stacks</label>
            <div className="flex bg-secondary rounded-lg overflow-hidden">
              {["All", "Sans", "Serif", "Mono", "Other"].map((t) => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-2 py-1 text-[10px] font-medium transition-colors ${filterType === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {filtered.map((f, i) => {
            const idx = FONT_STACKS.indexOf(f);
            return (
              <button key={f.name} onClick={() => setSelectedFont(idx)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors ${idx === selectedFont ? "border-primary/40 bg-primary/5" : "border-border bg-surface hover:border-primary/20"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{f.name} <span className="text-[10px]">({f.type})</span></span>
                </div>
                <p style={{ fontFamily: f.value, fontSize: "16px" }} className="text-foreground mt-1 truncate">{text}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">CSS Output</label>
          <CopyButton text={cssOutput} />
        </div>
        <pre className="bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground">{cssOutput}</pre>
      </div>
    </div>
  );
}
