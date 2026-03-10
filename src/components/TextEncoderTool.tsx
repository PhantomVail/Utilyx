import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

type Encoding = "binary" | "hex" | "octal" | "decimal" | "base32";

function textToBinary(text: string, sep: string): string {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0")).join(sep);
}
function binaryToText(bin: string): string {
  return bin.replace(/[^01]/g, " ").trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}
function textToHex(text: string, sep: string): string {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0")).join(sep);
}
function hexToText(hex: string): string {
  return hex.replace(/[^0-9a-fA-F]/g, " ").trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join("");
}
function textToOctal(text: string, sep: string): string {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString(8).padStart(3, "0")).join(sep);
}
function octalToText(oct: string): string {
  return oct.replace(/[^0-7]/g, " ").trim().split(/\s+/).map((o) => String.fromCharCode(parseInt(o, 8))).join("");
}
function textToDecimal(text: string, sep: string): string {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString()).join(sep);
}
function decimalToText(dec: string): string {
  return dec.trim().split(/\s+/).map((d) => String.fromCharCode(parseInt(d, 10))).join("");
}

const B32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function textToBase32(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bits = "";
  bytes.forEach((b) => bits += b.toString(2).padStart(8, "0"));
  while (bits.length % 5) bits += "0";
  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    result += B32_CHARS[parseInt(bits.slice(i, i + 5), 2)];
  }
  while (result.length % 8) result += "=";
  return result;
}
function base32ToText(b32: string): string {
  const clean = b32.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const ch of clean) {
    const idx = B32_CHARS.indexOf(ch);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

const ENCODINGS: { id: Encoding; label: string; desc: string }[] = [
  { id: "binary", label: "Binary", desc: "8-bit binary representation" },
  { id: "hex", label: "Hexadecimal", desc: "Base-16 encoding" },
  { id: "octal", label: "Octal", desc: "Base-8 encoding" },
  { id: "decimal", label: "Decimal", desc: "Character code values" },
  { id: "base32", label: "Base32", desc: "RFC 4648 Base32 encoding" },
];

export function TextEncoderTool() {
  const [input, setInput] = useState("Hello World!");
  const [encoding, setEncoding] = useState<Encoding>("binary");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [separator, setSeparator] = useState(" ");
  const { CopyButton } = useCopyToClipboard();

  const output = useMemo(() => {
    try {
      if (mode === "encode") {
        switch (encoding) {
          case "binary": return textToBinary(input, separator);
          case "hex": return textToHex(input, separator);
          case "octal": return textToOctal(input, separator);
          case "decimal": return textToDecimal(input, separator);
          case "base32": return textToBase32(input);
        }
      } else {
        switch (encoding) {
          case "binary": return binaryToText(input);
          case "hex": return hexToText(input);
          case "octal": return octalToText(input);
          case "decimal": return decimalToText(input);
          case "base32": return base32ToText(input);
        }
      }
    } catch {
      return "Error processing input";
    }
    return "";
  }, [input, encoding, mode, separator]);

  // Character breakdown table
  const charBreakdown = useMemo(() => {
    if (mode !== "encode" || !input) return [];
    return Array.from(input).map((ch) => ({
      char: ch === " " ? "⎵" : ch,
      code: ch.charCodeAt(0),
      bin: ch.charCodeAt(0).toString(2).padStart(8, "0"),
      hex: ch.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase(),
      oct: ch.charCodeAt(0).toString(8).padStart(3, "0"),
    }));
  }, [input, mode]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Encoding selector */}
      <div className="flex flex-wrap gap-1.5">
        {ENCODINGS.map((e) => (
          <button
            key={e.id}
            onClick={() => setEncoding(e.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              encoding === e.id ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {ENCODINGS.find((e) => e.id === encoding)?.desc}
      </p>

      {/* Mode + separator */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "encode" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Text → {ENCODINGS.find((e) => e.id === encoding)?.label}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "decode" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {ENCODINGS.find((e) => e.id === encoding)?.label} → Text
          </button>
        </div>
        {mode === "encode" && encoding !== "base32" && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Sep</span>
            {[" ", "", "-", "\n"].map((s, i) => (
              <button
                key={i}
                onClick={() => setSeparator(s)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  separator === s ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {s === " " ? "space" : s === "" ? "none" : s === "-" ? "dash" : "newline"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={3}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Output</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setInput(output); setMode(mode === "encode" ? "decode" : "encode"); }}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Use as input
            </button>
            <CopyButton text={output} />
          </div>
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap break-all min-h-[60px]">
          {output}
        </pre>
      </div>

      {/* Character breakdown */}
      {mode === "encode" && charBreakdown.length > 0 && charBreakdown.length <= 50 && (
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Character Breakdown
          </label>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted-foreground font-medium py-1.5 px-2">Char</th>
                  <th className="text-left text-muted-foreground font-medium py-1.5 px-2">Dec</th>
                  <th className="text-left text-muted-foreground font-medium py-1.5 px-2">Hex</th>
                  <th className="text-left text-muted-foreground font-medium py-1.5 px-2">Oct</th>
                  <th className="text-left text-muted-foreground font-medium py-1.5 px-2">Binary</th>
                </tr>
              </thead>
              <tbody>
                {charBreakdown.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="py-1.5 px-2 text-primary font-medium">{row.char}</td>
                    <td className="py-1.5 px-2 text-foreground">{row.code}</td>
                    <td className="py-1.5 px-2 text-foreground">{row.hex}</td>
                    <td className="py-1.5 px-2 text-foreground">{row.oct}</td>
                    <td className="py-1.5 px-2 text-foreground">{row.bin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
