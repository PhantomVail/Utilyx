import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

function slugify(text: string, separator: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, separator);
}

function camelCase(text: string): string {
  return slugify(text, "-")
    .split("-")
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");
}

function pascalCase(text: string): string {
  return slugify(text, "-")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function constantCase(text: string): string {
  return slugify(text, "_").toUpperCase();
}

export function SlugifyTool() {
  const [input, setInput] = useState("Hello World! This is a Test — with spëcial chars");
  const [copied, setCopied] = useState<string | null>(null);

  const variants = useMemo(
    () => [
      { label: "slug (hyphen)", value: slugify(input, "-") },
      { label: "slug (underscore)", value: slugify(input, "_") },
      { label: "camelCase", value: camelCase(input) },
      { label: "PascalCase", value: pascalCase(input) },
      { label: "CONSTANT_CASE", value: constantCase(input) },
      { label: "dot.case", value: slugify(input, ".") },
    ],
    [input]
  );

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        rows={3}
        placeholder="Type or paste text to slugify..."
      />

      <div className="space-y-2">
        {variants.map((v) => (
          <div
            key={v.label}
            className="flex items-center gap-3 bg-surface border border-border rounded-lg p-3"
          >
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-32 shrink-0">
              {v.label}
            </span>
            <code className="flex-1 font-mono text-sm text-foreground truncate">{v.value}</code>
            <button
              onClick={() => copy(v.value, v.label)}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              {copied === v.label ? (
                <Check size={13} className="text-success" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
