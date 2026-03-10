import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

interface MaskRule {
  id: string;
  label: string;
  description: string;
  pattern: RegExp;
  mask: (match: string) => string;
  enabled: boolean;
}

const DEFAULT_RULES: MaskRule[] = [
  {
    id: "email",
    label: "Emails",
    description: "john.doe@gmail.com → j***@g***.com",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    mask: (m) => {
      const [local, domain] = m.split("@");
      const [dname, ...ext] = domain.split(".");
      return `${local[0]}***@${dname[0]}***.${ext.join(".")}`;
    },
    enabled: true,
  },
  {
    id: "phone",
    label: "Phone Numbers",
    description: "+1 (555) 123-4567 → +1 (***) ***-4567",
    pattern: /(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    mask: (m) => m.replace(/\d(?=\d{4})/g, "*"),
    enabled: true,
  },
  {
    id: "ssn",
    label: "SSN",
    description: "123-45-6789 → ***-**-6789",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    mask: (m) => `***-**-${m.slice(-4)}`,
    enabled: true,
  },
  {
    id: "cc",
    label: "Credit Cards",
    description: "4532 1234 5678 9012 → **** **** **** 9012",
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    mask: (m) => `**** **** **** ${m.replace(/[\s-]/g, "").slice(-4)}`,
    enabled: true,
  },
  {
    id: "ip",
    label: "IP Addresses",
    description: "192.168.1.100 → ***.***.***.100",
    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    mask: (m) => {
      const parts = m.split(".");
      return `***.***.***.${parts[3]}`;
    },
    enabled: true,
  },
];

const SAMPLE = `Customer: John Doe
Email: john.doe@gmail.com
Phone: +1 (555) 123-4567
SSN: 123-45-6789
Card: 4532 1234 5678 9012
IP: 192.168.1.100
Secondary email: jane.smith@outlook.com
Alt phone: 555-987-6543`;

export function DataMasker() {
  const [input, setInput] = useState(SAMPLE);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const { CopyButton } = useCopyToClipboard();

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const output = useMemo(() => {
    let result = input;
    for (const rule of rules) {
      if (rule.enabled) {
        result = result.replace(rule.pattern, rule.mask);
      }
    }
    return result;
  }, [input, rules]);

  const maskCount = useMemo(() => {
    let count = 0;
    for (const rule of rules) {
      if (rule.enabled) {
        const matches = input.match(rule.pattern);
        if (matches) count += matches.length;
      }
    }
    return count;
  }, [input, rules]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Rules</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {rules.map((rule) => (
            <button
              key={rule.id}
              onClick={() => toggleRule(rule.id)}
              className={`px-3 py-2.5 rounded-lg text-xs text-left transition-all border ${
                rule.enabled
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-medium">{rule.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5 truncate">{rule.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Paste text containing sensitive data..."
          spellCheck={false}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Masked Output — {maskCount} items masked
          </span>
          <CopyButton text={output} />
        </div>
        <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-auto max-h-60 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
