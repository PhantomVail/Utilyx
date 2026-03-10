import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
  fonts: string[];
}

export function FontPicker({ value, onChange, fonts }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = search
    ? fonts.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : fonts;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-surface-hover transition-colors max-w-[150px]"
      >
        <span className="truncate flex-1 text-left">{value}</span>
        <ChevronDown size={12} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1 left-0 w-52 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          <div className="p-1.5 border-b border-border">
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-md px-2 py-1">
              <Search size={11} className="text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none w-full placeholder:text-muted-foreground"
                placeholder="Search fonts..."
                autoFocus
              />
            </div>
          </div>
          <div ref={listRef} className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">No fonts found</div>
            )}
            {filtered.map((f) => (
              <button
                key={f}
                data-active={f === value}
                onClick={() => {
                  onChange(f);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors truncate ${
                  f === value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-surface-hover"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
