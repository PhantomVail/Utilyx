import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

const PERMS = ["Read", "Write", "Execute"] as const;
const BITS = [4, 2, 1];
const GROUPS = ["Owner", "Group", "Others"] as const;

export function ChmodCalc() {
  const [owner, setOwner] = useState(7);
  const [group, setGroup] = useState(5);
  const [others, setOthers] = useState(5);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const values = [owner, group, others];
  const setters = [setOwner, setGroup, setOthers];

  const toggle = (gi: number, bit: number) => {
    setters[gi]((prev) => prev ^ bit);
  };

  const symbolic = useMemo(() => {
    const chars = (v: number) =>
      `${v & 4 ? "r" : "-"}${v & 2 ? "w" : "-"}${v & 1 ? "x" : "-"}`;
    return `-${chars(owner)}${chars(group)}${chars(others)}`;
  }, [owner, group, others]);

  const numeric = `${owner}${group}${others}`;

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => k === key ? null : k), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-3 gap-3">
        {GROUPS.map((label, gi) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-3">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
              {label} ({values[gi]})
            </div>
            {PERMS.map((perm, pi) => {
              const active = !!(values[gi] & BITS[pi]);
              return (
                <button
                  key={perm}
                  onClick={() => toggle(gi, BITS[pi])}
                  className="flex items-center gap-2.5 py-1.5 w-full cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      active
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40 group-hover:border-muted-foreground"
                    }`}
                  >
                    {active && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 3.5L3.5 6L9 1" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-foreground">{perm}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="bg-surface border border-border rounded-lg p-3 flex-1 min-w-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Numeric
            </span>
            <button
              onClick={() => copy(`chmod ${numeric}`, "numeric")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === "numeric" ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            </button>
          </div>
          <code className="text-lg font-mono font-semibold text-foreground">chmod {numeric}</code>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3 flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Symbolic
            </span>
            <button
              onClick={() => copy(symbolic, "symbolic")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copiedKey === "symbolic" ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            </button>
          </div>
          <code className="text-lg font-mono font-semibold text-foreground">{symbolic}</code>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-3">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
          Quick Reference
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {[
            ["755", "Standard dir"],
            ["644", "Standard file"],
            ["700", "Private dir"],
            ["600", "Private file"],
            ["777", "Full access"],
            ["400", "Read-only owner"],
            ["444", "Read-only all"],
            ["111", "Execute only"],
          ].map(([code, desc]) => (
            <button
              key={code}
              onClick={() => {
                const digits = code.split("").map(Number);
                setOwner(digits[0]);
                setGroup(digits[1]);
                setOthers(digits[2]);
              }}
              className="flex justify-between px-2 py-1.5 rounded border border-border hover:bg-surface-hover transition-colors"
            >
              <span className="text-primary">{code}</span>
              <span className="text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
