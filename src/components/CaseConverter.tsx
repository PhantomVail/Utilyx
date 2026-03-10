import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

type CaseType = "camelCase" | "PascalCase" | "snake_case" | "SCREAMING_SNAKE" | "kebab-case" | "Title Case" | "UPPERCASE" | "lowercase" | "dot.case" | "path/case";

function tokenize(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_.\/\\]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

function convertCase(input: string, to: CaseType): string {
  const words = tokenize(input);
  if (!words.length) return "";
  switch (to) {
    case "camelCase":
      return words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join("");
    case "PascalCase":
      return words.map(w => w[0].toUpperCase() + w.slice(1)).join("");
    case "snake_case":
      return words.join("_");
    case "SCREAMING_SNAKE":
      return words.map(w => w.toUpperCase()).join("_");
    case "kebab-case":
      return words.join("-");
    case "Title Case":
      return words.map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    case "UPPERCASE":
      return words.join(" ").toUpperCase();
    case "lowercase":
      return words.join(" ");
    case "dot.case":
      return words.join(".");
    case "path/case":
      return words.join("/");
  }
}

const CASES: CaseType[] = ["camelCase", "PascalCase", "snake_case", "SCREAMING_SNAKE", "kebab-case", "Title Case", "UPPERCASE", "lowercase", "dot.case", "path/case"];

export function CaseConverter() {
  const [input, setInput] = useState("my variable name here");
  const { CopyButton } = useCopyToClipboard();

  const results = useMemo(() =>
    CASES.map((c) => ({ case: c, value: convertCase(input, c) })),
    [input]
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter text to convert..."
          spellCheck={false}
        />
      </div>

      <div className="space-y-1.5">
        {results.map((r) => (
          <div key={r.case} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-32 shrink-0">{r.case}</span>
            <code className="flex-1 font-mono text-sm text-foreground truncate">{r.value}</code>
            <CopyButton text={r.value} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
