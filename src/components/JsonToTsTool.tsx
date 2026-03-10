import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

function jsonToTs(json: string, rootName = "Root"): string {
  try {
    const parsed = JSON.parse(json);
    const interfaces: string[] = [];
    generate(parsed, rootName, interfaces);
    return interfaces.join("\n\n");
  } catch {
    return "// Invalid JSON";
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function singularize(s: string): string {
  if (s.endsWith("ies")) return s.slice(0, -3) + "y";
  if (s.endsWith("ses")) return s.slice(0, -2);
  if (s.endsWith("s") && !s.endsWith("ss")) return s.slice(0, -1);
  return s;
}

function inferType(value: unknown, key: string, interfaces: string[]): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const inner = inferType(value[0], singularize(key), interfaces);
    return `${inner}[]`;
  }
  if (typeof value === "object") {
    const name = capitalize(key);
    generate(value as Record<string, unknown>, name, interfaces);
    return name;
  }
  return typeof value;
}

function generate(obj: unknown, name: string, interfaces: string[]) {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
  const record = obj as Record<string, unknown>;
  const lines = Object.entries(record).map(([key, val]) => {
    const type = inferType(val, key, interfaces);
    return `  ${key}: ${type};`;
  });
  interfaces.push(`interface ${name} {\n${lines.join("\n")}\n}`);
}

const SAMPLE = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "62701"
  },
  "tags": ["admin", "user"],
  "orders": [
    { "id": 101, "total": 29.99, "shipped": false }
  ]
}`;

export function JsonToTsTool() {
  const [input, setInput] = useState(SAMPLE);
  const [rootName, setRootName] = useState("Root");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => jsonToTs(input, rootName), [input, rootName]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 max-w-4xl">
      <div className="flex gap-3 items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">
            Root Interface Name
          </label>
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value || "Root")}
            className="bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-72 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              TypeScript Interfaces
            </label>
            <button
              onClick={copy}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="w-full h-72 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-auto whitespace-pre">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
