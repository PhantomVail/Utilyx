import { useState, useCallback } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { FileDropZone } from "./FileDropZone";

export function Base64Tool() {
  const [input, setInput] = useState("Hello, Utilyx!");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { CopyButton } = useCopyToClipboard();

  const encode = () => {
    try {
      const bytes = new TextEncoder().encode(input);
      setOutput(btoa(String.fromCharCode(...bytes)));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Encoding failed");
    }
  };

  const decode = () => {
    try {
      const binary = atob(input);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError("");
    } catch {
      setError("Invalid Base64 string");
    }
  };

  const handleFileBytes = useCallback((bytes: Uint8Array, _name: string) => {
    // Convert binary to base64
    const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
    const b64 = btoa(binary);
    setInput(b64);
    setOutput("");
    setError("");
  }, []);

  const handleFileText = useCallback((content: string) => {
    setInput(content);
    setOutput("");
    setError("");
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter text or Base64 string..."
          spellCheck={false}
        />
        <div className="mt-2">
          <FileDropZone
            onFileContent={handleFileText}
            onFileBytes={handleFileBytes}
            binary
            label="Or drop a file to encode"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={encode} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Encode →
        </button>
        <button onClick={decode} className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-surface-hover transition-colors">
          ← Decode
        </button>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 text-sm font-mono">
          ✗ {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-auto max-h-60 whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
