import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { NumberStepper } from "./NumberStepper";

// --- Caesar / ROT cipher ---
function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

// --- Vigenère cipher ---
function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, "");
  if (!k) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    const shift = k.charCodeAt(ki % k.length) - 97;
    ki++;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, "");
  if (!k) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    const shift = k.charCodeAt(ki % k.length) - 97;
    ki++;
    return String.fromCharCode(((ch.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
}

// --- Atbash cipher ---
function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });
}

// --- Rail Fence cipher ---
function railFenceEncrypt(text: string, rails: number): string {
  if (rails <= 1) return text;
  const fence: string[][] = Array.from({ length: rails }, () => []);
  let rail = 0, dir = 1;
  for (const ch of text) {
    fence[rail].push(ch);
    if (rail === 0) dir = 1;
    else if (rail === rails - 1) dir = -1;
    rail += dir;
  }
  return fence.flat().join("");
}

function railFenceDecrypt(text: string, rails: number): string {
  if (rails <= 1) return text;
  const n = text.length;
  const pattern: number[] = [];
  let rail = 0, dir = 1;
  for (let i = 0; i < n; i++) {
    pattern.push(rail);
    if (rail === 0) dir = 1;
    else if (rail === rails - 1) dir = -1;
    rail += dir;
  }
  const result = new Array(n);
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let i = 0; i < n; i++) {
      if (pattern[i] === r) {
        result[i] = text[idx++];
      }
    }
  }
  return result.join("");
}

// --- XOR cipher ---
function xorCipher(text: string, key: string): string {
  if (!key) return text;
  return Array.from(text)
    .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join("");
}

function toHex(text: string): string {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}

function fromHex(hex: string): string {
  return hex.trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join("");
}

// --- Morse code ---
const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
  " ": "/",
};
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

function toMorse(text: string): string {
  return text.toUpperCase().split("").map((ch) => MORSE_MAP[ch] || ch).join(" ");
}

function fromMorse(morse: string): string {
  return morse.split(" ").map((code) => MORSE_REVERSE[code] || code).join("");
}

type CipherType = "caesar" | "vigenere" | "atbash" | "railfence" | "xor" | "morse";

const CIPHERS: { id: CipherType; label: string; desc: string }[] = [
  { id: "caesar", label: "Caesar / ROT", desc: "Shift each letter by N positions" },
  { id: "vigenere", label: "Vigenère", desc: "Polyalphabetic substitution with keyword" },
  { id: "atbash", label: "Atbash", desc: "Reverse the alphabet (A↔Z, B↔Y)" },
  { id: "railfence", label: "Rail Fence", desc: "Zigzag transposition cipher" },
  { id: "xor", label: "XOR", desc: "Bitwise XOR with a key (hex output) — ⚠️ NOT secure encryption, trivially breakable" },
  { id: "morse", label: "Morse Code", desc: "Encode/decode to dots and dashes" },
];

export function CipherTool() {
  const [cipher, setCipher] = useState<CipherType>("caesar");
  const [input, setInput] = useState("Hello, World!");
  const [key, setKey] = useState("secret");
  const [shift, setShift] = useState(13);
  const [rails, setRails] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { CopyButton } = useCopyToClipboard();

  const output = useMemo(() => {
    try {
      switch (cipher) {
        case "caesar":
          return caesarShift(input, mode === "encrypt" ? shift : -shift);
        case "vigenere":
          return mode === "encrypt" ? vigenereEncrypt(input, key) : vigenereDecrypt(input, key);
        case "atbash":
          return atbash(input); // self-inverse
        case "railfence":
          return mode === "encrypt" ? railFenceEncrypt(input, rails) : railFenceDecrypt(input, rails);
        case "xor":
          if (mode === "encrypt") {
            return toHex(xorCipher(input, key));
          } else {
            return xorCipher(fromHex(input), key);
          }
        case "morse":
          return mode === "encrypt" ? toMorse(input) : fromMorse(input);
        default:
          return "";
      }
    } catch {
      return "Error processing input";
    }
  }, [cipher, input, key, shift, rails, mode]);

  const needsKey = cipher === "vigenere" || cipher === "xor";
  const needsShift = cipher === "caesar";
  const needsRails = cipher === "railfence";
  const isSelfInverse = cipher === "atbash";

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cipher selector */}
      <div className="flex flex-wrap gap-1.5">
        {CIPHERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCipher(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              cipher === c.id
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {CIPHERS.find((c) => c.id === cipher)?.desc}
      </p>

      {/* Mode toggle */}
      {!isSelfInverse && (
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            onClick={() => setMode("encrypt")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "encrypt"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode("decrypt")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              mode === "decrypt"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Decrypt
          </button>
        </div>
      )}

      {/* Parameters */}
      <div className="flex flex-wrap gap-4 items-end">
        {needsKey && (
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
              Key
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter key..."
              spellCheck={false}
            />
          </div>
        )}
        {needsShift && (
          <NumberStepper label="Shift" value={shift} onChange={setShift} min={1} max={25} width="w-20" />
        )}
        {needsRails && (
          <NumberStepper label="Rails" value={rails} onChange={setRails} min={2} max={10} width="w-20" />
        )}
        {needsShift && (
          <div className="flex flex-wrap gap-1.5">
            {[1, 3, 5, 13].map((s) => (
              <button
                key={s}
                onClick={() => setShift(s)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  shift === s ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === 13 ? "ROT13" : `+${s}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={4}
          placeholder="Enter text..."
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Output
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => { setInput(output); }}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Use as input
            </button>
            <CopyButton text={output} />
          </div>
        </div>
        <pre className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap break-all min-h-[60px]">
          {output}
        </pre>
      </div>

      {/* Caesar brute-force */}
      {cipher === "caesar" && mode === "decrypt" && (
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Brute Force — All 25 Shifts
          </label>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 bg-surface border border-border rounded-lg px-3 py-2 group cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setShift(s)}
              >
                <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0">+{s}</span>
                <code className="flex-1 font-mono text-xs text-foreground truncate">
                  {caesarShift(input, -s)}
                </code>
                <CopyButton
                  text={caesarShift(input, -s)}
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alphabet visualization for Caesar */}
      {cipher === "caesar" && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Alphabet Mapping (shift {shift})
          </label>
          <div className="flex flex-wrap gap-1">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => (
              <div key={ch} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-muted-foreground">{ch}</span>
                <span className="text-[8px] text-primary/40">↓</span>
                <span className="text-[10px] font-mono text-primary font-medium">
                  {caesarShift(ch, shift)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
