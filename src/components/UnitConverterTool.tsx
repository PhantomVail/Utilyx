import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

type UnitCategory = "length" | "weight" | "temperature" | "time" | "digital" | "speed" | "area";

interface UnitDef { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const UNIT_DEFS: Record<UnitCategory, { label: string; units: UnitDef[] }> = {
  length: {
    label: "Length", units: [
      { id: "mm", label: "Millimeters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "cm", label: "Centimeters", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: "m", label: "Meters", toBase: (v) => v, fromBase: (v) => v },
      { id: "km", label: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: "in", label: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: "ft", label: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: "yd", label: "Yards", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: "mi", label: "Miles", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ]
  },
  weight: {
    label: "Weight", units: [
      { id: "mg", label: "Milligrams", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: "g", label: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "kg", label: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
      { id: "t", label: "Metric Tons", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: "oz", label: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: "lb", label: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { id: "st", label: "Stone", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    ]
  },
  temperature: {
    label: "Temperature", units: [
      { id: "c", label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { id: "f", label: "Fahrenheit", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { id: "k", label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ]
  },
  time: {
    label: "Time", units: [
      { id: "ms", label: "Milliseconds", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "s", label: "Seconds", toBase: (v) => v, fromBase: (v) => v },
      { id: "min", label: "Minutes", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: "hr", label: "Hours", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: "day", label: "Days", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: "wk", label: "Weeks", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: "yr", label: "Years", toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
    ]
  },
  digital: {
    label: "Digital", units: [
      { id: "b", label: "Bytes", toBase: (v) => v, fromBase: (v) => v },
      { id: "kb", label: "Kilobytes", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: "mb", label: "Megabytes", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { id: "gb", label: "Gigabytes", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      { id: "tb", label: "Terabytes", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      { id: "bit", label: "Bits", toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    ]
  },
  speed: {
    label: "Speed", units: [
      { id: "mps", label: "m/s", toBase: (v) => v, fromBase: (v) => v },
      { id: "kmh", label: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: "mph", label: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: "kn", label: "Knots", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { id: "mach", label: "Mach", toBase: (v) => v * 343, fromBase: (v) => v / 343 },
    ]
  },
  area: {
    label: "Area", units: [
      { id: "sqm", label: "m²", toBase: (v) => v, fromBase: (v) => v },
      { id: "sqkm", label: "km²", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: "sqft", label: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: "sqmi", label: "mi²", toBase: (v) => v * 2.59e6, fromBase: (v) => v / 2.59e6 },
      { id: "acre", label: "Acres", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { id: "ha", label: "Hectares", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ]
  },
};

const CATEGORIES: UnitCategory[] = ["length", "weight", "temperature", "time", "digital", "speed", "area"];

function formatNum(n: number): string {
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(6);
  if (Math.abs(n) > 1e12) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

export function UnitConverterTool() {
  const [cat, setCat] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [input, setInput] = useState("1");
  const { CopyButton } = useCopyToClipboard();

  const units = UNIT_DEFS[cat].units;
  const fromDef = units.find((u) => u.id === fromUnit) || units[0];
  const num = parseFloat(input);

  // Reset fromUnit when switching category
  const handleCat = (c: UnitCategory) => {
    setCat(c);
    setFromUnit(UNIT_DEFS[c].units[0].id);
  };

  const conversions = useMemo(() => {
    if (isNaN(num)) return units.map((u) => ({ ...u, value: "—" }));
    const base = fromDef.toBase(num);
    return units.map((u) => ({ ...u, value: formatNum(u.fromBase(base)) }));
  }, [num, fromDef, units]);

  const allText = conversions.map((c) => `${c.value} ${c.label}`).join("\n");

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Category</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => handleCat(c)}
              className={`px-3 py-2 text-xs font-medium transition-colors capitalize ${cat === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {UNIT_DEFS[c].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Value</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            className="w-40 bg-surface border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">From</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {units.map((u) => (
              <button key={u.id} onClick={() => setFromUnit(u.id)}
                className={`px-2.5 py-2 text-xs font-medium transition-colors ${fromUnit === u.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {u.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">All Conversions</label>
          <CopyButton text={allText} />
        </div>
        <div className="space-y-1.5">
          {conversions.map((c) => (
            <div key={c.id}
              className={`bg-surface border rounded-lg px-4 py-2 flex items-center justify-between group transition-colors ${c.id === fromUnit ? "border-primary/40" : "border-border hover:border-primary/20"}`}>
              <div>
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">({c.id})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground">{c.value}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={c.value} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
