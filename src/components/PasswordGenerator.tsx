import { useState, useCallback } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import { CustomSlider } from "./CustomSlider";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generateUnbiased(length: number, chars: string): string {
  const result: string[] = [];
  const max = Math.floor(0xFFFFFFFF / chars.length) * chars.length;
  while (result.length < length) {
    const arr = new Uint32Array(length * 2);
    crypto.getRandomValues(arr);
    for (const v of arr) {
      if (v < max) result.push(chars[v % chars.length]);
      if (result.length === length) break;
    }
  }
  return result.join("");
}

function generatePassword(length: number, options: {
  lowercase: boolean; uppercase: boolean; numbers: boolean; symbols: boolean;
}): string {
  let chars = "";
  if (options.lowercase) chars += LOWERCASE;
  if (options.uppercase) chars += UPPERCASE;
  if (options.numbers) chars += NUMBERS;
  if (options.symbols) chars += SYMBOLS;
  if (!chars) chars = LOWERCASE + UPPERCASE + NUMBERS;

  return generateUnbiased(length, chars);
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 20) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 4) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 5) return { score, label: "Strong", color: "bg-primary" };
  return { score, label: "Very Strong", color: "bg-success" };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({ lowercase: true, uppercase: true, numbers: true, symbols: true });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generatePassword(20, { lowercase: true, uppercase: true, numbers: true, symbols: true }))
  );
  const [showPasswords, setShowPasswords] = useState(true);
  const { CopyButton } = useCopyToClipboard();

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, options)));
  }, [length, options, count]);

  const toggle = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <CustomSlider label={`Length`} value={length} onChange={setLength} min={4} max={64} step={1} width="w-48" />
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Count</label>
          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
            <button onClick={() => setCount(Math.max(1, count - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm">−</button>
            <span className="w-8 text-center font-mono text-sm text-foreground">{count}</span>
            <button onClick={() => setCount(Math.min(20, count + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm">+</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              options[key]
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            {key === "lowercase" ? "a-z" : key === "uppercase" ? "A-Z" : key === "numbers" ? "0-9" : "!@#"}
          </button>
        ))}
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="px-3 py-2 rounded-lg text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          {showPasswords ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPasswords ? "Hide" : "Show"}
        </button>
      </div>

      <button onClick={generate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2">
        <RefreshCw size={14} /> Generate
      </button>

      <div className="space-y-1.5">
        {passwords.map((pw, i) => {
          const strength = getStrength(pw);
          return (
            <div key={i} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group">
              <code className="flex-1 font-mono text-sm text-foreground truncate">
                {showPasswords ? pw : "•".repeat(pw.length)}
              </code>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: `${(strength.score / 7) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground w-14">{strength.label}</span>
              </div>
              <CopyButton text={pw} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
