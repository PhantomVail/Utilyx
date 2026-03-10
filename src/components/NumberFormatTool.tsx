import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

type FormatStyle = "decimal" | "currency" | "percent" | "scientific" | "compact" | "bytes" | "ordinal";

const LOCALES = [
  { id: "en-US", label: "en-US" }, { id: "en-GB", label: "en-GB" },
  { id: "de-DE", label: "de-DE" }, { id: "fr-FR", label: "fr-FR" },
  { id: "ja-JP", label: "ja-JP" }, { id: "zh-CN", label: "zh-CN" },
  { id: "ar-SA", label: "ar-SA" }, { id: "hi-IN", label: "hi-IN" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CNY", "INR", "BRL", "CAD", "AUD", "CHF"];

const STYLES: { id: FormatStyle; label: string }[] = [
  { id: "decimal", label: "Decimal" },
  { id: "currency", label: "Currency" },
  { id: "percent", label: "Percent" },
  { id: "scientific", label: "Scientific" },
  { id: "compact", label: "Compact" },
  { id: "bytes", label: "Bytes" },
  { id: "ordinal", label: "Ordinal" },
];

function formatBytes(n: number): string {
  if (n === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(Math.abs(n)) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function NumberFormatTool() {
  const [input, setInput] = useState("1234567.89");
  const [style, setStyle] = useState<FormatStyle>("decimal");
  const [locale, setLocale] = useState("en-US");
  const [currency, setCurrency] = useState("USD");
  const [minFrac, setMinFrac] = useState(0);
  const [maxFrac, setMaxFrac] = useState(2);
  const [useGrouping, setUseGrouping] = useState(true);
  const [notation, setNotation] = useState<"standard" | "engineering">("standard");
  const { CopyButton } = useCopyToClipboard();

  const num = parseFloat(input);

  const formatted = useMemo(() => {
    if (isNaN(num)) return "Invalid number";
    try {
      switch (style) {
        case "bytes": return formatBytes(num);
        case "ordinal": return ordinal(Math.round(num));
        case "scientific": return num.toExponential(maxFrac);
        case "compact":
          return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: maxFrac }).format(num);
        case "currency":
          return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac, useGrouping }).format(num);
        case "percent":
          return new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac }).format(num);
        default:
          return new Intl.NumberFormat(locale, { notation, minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac, useGrouping }).format(num);
      }
    } catch { return "Format error"; }
  }, [num, style, locale, currency, minFrac, maxFrac, useGrouping, notation]);

  const allFormats = useMemo(() => {
    if (isNaN(num)) return [];
    return LOCALES.map((l) => {
      try {
        const opts: Intl.NumberFormatOptions = style === "currency"
          ? { style: "currency", currency, maximumFractionDigits: maxFrac }
          : style === "percent"
          ? { style: "percent", maximumFractionDigits: maxFrac }
          : { maximumFractionDigits: maxFrac, useGrouping };
        return { locale: l.id, result: new Intl.NumberFormat(l.id, opts).format(num) };
      } catch { return { locale: l.id, result: "—" }; }
    });
  }, [num, style, currency, maxFrac, useGrouping]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Number Input</label>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full max-w-md bg-surface border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Style</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {STYLES.map((s) => (
            <button key={s.id} onClick={() => setStyle(s.id)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${style === s.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Locale</label>
          <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
            {LOCALES.map((l) => (
              <button key={l.id} onClick={() => setLocale(l.id)}
                className={`px-2.5 py-2 text-xs font-mono font-medium transition-colors ${locale === l.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {style === "currency" && (
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Currency</label>
            <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
              {CURRENCIES.map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-2.5 py-2 text-xs font-mono font-medium transition-colors ${currency === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Min Decimals</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {[0, 1, 2, 3, 4, 6].map((n) => (
              <button key={n} onClick={() => setMinFrac(n)}
                className={`px-2.5 py-1.5 text-xs font-mono transition-colors ${minFrac === n ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Max Decimals</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {[0, 1, 2, 3, 4, 6, 8].map((n) => (
              <button key={n} onClick={() => setMaxFrac(n)}
                className={`px-2.5 py-1.5 text-xs font-mono transition-colors ${maxFrac === n ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Grouping</label>
          <button onClick={() => setUseGrouping(!useGrouping)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${useGrouping ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
            {useGrouping ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Result */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Result</label>
          <CopyButton text={formatted} />
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground">
          {formatted}
        </div>
      </div>

      {/* All locales */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">All Locales</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allFormats.map((f) => (
            <div key={f.locale} className="bg-surface border border-border rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground font-mono mb-0.5">{f.locale}</div>
              <div className="text-xs font-mono text-foreground truncate">{f.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
