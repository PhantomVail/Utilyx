import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NumberStepper } from "./NumberStepper";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function CalendarTimePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; current: boolean; date: Date }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells.push({ day: d, current: false, date: new Date(viewYear, viewMonth - 1, d) });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true, date: new Date(viewYear, viewMonth, i) });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, current: false, date: new Date(viewYear, viewMonth + 1, i) });
  }

  const isSelected = (d: Date) =>
    d.getDate() === value.getDate() &&
    d.getMonth() === value.getMonth() &&
    d.getFullYear() === value.getFullYear();

  const isToday = (d: Date) => {
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const selectDay = (d: Date) => {
    const next = new Date(value);
    next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    onChange(next);
    if (d.getMonth() !== viewMonth) {
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const setHour = (h: number) => {
    const next = new Date(value);
    next.setHours(h);
    onChange(next);
  };

  const setMinute = (m: number) => {
    const next = new Date(value);
    next.setMinutes(m);
    onChange(next);
  };

  const setSecond = (s: number) => {
    const next = new Date(value);
    next.setSeconds(s);
    onChange(next);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-widest py-1">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => (
          <button
            key={i}
            onClick={() => selectDay(cell.date)}
            className={`h-8 rounded-md text-xs font-medium transition-all ${
              isSelected(cell.date)
                ? "bg-primary text-primary-foreground"
                : isToday(cell.date)
                ? "bg-primary/10 text-primary"
                : cell.current
                ? "text-foreground hover:bg-surface-hover"
                : "text-muted-foreground/40 hover:bg-surface-hover/50"
            }`}
          >
            {cell.day}
          </button>
        ))}
      </div>

      <div className="border-t border-border pt-3">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
          Time
        </label>
        <div className="flex gap-2 items-end">
          <NumberStepper label="H" value={value.getHours()} onChange={setHour} min={0} max={23} step={1} width="w-12" />
          <span className="text-foreground font-mono text-sm pb-1">:</span>
          <NumberStepper label="M" value={value.getMinutes()} onChange={setMinute} min={0} max={59} step={1} width="w-12" />
          <span className="text-foreground font-mono text-sm pb-1">:</span>
          <NumberStepper label="S" value={value.getSeconds()} onChange={setSecond} min={0} max={59} step={1} width="w-12" />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            const now = new Date();
            onChange(now);
            setViewMonth(now.getMonth());
            setViewYear(now.getFullYear());
          }}
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
        >
          Now
        </button>
        <button
          onClick={() => {
            const next = new Date(value);
            next.setHours(0, 0, 0, 0);
            onChange(next);
          }}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          Midnight
        </button>
        <button
          onClick={() => {
            const next = new Date(value);
            next.setHours(12, 0, 0, 0);
            onChange(next);
          }}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-md hover:text-foreground transition-colors"
        >
          Noon
        </button>
      </div>
    </div>
  );
}

export function TimestampTool() {
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [calDate, setCalDate] = useState(new Date());
  const [showCal, setShowCal] = useState(false);
  const { CopyButton } = useCopyToClipboard();

  const refreshNow = () => {
    const t = Math.floor(Date.now() / 1000);
    setInput(String(t));
    setCalDate(new Date());
  };

  const parsed = useMemo(() => {
    const ts = parseInt(input);
    if (isNaN(ts)) return null;
    const ms = ts < 1e12 ? ts * 1000 : ts;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return {
      unix_s: Math.floor(ms / 1000),
      unix_ms: ms,
      iso8601: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      relative: getRelative(ms),
      day_of_week: d.toLocaleDateString("en-US", { weekday: "long" }),
      day_of_year: getDayOfYear(d),
      week_number: getWeekNumber(d),
    };
  }, [input]);

  const convertFromCal = () => {
    setInput(String(Math.floor(calDate.getTime() / 1000)));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
            Unix Timestamp
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="1234567890"
            spellCheck={false}
          />
        </div>
        <button
          onClick={refreshNow}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          Now
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Date & Time → Timestamp
          </label>
          <button
            onClick={() => setShowCal(!showCal)}
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              showCal ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {showCal ? "Hide Calendar" : "Pick Date"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground">
            {calDate.toLocaleString()} → <strong>{Math.floor(calDate.getTime() / 1000)}</strong>
          </div>
          <button
            onClick={convertFromCal}
            className="px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors border border-border shrink-0"
          >
            Convert
          </button>
        </div>

        {showCal && (
          <div className="mt-2">
            <CalendarTimePicker value={calDate} onChange={setCalDate} />
          </div>
        )}
      </div>

      {parsed && (
        <div className="space-y-1.5">
          {Object.entries(parsed).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group"
            >
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-24 shrink-0">
                {key.replace(/_/g, " ")}
              </span>
              <code className="flex-1 font-mono text-sm text-foreground truncate">{String(value)}</code>
              <CopyButton text={String(value)} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getRelative(ms: number): string {
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? "ago" : "from now";
  if (abs < 60000) return `${Math.floor(abs / 1000)}s ${suffix}`;
  if (abs < 3600000) return `${Math.floor(abs / 60000)}m ${suffix}`;
  if (abs < 86400000) return `${Math.floor(abs / 3600000)}h ${suffix}`;
  if (abs < 2592000000) return `${Math.floor(abs / 86400000)}d ${suffix}`;
  if (abs < 31536000000) return `${Math.floor(abs / 2592000000)}mo ${suffix}`;
  return `${Math.floor(abs / 31536000000)}y ${suffix}`;
}

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}
