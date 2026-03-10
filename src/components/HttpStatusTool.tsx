import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

interface StatusCode { code: number; phrase: string; desc: string; category: string; }

const STATUS_CODES: StatusCode[] = [
  // 1xx
  { code: 100, phrase: "Continue", desc: "Server received headers, client should send body", category: "1xx Info" },
  { code: 101, phrase: "Switching Protocols", desc: "Server switching to protocol requested via Upgrade header", category: "1xx Info" },
  { code: 102, phrase: "Processing", desc: "Server received and is processing, no response yet (WebDAV)", category: "1xx Info" },
  { code: 103, phrase: "Early Hints", desc: "Send preload headers before final response", category: "1xx Info" },
  // 2xx
  { code: 200, phrase: "OK", desc: "Standard success response", category: "2xx Success" },
  { code: 201, phrase: "Created", desc: "Resource created successfully, typically from POST", category: "2xx Success" },
  { code: 202, phrase: "Accepted", desc: "Request accepted for processing, not yet completed", category: "2xx Success" },
  { code: 204, phrase: "No Content", desc: "Success but no body in response, common for DELETE", category: "2xx Success" },
  { code: 206, phrase: "Partial Content", desc: "Partial resource delivery via Range header", category: "2xx Success" },
  { code: 207, phrase: "Multi-Status", desc: "Multiple status codes for sub-requests (WebDAV)", category: "2xx Success" },
  // 3xx
  { code: 301, phrase: "Moved Permanently", desc: "Resource permanently moved to new URL, update bookmarks", category: "3xx Redirect" },
  { code: 302, phrase: "Found", desc: "Temporary redirect, keep using original URL", category: "3xx Redirect" },
  { code: 303, phrase: "See Other", desc: "Redirect with GET method, used after POST", category: "3xx Redirect" },
  { code: 304, phrase: "Not Modified", desc: "Cached version still valid, use local copy", category: "3xx Redirect" },
  { code: 307, phrase: "Temporary Redirect", desc: "Temporary redirect preserving HTTP method", category: "3xx Redirect" },
  { code: 308, phrase: "Permanent Redirect", desc: "Permanent redirect preserving HTTP method", category: "3xx Redirect" },
  // 4xx
  { code: 400, phrase: "Bad Request", desc: "Malformed syntax, invalid parameters, or missing fields", category: "4xx Client" },
  { code: 401, phrase: "Unauthorized", desc: "Authentication required — missing or invalid credentials", category: "4xx Client" },
  { code: 403, phrase: "Forbidden", desc: "Authenticated but lacking permission for this resource", category: "4xx Client" },
  { code: 404, phrase: "Not Found", desc: "Resource does not exist at this URL", category: "4xx Client" },
  { code: 405, phrase: "Method Not Allowed", desc: "HTTP method not supported for this endpoint", category: "4xx Client" },
  { code: 406, phrase: "Not Acceptable", desc: "No content matching Accept headers available", category: "4xx Client" },
  { code: 408, phrase: "Request Timeout", desc: "Server timed out waiting for the request", category: "4xx Client" },
  { code: 409, phrase: "Conflict", desc: "Request conflicts with current resource state", category: "4xx Client" },
  { code: 410, phrase: "Gone", desc: "Resource permanently removed, no forwarding address", category: "4xx Client" },
  { code: 413, phrase: "Payload Too Large", desc: "Request body exceeds server size limit", category: "4xx Client" },
  { code: 415, phrase: "Unsupported Media Type", desc: "Content-Type not supported by endpoint", category: "4xx Client" },
  { code: 418, phrase: "I'm a Teapot", desc: "Server refuses to brew coffee with a teapot (RFC 2324)", category: "4xx Client" },
  { code: 422, phrase: "Unprocessable Entity", desc: "Well-formed but semantically invalid request", category: "4xx Client" },
  { code: 429, phrase: "Too Many Requests", desc: "Rate limit exceeded, check Retry-After header", category: "4xx Client" },
  { code: 451, phrase: "Unavailable For Legal Reasons", desc: "Censored or blocked due to legal demand", category: "4xx Client" },
  // 5xx
  { code: 500, phrase: "Internal Server Error", desc: "Unexpected server-side failure", category: "5xx Server" },
  { code: 501, phrase: "Not Implemented", desc: "Server doesn't support the functionality required", category: "5xx Server" },
  { code: 502, phrase: "Bad Gateway", desc: "Invalid response from upstream server", category: "5xx Server" },
  { code: 503, phrase: "Service Unavailable", desc: "Server temporarily overloaded or in maintenance", category: "5xx Server" },
  { code: 504, phrase: "Gateway Timeout", desc: "Upstream server didn't respond in time", category: "5xx Server" },
  { code: 507, phrase: "Insufficient Storage", desc: "Server cannot store the representation (WebDAV)", category: "5xx Server" },
  { code: 508, phrase: "Loop Detected", desc: "Infinite loop detected processing request (WebDAV)", category: "5xx Server" },
  { code: 511, phrase: "Network Authentication Required", desc: "Client must authenticate to gain network access", category: "5xx Server" },
];

const CATEGORIES = ["All", "1xx Info", "2xx Success", "3xx Redirect", "4xx Client", "5xx Server"];

function categoryColor(cat: string): string {
  if (cat.startsWith("1")) return "text-blue-400";
  if (cat.startsWith("2")) return "text-emerald-400";
  if (cat.startsWith("3")) return "text-amber-400";
  if (cat.startsWith("4")) return "text-orange-400";
  if (cat.startsWith("5")) return "text-red-400";
  return "text-muted-foreground";
}

export function HttpStatusTool() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { CopyButton } = useCopyToClipboard();

  const filtered = useMemo(() => {
    return STATUS_CODES.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return String(s.code).includes(q) || s.phrase.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, category]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Search</label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or phrase…"
          className="w-full max-w-md bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Category</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${category === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{filtered.length} status codes</span>
        <CopyButton text={filtered.map((s) => `${s.code} ${s.phrase}: ${s.desc}`).join("\n")} />
      </div>

      <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
        {filtered.map((s) => (
          <div key={s.code} className="bg-surface border border-border rounded-lg px-4 py-2.5 flex items-start gap-3 group hover:border-primary/30 transition-colors">
            <span className={`font-mono text-sm font-bold shrink-0 w-10 ${categoryColor(s.category)}`}>{s.code}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">{s.phrase}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <CopyButton text={`${s.code} ${s.phrase}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
