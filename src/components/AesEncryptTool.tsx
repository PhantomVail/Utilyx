import { useState, useMemo, useCallback } from "react";
import { useCopyToClipboard } from "./CopyButton";
import { FileDropZone } from "./FileDropZone";

// --- AES-GCM using Web Crypto API (all client-side) ---
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    "raw", rawKey.buffer as ArrayBuffer, { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function aesEncrypt(plaintext: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(encoded: string, password: string): Promise<string> {
  const data = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AesEncryptTool() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checksum, setChecksum] = useState("");
  const { CopyButton } = useCopyToClipboard();

  const process = useCallback(async () => {
    if (!input || !password) {
      setError("Both input and password are required");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      if (mode === "encrypt") {
        const encrypted = await aesEncrypt(input, password);
        setOutput(encrypted);
        setChecksum(await sha256(input));
      } else {
        const decrypted = await aesDecrypt(input, password);
        setOutput(decrypted);
        setChecksum(await sha256(decrypted));
      }
    } catch {
      setError(mode === "decrypt" ? "Decryption failed — wrong password or corrupted data" : "Encryption failed");
      setOutput("");
      setChecksum("");
    }
    setProcessing(false);
  }, [input, password, mode]);

  const handleFileText = useCallback((content: string) => {
    setInput(content);
    setOutput("");
    setError("");
  }, []);

  const outputSize = useMemo(() => {
    if (!output) return null;
    const bytes = new TextEncoder().encode(output).length;
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  }, [output]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden w-fit">
        <button
          onClick={() => { setMode("encrypt"); setOutput(""); setError(""); }}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            mode === "encrypt"
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          Encrypt
        </button>
        <button
          onClick={() => { setMode("decrypt"); setOutput(""); setError(""); }}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            mode === "decrypt"
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          Decrypt
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-primary shrink-0"><path d="M6 1L1 6l5 5m5-5H1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 6 6)" /></svg>
          <span>AES-256-GCM with PBKDF2 key derivation. Everything runs locally in your browser — no data leaves this page.</span>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Password / Key
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-16"
              placeholder="Enter password..."
              spellCheck={false}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={() => {
              const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
              const arr = crypto.getRandomValues(new Uint8Array(24));
              setPassword(Array.from(arr, (b) => chars[b % chars.length]).join(""));
              setShowPassword(true);
            }}
            className="px-3 py-2.5 bg-secondary text-muted-foreground rounded-lg text-xs font-medium hover:text-foreground transition-colors border border-border shrink-0"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          {mode === "encrypt" ? "Plaintext" : "Encrypted Data (Base64)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={5}
          placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Paste encrypted base64 string..."}
          spellCheck={false}
        />
        {mode === "encrypt" && (
          <div className="mt-2">
            <FileDropZone onFileContent={handleFileText} label="Or drop a file to encrypt" />
          </div>
        )}
      </div>

      {/* Process button */}
      <button
        onClick={process}
        disabled={processing || !input || !password}
        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {processing ? "Processing..." : mode === "encrypt" ? "Encrypt" : "Decrypt"}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {mode === "encrypt" ? "Encrypted Output" : "Decrypted Plaintext"}
              {outputSize && <span className="ml-2 text-primary/60">({outputSize})</span>}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => { setInput(output); setOutput(""); setMode(mode === "encrypt" ? "decrypt" : "encrypt"); }}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                ↓ Use as input
              </button>
              <CopyButton text={output} />
            </div>
          </div>
          <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}

      {/* Checksum */}
      {checksum && (
        <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5 group">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest w-20 shrink-0">
            SHA-256
          </span>
          <code className="flex-1 font-mono text-[11px] text-foreground truncate">{checksum}</code>
          <CopyButton text={checksum} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}
