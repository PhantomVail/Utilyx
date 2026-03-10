import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const final = pad ? padded + "=".repeat(4 - pad) : padded;
  return atob(final);
}

function parseJwt(token: string): { header: any; payload: any; signature: string } | null {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

function formatTimestamp(ts: number): string {
  try {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return new Date(ms).toLocaleString();
  } catch {
    return "Invalid";
  }
}

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzU2ODk2MDAsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const [input, setInput] = useState(SAMPLE_JWT);
  const { CopyButton } = useCopyToClipboard();

  const parsed = useMemo(() => parseJwt(input), [input]);

  const isExpired = useMemo(() => {
    if (!parsed?.payload?.exp) return null;
    return Date.now() / 1000 > parsed.payload.exp;
  }, [parsed]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">JWT Token</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary break-all"
          placeholder="Paste a JWT token..."
          spellCheck={false}
        />
      </div>

      {!parsed && input.trim() && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
          Invalid JWT token format
        </div>
      )}

      {parsed && (
        <>
          {isExpired !== null && (
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border ${
              isExpired
                ? "bg-destructive/10 border-destructive/20 text-destructive"
                : "bg-success/10 border-success/20 text-success"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isExpired ? "bg-destructive" : "bg-success"}`} />
              {isExpired ? "Token expired" : "Token valid"} — expires {formatTimestamp(parsed.payload.exp)}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Header</span>
              <CopyButton text={JSON.stringify(parsed.header, null, 2)} />
            </div>
            <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto">
              {JSON.stringify(parsed.header, null, 2)}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Payload</span>
              <CopyButton text={JSON.stringify(parsed.payload, null, 2)} />
            </div>
            <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto">
              {JSON.stringify(parsed.payload, null, 2).replace(
                /("(?:iat|exp|nbf|auth_time)":\s*)(\d+)/g,
                (_, prefix, ts) => `${prefix}${ts}  → ${formatTimestamp(parseInt(ts))}`
              )}
            </pre>
          </div>

          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Signature</span>
            <code className="text-xs font-mono text-muted-foreground break-all bg-surface border border-border rounded-lg p-4 block">
              {parsed.signature}
            </code>
          </div>
        </>
      )}
    </div>
  );
}
