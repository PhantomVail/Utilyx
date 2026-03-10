import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react";

const SECRET_PATTERNS = /^.*(SECRET|KEY|TOKEN|PASSWORD|PASS|PRIVATE|API_KEY|AUTH|CREDENTIAL).*$/i;

interface EnvVar {
  key: string;
  value: string;
  line: number;
  hasIssue?: string;
}

function parseEnv(text: string): EnvVar[] {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return null;
    
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return { key: trimmed, value: "", line: i + 1, hasIssue: "Missing value" };
    
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    const issues: string[] = [];
    if (!key.match(/^[A-Z_][A-Z0-9_]*$/i)) issues.push("Non-standard key format");
    if (value.includes(" ") && !trimmed.includes('"') && !trimmed.includes("'")) issues.push("Unquoted value with spaces");

    return { key, value, line: i + 1, hasIssue: issues[0] };
  }).filter(Boolean) as EnvVar[];
}

const SAMPLE = `# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
DATABASE_POOL_SIZE=10

# API Keys
API_KEY=sk_live_abc123def456
STRIPE_SECRET=sk_test_xyz789
SENDGRID_KEY=SG.abcdef

# App Config
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://myapp.com
DEBUG=false

# This has issues
bad key=value
UNQUOTED=hello world`;

function isSecret(key: string): boolean {
  return SECRET_PATTERNS.test(key);
}

function maskValue(value: string): string {
  if (value.length <= 4) return "••••";
  return value.slice(0, 3) + "•".repeat(Math.min(value.length - 3, 20)) + "…";
}

export function EnvEditor() {
  const [input, setInput] = useState(SAMPLE);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const { CopyButton } = useCopyToClipboard();

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const vars = useMemo(() => parseEnv(input), [input]);
  const issues = vars.filter((v) => v.hasIssue);
  const groups = useMemo(() => {
    const map = new Map<string, EnvVar[]>();
    for (const v of vars) {
      const prefix = v.key.split("_")[0] || "OTHER";
      if (!map.has(prefix)) map.set(prefix, []);
      map.get(prefix)!.push(v);
    }
    return map;
  }, [vars]);

  const exportAsJson = () => {
    const obj: Record<string, string> = {};
    vars.forEach((v) => { obj[v.key] = v.value; });
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">.env Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Status */}
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-success">
          <CheckCircle size={12} /> {vars.length - issues.length} valid
        </span>
        {issues.length > 0 && (
          <span className="flex items-center gap-1.5 text-warning">
            <AlertTriangle size={12} /> {issues.length} issues
          </span>
        )}
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="space-y-1">
          {issues.map((v, i) => (
            <div key={i} className="flex items-center gap-2 bg-warning/5 border border-warning/15 rounded-lg px-3 py-2 text-xs">
              <AlertTriangle size={12} className="text-warning shrink-0" />
              <span className="text-muted-foreground">Line {v.line}:</span>
              <code className="text-foreground font-mono">{v.key}</code>
              <span className="text-warning ml-auto">{v.hasIssue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Parsed table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Parsed — {vars.length} variables
          </span>
          <CopyButton text={exportAsJson()} />
        </div>
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {Array.from(groups.entries()).map(([prefix, groupVars]) => (
            <div key={prefix}>
              <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest bg-secondary/50 border-b border-border">
                {prefix}
              </div>
              {groupVars.map((v, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs font-mono border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors">
                  <span className="text-primary font-medium min-w-[160px]">{v.key}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-foreground truncate flex-1">
                    {!v.value ? (
                      <em className="text-muted-foreground">empty</em>
                    ) : isSecret(v.key) && !revealedKeys.has(v.key) ? (
                      <span className="text-muted-foreground">{maskValue(v.value)}</span>
                    ) : (
                      v.value
                    )}
                  </span>
                  {isSecret(v.key) && v.value && (
                    <button onClick={() => toggleReveal(v.key)} className="text-muted-foreground hover:text-foreground shrink-0">
                      {revealedKeys.has(v.key) ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  )}
                  {v.hasIssue && <AlertTriangle size={12} className="text-warning shrink-0" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
