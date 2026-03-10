import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

const BASES = [
  { label: "Decimal", key: "dec", radix: 10, prefix: "" },
  { label: "Hexadecimal", key: "hex", radix: 16, prefix: "0x" },
  { label: "Octal", key: "oct", radix: 8, prefix: "0o" },
  { label: "Binary", key: "bin", radix: 2, prefix: "0b" },
] as const;

function formatBinary(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

export function BaseConverter() {
  const [input, setInput] = useState("255");
  const [sourceBase, setSourceBase] = useState<number>(10);
  const { CopyButton } = useCopyToClipboard();

  const parsed = useMemo(() => {
    const clean = input.trim().replace(/[\s_]/g, "");
    if (!clean) return null;

    let value: bigint;
    try {
      if (sourceBase === 16) {
        value = BigInt("0x" + clean.replace(/^0x/i, ""));
      } else if (sourceBase === 8) {
        value = BigInt("0o" + clean.replace(/^0o/i, ""));
      } else if (sourceBase === 2) {
        value = BigInt("0b" + clean.replace(/^0b/i, ""));
      } else {
        value = BigInt(clean);
      }
    } catch {
      return null;
    }

    const isNeg = value < 0n;
    const abs = isNeg ? -value : value;

    return {
      dec: (isNeg ? "-" : "") + abs.toString(10),
      hex: (isNeg ? "-" : "") + abs.toString(16).toUpperCase(),
      oct: (isNeg ? "-" : "") + abs.toString(8),
      bin: (isNeg ? "-" : "") + formatBinary(abs.toString(2)),
    };
  }, [input, sourceBase]);

  const bitLength = useMemo(() => {
    if (!parsed) return 0;
    const clean = parsed.bin.replace(/[\s-]/g, "");
    return clean.length;
  }, [parsed]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Input Number
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="255"
            spellCheck={false}
          />
        </div>
        <div className="shrink-0">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Input Base
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {BASES.map((b) => (
              <button
                key={b.radix}
                onClick={() => setSourceBase(b.radix)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors ${
                  sourceBase === b.radix
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {b.label.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {parsed && (
        <>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {bitLength}-bit value
          </div>
          <div className="space-y-1.5">
            {BASES.map((b) => (
              <div
                key={b.key}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group"
              >
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-24 shrink-0">
                  {b.label}
                </span>
                <code className="flex-1 font-mono text-sm text-foreground break-all">
                  <span className="text-muted-foreground">{b.prefix}</span>
                  {parsed[b.key]}
                </code>
                <CopyButton
                  text={b.prefix + parsed[b.key]}
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto"
                />
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
              Common Values
            </label>
            <div className="flex flex-wrap gap-2">
              {["0", "127", "255", "1024", "65535", "2147483647"].map((v) => (
                <button
                  key={v}
                  onClick={() => { setInput(v); setSourceBase(10); }}
                  className="px-3 py-1.5 text-xs font-mono bg-secondary text-muted-foreground rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!parsed && input.trim() && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
          Invalid number for base {sourceBase}
        </div>
      )}
    </div>
  );
}
