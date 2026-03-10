import { useState } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { Copy, Search } from "lucide-react";

interface Pattern {
  name: string;
  regex: string;
  description: string;
  example: string;
  category: string;
}

const PATTERNS: Pattern[] = [
  { name: "Email", regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "Standard email address", example: "user@example.com", category: "Validation" },
  { name: "URL", regex: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)", description: "HTTP/HTTPS URL", example: "https://example.com/path?q=1", category: "Validation" },
  { name: "IPv4 Address", regex: "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$", description: "IPv4 address (strict)", example: "192.168.1.1", category: "Validation" },
  { name: "IPv6 Address", regex: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", description: "Full IPv6 address", example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", category: "Validation" },
  { name: "Phone (US)", regex: "^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$", description: "US phone number", example: "+1 (555) 123-4567", category: "Validation" },
  { name: "UUID v4", regex: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", description: "RFC 4122 UUID v4", example: "550e8400-e29b-41d4-a716-446655440000", category: "Validation" },
  { name: "Integer", regex: "^-?\\d+$", description: "Positive or negative integer", example: "-42", category: "Numbers" },
  { name: "Float", regex: "^-?\\d*\\.\\d+$", description: "Decimal number", example: "3.14", category: "Numbers" },
  { name: "Hex Color", regex: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", description: "CSS hex color", example: "#ff6600", category: "Numbers" },
  { name: "Credit Card", regex: "^(?:4\\d{12}(?:\\d{3})?|5[1-5]\\d{14}|3[47]\\d{13})$", description: "Visa, MC, Amex", example: "4111111111111111", category: "Numbers" },
  { name: "Slug", regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$", description: "URL-safe slug", example: "my-blog-post", category: "Strings" },
  { name: "Username", regex: "^[a-zA-Z0-9_]{3,20}$", description: "3-20 alphanumeric + underscore", example: "cool_user_42", category: "Strings" },
  { name: "Strong Password", regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", description: "Min 8 chars, upper+lower+digit+special", example: "P@ssw0rd!", category: "Strings" },
  { name: "HTML Tag", regex: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>", description: "Matching HTML open/close tags", example: "<div>content</div>", category: "Strings" },
  { name: "Date (YYYY-MM-DD)", regex: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", description: "ISO date format", example: "2024-12-25", category: "Strings" },
  { name: "Time (HH:MM:SS)", regex: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$", description: "24-hour time", example: "14:30:00", category: "Strings" },
  { name: "JS Variable", regex: "^[a-zA-Z_$][a-zA-Z0-9_$]*$", description: "Valid JavaScript identifier", example: "myVariable", category: "Code" },
  { name: "Semver", regex: "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$", description: "Semantic versioning", example: "1.2.3-beta.1", category: "Code" },
  { name: "JSON Key", regex: "\"([^\"]+)\"\\s*:", description: "JSON object key", example: '"name": "value"', category: "Code" },
  { name: "CSS Property", regex: "[a-z-]+\\s*:\\s*[^;]+;", description: "CSS property:value pair", example: "color: red;", category: "Code" },
];

const CATEGORIES = [...new Set(PATTERNS.map((p) => p.category))];

export function RegexLibrary() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [testInput, setTestInput] = useState("");
  const [activePattern, setActivePattern] = useState<Pattern | null>(null);
  const { CopyButton } = useCopyToClipboard();

  const filtered = PATTERNS.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !activeCat || p.category === activeCat;
    return matchesSearch && matchesCat;
  });

  const testResult = activePattern && testInput
    ? (() => {
        try {
          return new RegExp(activePattern.regex).test(testInput);
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Search patterns..."
        />
      </div>

      
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCat(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            !activeCat ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(activeCat === c ? null : c)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeCat === c ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      
      {activePattern && (
        <div className="bg-surface border border-primary/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{activePattern.name}</span>
            <button
              onClick={() => setActivePattern(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <code className="block text-xs font-mono text-primary/80 bg-primary/5 rounded-md px-3 py-2 break-all">
            /{activePattern.regex}/
          </code>
          <div className="flex gap-2 items-center">
            <input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={activePattern.example}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {testInput && testResult !== null && (
              <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md ${
                testResult ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
              }`}>
                {testResult ? "✓ Match" : "✗ No match"}
              </span>
            )}
          </div>
        </div>
      )}

      
      <div className="space-y-1.5">
        {filtered.map((p) => (
          <div
            key={p.name}
            onClick={() => { setActivePattern(p); setTestInput(""); }}
            className={`bg-surface border rounded-lg px-4 py-3 cursor-pointer transition-colors group ${
              activePattern?.name === p.name ? "border-primary/30" : "border-border hover:border-border/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{p.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">{p.description}</p>
                <code className="text-[11px] font-mono text-primary/70 break-all line-clamp-1">/{p.regex}/</code>
              </div>
              <CopyButton text={p.regex} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        {filtered.length} of {PATTERNS.length} patterns
      </div>
    </div>
  );
}
