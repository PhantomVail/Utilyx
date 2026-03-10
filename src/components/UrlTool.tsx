import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

export function UrlTool() {
  const [input, setInput] = useState("https://api.example.com/search?q=hello+world&page=1&limit=20&sort=relevance&filter[status]=active&filter[type]=premium&utm_source=google&utm_medium=cpc&utm_campaign=spring_2024#results");
  const { CopyButton } = useCopyToClipboard();

  const parsed = useMemo(() => {
    try {
      const url = new URL(input);
      const params: [string, string][] = [];
      url.searchParams.forEach((v, k) => params.push([k, v]));
      return {
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        params,
      };
    } catch {
      return null;
    }
  }, [input]);

  const encoded = useMemo(() => {
    try { return encodeURIComponent(input); } catch { return ""; }
  }, [input]);

  const decoded = useMemo(() => {
    try { return decodeURIComponent(input); } catch { return input; }
  }, [input]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">URL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-20 bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary break-all"
          placeholder="Enter a URL..."
          spellCheck={false}
        />
      </div>

      {parsed && (
        <>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Components</span>
            <div className="space-y-1.5">
              {(["protocol","hostname","port","pathname","hash","origin"] as const).map((key) => (
                <div key={key} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2 group">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-20 shrink-0">{key}</span>
                  <code className="flex-1 font-mono text-xs text-foreground truncate">{parsed[key]}</code>
                  <CopyButton text={String(parsed[key])} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {parsed.params.length > 0 && (
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">
                Query Parameters ({parsed.params.length})
              </span>
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                {parsed.params.map(([k, v], i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-border/50 last:border-0 text-xs font-mono group hover:bg-surface-hover transition-colors">
                    <span className="text-primary font-medium min-w-[120px]">{k}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground flex-1 truncate">{v}</span>
                    <CopyButton text={v} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Encoded</span>
            <CopyButton text={encoded} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground overflow-auto max-h-20 break-all whitespace-pre-wrap">{encoded}</pre>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Decoded</span>
            <CopyButton text={decoded} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground overflow-auto max-h-20 break-all whitespace-pre-wrap">{decoded}</pre>
        </div>
      </div>
    </div>
  );
}
