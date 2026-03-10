import { useEffect, useState, useMemo } from "react";
import { tools, type ToolId } from "./ToolSidebar";
import { Search } from "lucide-react";

interface CommandPaletteProps {
  onSelect: (id: ToolId) => void;
}

export function CommandPalette({ onSelect }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.id.includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="flex-1 bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            spellCheck={false}
          />
          <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-1.5">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No tools found</div>
          )}
          {filtered.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { onSelect(tool.id); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-surface-hover transition-colors text-left"
            >
              <span className="text-muted-foreground shrink-0">{tool.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-foreground font-medium truncate">{tool.label}</div>
                <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">{tool.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
