import { useState, useEffect, useCallback } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { useDebounce } from "../hooks/useDebounce";
import { FileDropZone } from "./FileDropZone";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
const ALGORITHMS: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

async function computeHash(data: ArrayBuffer, algo: Algorithm): Promise<string> {
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashTool() {
  const [input, setInput] = useState("Hello, Utilyx!");
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { CopyButton } = useCopyToClipboard();

  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    let cancelled = false;
    const data = (fileBytes ? fileBytes.buffer : new TextEncoder().encode(debouncedInput).buffer) as ArrayBuffer;
    (async () => {
      const results: Record<string, string> = {};
      for (const algo of ALGORITHMS) {
        results[algo] = await computeHash(data, algo);
      }
      if (!cancelled) setHashes(results);
    })();
    return () => { cancelled = true; };
  }, [debouncedInput, fileBytes]);

  const handleFile = useCallback((bytes: Uint8Array, name: string) => {
    setFileBytes(bytes);
    setFileName(name);
  }, []);

  const clearFile = () => {
    setFileBytes(null);
    setFileName("");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        {fileBytes ? (
          <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-mono text-foreground truncate">{fileName} ({(fileBytes.length / 1024).toFixed(1)} KB)</span>
            <button onClick={clearFile} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary transition-colors">Clear</button>
          </div>
        ) : (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-28 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter text to hash..."
              spellCheck={false}
            />
            <div className="mt-2">
              <FileDropZone onFileContent={() => {}} onFileBytes={handleFile} binary label="Or drop a file to hash" />
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        {ALGORITHMS.map((algo) => (
          <div key={algo} className="bg-surface border border-border rounded-lg px-4 py-3 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{algo}</span>
              <CopyButton text={hashes[algo] || ""} className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
            </div>
            <code className="text-xs font-mono text-foreground break-all leading-relaxed">{hashes[algo] || "…"}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
