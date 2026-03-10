import { useState, useMemo, useRef, useCallback } from "react";
import { Copy, Check, Columns, Eye, Code2, Download } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for GFM
marked.setOptions({
  gfm: true,
  breaks: true,
});

const SAMPLE = `# Utilyx Markdown Preview

## Features

This is a **live preview** with *rich formatting*, ~~strikethrough~~, and \`inline code\`.

### Task Lists

- [x] Resizable split pane
- [x] Code block syntax
- [ ] Export to PDF

### Nested Lists

- Item one
  - Sub-item A
  - Sub-item B
    - Deep nested
- Item two

### Code Blocks

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

### Tables

| Tool | Category | Status |
| --- | --- | --- |
| JSON Format | Transform | ✅ |
| Regex Tester | Inspect | ✅ |
| PNG Maker | Create | ✅ |

> Blockquotes render with a styled left border and muted text.

---

1. Ordered lists
2. Work perfectly
3. With numbering

- Bullet points
- Also supported
- **use \`npm install\`** for packages

[Visit Utilyx](https://example.com) for more tools.`;

type ViewMode = "split" | "preview" | "source";

export function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [splitPos, setSplitPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const rendered = useMemo(() => {
    try {
      const raw = marked.parse(input);
      if (typeof raw === "string") return DOMPurify.sanitize(raw);
      return "";
    } catch {
      return "<p>Error parsing markdown</p>";
    }
  }, [input]);

  const wordCount = useMemo(() => {
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const chars = input.length;
    const lines = input.split("\n").length;
    return { words, chars, lines };
  }, [input]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onDrag = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.max(20, Math.min(80, pct)));
  }, []);

  const onDragEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  const downloadMd = () => {
    const blob = new Blob([input], { type: "text/markdown" });
    const link = document.createElement("a");
    link.download = "document.md";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadHtml = () => {
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#e0e0e0;background:#0a0a0a}code{background:#1a1a1a;padding:2px 6px;border-radius:4px;font-size:13px}pre{background:#1a1a1a;padding:1rem;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #444;padding-left:1rem;color:#888;margin:1rem 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:8px 12px;text-align:left}hr{border:none;border-top:1px solid #333;margin:1.5rem 0}a{color:#f70a45}</style></head><body>${rendered}</body></html>`;
    const blob = new Blob([full], { type: "text/html" });
    const link = document.createElement("a");
    link.download = "document.html";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-3 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex bg-secondary rounded-lg overflow-hidden">
          {([
            { mode: "split" as ViewMode, icon: <Columns size={13} />, label: "Split" },
            { mode: "preview" as ViewMode, icon: <Eye size={13} />, label: "Preview" },
            { mode: "source" as ViewMode, icon: <Code2 size={13} />, label: "Source" },
          ]).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === mode
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {wordCount.words}w · {wordCount.chars}c · {wordCount.lines}L
          </span>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => copyText(input, "md")}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-hover transition-colors"
          >
            {copied === "md" ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            MD
          </button>
          <button
            onClick={() => copyText(rendered, "html")}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-hover transition-colors"
          >
            {copied === "html" ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            HTML
          </button>
          <button
            onClick={downloadMd}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-hover transition-colors"
          >
            <Download size={11} /> .md
          </button>
          <button
            onClick={downloadHtml}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-hover transition-colors"
          >
            <Download size={11} /> .html
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden bg-surface"
        style={{ height: "calc(100vh - 220px)", minHeight: 300 }}
        onPointerMove={onDrag}
        onPointerUp={onDragEnd}
      >
        {viewMode !== "preview" && (
          <div
            className="flex flex-col min-w-0 min-h-0 overflow-hidden"
            style={{ flex: "1 1 0%" }}
          >
            <div className="px-3 py-1.5 border-b border-border flex items-center justify-between bg-card/50 shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Markdown
              </span>
            </div>
            <textarea
              id="md-editor"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-0 w-full bg-transparent px-4 py-3 font-mono text-sm text-foreground focus:outline-none resize-none leading-relaxed overflow-y-auto"
              spellCheck={false}
              placeholder="Type markdown here..."
            />
          </div>
        )}

        {viewMode === "split" && (
          <div
            className="hidden sm:block w-1 cursor-col-resize bg-border hover:bg-primary/40 active:bg-primary/60 transition-colors shrink-0 relative group"
            onPointerDown={onDragStart}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary/50 transition-colors" />
          </div>
        )}

        {viewMode === "split" && (
          <div className="sm:hidden h-px bg-border shrink-0" />
        )}

        {viewMode !== "source" && (
          <div
            className="flex flex-col min-w-0 min-h-0 overflow-hidden"
            style={{ flex: "1 1 0%" }}
          >
            <div className="px-3 py-1.5 border-b border-border bg-card/50 shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Preview
              </span>
            </div>
            <div
              className="flex-1 min-h-0 px-4 sm:px-6 py-4 text-sm text-foreground overflow-y-auto leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
