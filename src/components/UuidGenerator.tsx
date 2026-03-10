import { useState, useCallback } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { NumberStepper } from "./NumberStepper";

function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUUID));
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"lowercase" | "uppercase" | "no-dashes">("lowercase");
  const { CopyButton } = useCopyToClipboard();

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, generateUUID));
  }, [count]);

  const formatUuid = (uuid: string) => {
    if (format === "uppercase") return uuid.toUpperCase();
    if (format === "no-dashes") return uuid.replace(/-/g, "");
    return uuid;
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Count</label>
          <NumberStepper value={count} onChange={setCount} min={1} max={100} />
        </div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Format</label>
          <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
            {(["lowercase", "uppercase", "no-dashes"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-2.5 text-xs font-mono transition-colors ${
                  format === f
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Generate
        </button>
      </div>
      <div className="space-y-1.5">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2.5 group">
            <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">#{i + 1}</span>
            <code className="flex-1 font-mono text-sm text-foreground">{formatUuid(uuid)}</code>
            <CopyButton text={formatUuid(uuid)} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      <CopyButton text={uuids.map(formatUuid).join("\n")} className="w-full justify-center" />
    </div>
  );
}
