import { useState, useCallback, useRef, useEffect } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { RefreshCw, Download, ChevronDown, Check } from "lucide-react";
import { generateRecord, type DataType, type FakeRecord } from "../lib/fakeData";

const DATA_TYPES: { id: DataType; label: string }[] = [
  { id: "person", label: "People" },
  { id: "address", label: "Addresses" },
  { id: "company", label: "Companies" },
  { id: "network", label: "Network" },
  { id: "product", label: "Products" },
  { id: "payment", label: "Payments" },
  { id: "event", label: "Events" },
  { id: "gps", label: "GPS Coordinates" },
  { id: "ipaddress", label: "IP Addresses" },
  { id: "vehicle", label: "Vehicles" },
  { id: "crypto", label: "Crypto Wallets" },
  { id: "dns", label: "DNS Records" },
];

function CustomSelect({ types, value, onChange }: { types: typeof DATA_TYPES; value: DataType; onChange: (v: DataType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = types.find((t) => t.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Type</label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 min-w-[180px] bg-surface border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <span>{selected?.label}</span>
        <ChevronDown size={12} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] bg-surface border border-border rounded-lg shadow-lg py-1 max-h-[280px] overflow-y-auto">
          {types.map((dt) => (
            <button
              key={dt.id}
              onClick={() => { onChange(dt.id); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                value === dt.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <span>{dt.label}</span>
              {value === dt.id && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FakerTool() {
  const [type, setType] = useState<DataType>("person");
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"json" | "csv" | "sql">("json");
  const [data, setData] = useState<FakeRecord[]>(() => Array.from({ length: 5 }, () => generateRecord("person")));
  const { CopyButton } = useCopyToClipboard();

  const generate = useCallback(() => {
    setData(Array.from({ length: count }, () => generateRecord(type)));
  }, [type, count]);

  const output = (() => {
    if (format === "json") return JSON.stringify(data, null, 2);
    if (format === "csv") {
      const headers = Object.keys(data[0] || {});
      return [headers.join(","), ...data.map((r) =>
        headers.map((h) => {
          const val = String(r[h] ?? "");
          return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",")
      )].join("\n");
    }
    const table = type + "s";
    const headers = Object.keys(data[0] || {});
    return data.map((r) =>
      `INSERT INTO ${table} (${headers.join(", ")}) VALUES (${headers.map(h => `'${String(r[h] ?? "").replace(/'/g, "''")}'`).join(", ")});`
    ).join("\n");
  })();

  const downloadData = () => {
    const ext = format === "json" ? "json" : format === "csv" ? "csv" : "sql";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-data-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <CustomSelect types={DATA_TYPES} value={type} onChange={setType} />
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Count</label>
          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
            <button onClick={() => setCount(Math.max(1, count - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">−</button>
            <input
              type="text" inputMode="numeric" value={count}
              onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n)) setCount(Math.min(1000, Math.max(1, n))); }}
              className="w-12 text-center bg-transparent font-mono text-sm text-foreground focus:outline-none border-x border-border py-2"
            />
            <button onClick={() => setCount(Math.min(1000, count + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">+</button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Format</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["json", "csv", "sql"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-2 text-xs font-mono font-medium transition-colors ${
                  format === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={generate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Generate
        </button>
        {data.length > 0 && (
          <button onClick={downloadData}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2">
            <Download size={14} />
            Download
          </button>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output — {data.length} records</span>
          <CopyButton text={output} />
        </div>
        <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
          {output}
        </pre>
      </div>
    </div>
  );
}
