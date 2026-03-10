import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { format as formatSQL } from "sql-formatter";

const SAMPLE = `select u.id, u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = true and u.created_at > '2024-01-01' group by u.id, u.name, u.email having count(o.id) > 5 order by order_count desc limit 20`;

export function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const { CopyButton } = useCopyToClipboard();

  const formatted = useMemo(() => {
    try {
      return formatSQL(input, { language: "sql", tabWidth: 2, keywordCase: "upper" });
    } catch {
      return input;
    }
  }, [input]);

  const minified = useMemo(() => input.replace(/\s+/g, " ").trim(), [input]);

  const lineCount = formatted.split("\n").length;
  const charSaved = input.length - minified.length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Input SQL
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={5}
          placeholder="Paste your SQL query here..."
          spellCheck={false}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Formatted — {lineCount} lines
          </label>
          <CopyButton text={formatted} />
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-x-auto whitespace-pre max-h-80 overflow-y-auto">
          {formatted}
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Minified {charSaved > 0 && <span className="text-primary ml-1">({charSaved} chars saved)</span>}
          </label>
          <CopyButton text={minified} />
        </div>
        <div className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-xs text-foreground overflow-x-auto whitespace-nowrap">
          {minified}
        </div>
      </div>
    </div>
  );
}
