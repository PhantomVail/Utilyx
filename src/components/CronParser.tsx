import { useState, useMemo } from "react";

const CRON_FIELDS = ["minute", "hour", "day (month)", "month", "day (week)"] as const;
const MONTH_NAMES = ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const PRESETS: { label: string; cron: string }[] = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every 6 hours", cron: "0 */6 * * *" },
  { label: "Daily at midnight", cron: "0 0 * * *" },
  { label: "Daily at 9 AM", cron: "0 9 * * *" },
  { label: "Weekly on Monday", cron: "0 0 * * 1" },
  { label: "Monthly on the 1st", cron: "0 0 1 * *" },
  { label: "Yearly on Jan 1st", cron: "0 0 1 1 *" },
  { label: "Weekdays at 9 AM", cron: "0 9 * * 1-5" },
  { label: "Every 30 seconds (not standard)", cron: "*/30 * * * * *" },
];

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return "Invalid cron expression (need 5 fields)";

  const [min, hour, dom, month, dow] = parts;

  const pieces: string[] = [];

  // Minute
  if (min === "*") pieces.push("Every minute");
  else if (min.startsWith("*/")) pieces.push(`Every ${min.slice(2)} minutes`);
  else pieces.push(`At minute ${min}`);

  // Hour
  if (hour === "*") { /* already covered */ }
  else if (hour.startsWith("*/")) pieces.push(`every ${hour.slice(2)} hours`);
  else {
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    pieces.push(`at ${h12}:${min === "*" ? "00" : min.padStart(2, "0")} ${ampm}`);
  }

  // Day of month
  if (dom !== "*") {
    if (dom.startsWith("*/")) pieces.push(`every ${dom.slice(2)} days`);
    else pieces.push(`on day ${dom}`);
  }

  // Month
  if (month !== "*") {
    if (month.includes("-")) {
      const [s, e] = month.split("-").map(Number);
      pieces.push(`in ${MONTH_NAMES[s] || s}-${MONTH_NAMES[e] || e}`);
    } else {
      const m = parseInt(month);
      pieces.push(`in ${MONTH_NAMES[m] || month}`);
    }
  }

  // Day of week
  if (dow !== "*") {
    if (dow.includes("-")) {
      const [s, e] = dow.split("-").map(Number);
      pieces.push(`on ${DAY_NAMES[s] || s}-${DAY_NAMES[e] || e}`);
    } else if (dow.includes(",")) {
      const days = dow.split(",").map(d => DAY_NAMES[parseInt(d)] || d);
      pieces.push(`on ${days.join(", ")}`);
    } else {
      pieces.push(`on ${DAY_NAMES[parseInt(dow)] || dow}`);
    }
  }

  return pieces.join(", ");
}

function getNextRuns(expr: string, count = 5): string[] {
  try {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return [];
    const [minP, hourP, domP, monthP, dowP] = parts;

    const results: string[] = [];
    const now = new Date();
    const check = new Date(now);
    check.setSeconds(0);
    check.setMilliseconds(0);

    for (let i = 0; i < 525960 && results.length < count; i++) {
      check.setMinutes(check.getMinutes() + 1);

      if (!matchField(minP, check.getMinutes())) continue;
      if (!matchField(hourP, check.getHours())) continue;
      if (!matchField(domP, check.getDate())) continue;
      if (!matchField(monthP, check.getMonth() + 1)) continue;
      if (!matchField(dowP, check.getDay())) continue;

      results.push(check.toLocaleString());
    }

    return results;
  } catch {
    return [];
  }
}

function matchField(pattern: string, value: number): boolean {
  if (pattern === "*") return true;
  if (pattern.startsWith("*/")) return value % parseInt(pattern.slice(2)) === 0;
  if (pattern.includes(",")) return pattern.split(",").some(p => matchField(p, value));
  if (pattern.includes("-")) {
    const [s, e] = pattern.split("-").map(Number);
    return value >= s && value <= e;
  }
  return parseInt(pattern) === value;
}

export function CronParser() {
  const [input, setInput] = useState("0 9 * * 1-5");

  const description = useMemo(() => describeCron(input), [input]);
  const nextRuns = useMemo(() => getNextRuns(input), [input]);
  const parts = input.trim().split(/\s+/);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Cron Expression</label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary tracking-widest"
          placeholder="* * * * *"
          spellCheck={false}
        />
      </div>

      {/* Field labels */}
      {parts.length >= 5 && (
        <div className="flex justify-center gap-1">
          {parts.slice(0, 5).map((part, i) => (
            <div key={i} className="flex flex-col items-center">
              <code className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded">{part}</code>
              <span className="text-[9px] text-muted-foreground mt-1">{CRON_FIELDS[i]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="bg-surface border border-border rounded-lg p-4 text-center">
        <p className="text-sm text-foreground font-medium">{description}</p>
      </div>

      {/* Presets */}
      <div>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Presets</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.cron}
              onClick={() => setInput(p.cron)}
              className={`px-3 py-2 rounded-lg text-xs text-left transition-all border ${
                input === p.cron
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-medium">{p.label}</div>
              <code className="text-[10px] opacity-60">{p.cron}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Next {nextRuns.length} runs</span>
          <div className="space-y-1">
            {nextRuns.map((run, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2 text-xs font-mono">
                <span className="text-muted-foreground w-4">#{i + 1}</span>
                <span className="text-foreground">{run}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
