import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { useDebounce } from "../hooks/useDebounce";

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Utilyx","version":"1.0","features":["json","regex","uuid"]}');
  const [minified, setMinified] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const debouncedInput = useDebounce(input, 300);

  const { output, error } = useMemo(() => {
    if (!debouncedInput.trim()) return { output: "", error: "" };
    try {
      const parsed = JSON.parse(debouncedInput);
      return {
        output: minified ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2),
        error: "",
      };
    } catch (e: unknown) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [debouncedInput, minified]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Paste your JSON here..."
          spellCheck={false}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setMinified(false)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            !minified ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          Format
        </button>
        <button
          onClick={() => setMinified(true)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            minified ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          Minify
        </button>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 text-sm font-mono">
          ✗ {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-auto max-h-80 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
