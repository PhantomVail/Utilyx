import { useState } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV needs at least a header row and one data row");
  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || "").trim(); });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function jsonToCsv(json: string): string {
  const arr = JSON.parse(json);
  if (!Array.isArray(arr) || arr.length === 0) throw new Error("JSON must be an array of objects");
  const headers = Object.keys(arr[0]);
  const rows = arr.map((obj: any) =>
    headers.map((h) => {
      const val = String(obj[h] ?? "");
      return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

const SAMPLE_CSV = `name,email,role,department
Alice Johnson,alice@example.com,Engineer,Engineering
Bob Smith,bob@example.com,Designer,Product
Carol White,carol@example.com,Manager,Operations`;

export function CsvJsonTool() {
  const [input, setInput] = useState(SAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const { CopyButton } = useCopyToClipboard();

  const convert = () => {
    try {
      const result = mode === "csv-to-json" ? csvToJson(input) : jsonToCsv(input);
      setOutput(result);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const swap = () => {
    if (output) {
      setInput(output);
      setOutput("");
      setMode(mode === "csv-to-json" ? "json-to-csv" : "csv-to-json");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2 items-center">
        <div className="flex bg-secondary rounded-lg overflow-hidden">
          {(["csv-to-json", "json-to-csv"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                mode === m ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "csv-to-json" ? "CSV → JSON" : "JSON → CSV"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          {mode === "csv-to-json" ? "CSV Input" : "JSON Input"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck={false}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Convert
        </button>
        {output && (
          <button onClick={swap} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors">
            ↕ Swap
          </button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm font-mono">
          {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto max-h-80 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
