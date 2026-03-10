import {
  Braces, Terminal, Key, Binary, Palette,
  UserRound, ShieldCheck, ArrowLeftRight, Hash, FileText,
  Lock, Clock, Link, KeyRound, Type,
  AlignLeft, Timer, Shuffle, Image, QrCode, Paintbrush, Shapes,
  BookOpen, Code2, ShieldHalf, Code, Minus, Database, BoxSelect, Ruler, Calculator,
  Pipette, RectangleHorizontal, Library, Shield, KeySquare, BarChart3,
  Keyboard, Grid3X3, Binary as BinaryIcon, Layers, Sparkles,
  Brackets, Globe, Smile, Server, Scale, TypeIcon
} from "lucide-react";

export type ToolId =
  | "json" | "regex" | "uuid" | "base64" | "color"
  | "faker" | "masker" | "csv" | "hash" | "diff" | "env"
  | "jwt" | "timestamp" | "url" | "password" | "lorem"
  | "cron" | "textcount" | "caseconv" | "png"
  | "qrcode" | "gradient" | "svgicon"
  | "markdown" | "json2ts" | "chmod" | "htmlentity" | "slugify"
  | "baseconv" | "sql" | "boxshadow" | "cssunit"
  | "palette" | "aspectratio" | "regexlib"
  | "cipher" | "aes" | "freqanalysis"
  | "alphabetmap" | "playfair" | "textencoder" | "advcipher"
  | "keygen" | "strescape" | "numformat" | "ipsubnet"
  | "contrast" | "emoji" | "httpstatus" | "unitconv" | "fontpreview";

interface ToolDef {
  id: ToolId;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

export const tools: ToolDef[] = [
  { id: "faker", label: "Fake Data", icon: <UserRound size={16} />, description: "Generate realistic fake data for testing", category: "Data" },
  { id: "masker", label: "Data Masker", icon: <ShieldCheck size={16} />, description: "Anonymize sensitive data in text", category: "Data" },
  { id: "csv", label: "CSV ↔ JSON", icon: <ArrowLeftRight size={16} />, description: "Transform between CSV and JSON formats", category: "Data" },
  { id: "env", label: ".env Editor", icon: <FileText size={16} />, description: "Validate and manage environment files", category: "Data" },
  { id: "lorem", label: "Lorem Ipsum", icon: <AlignLeft size={16} />, description: "Generate placeholder text", category: "Data" },
  { id: "password", label: "Passwords", icon: <KeyRound size={16} />, description: "Generate secure passwords with strength meter", category: "Data" },
  { id: "emoji", label: "Emoji Picker", icon: <Smile size={16} />, description: "Search, collect & copy emojis with code points", category: "Data" },
  { id: "json", label: "JSON Format", icon: <Braces size={16} />, description: "Format, validate & minify JSON", category: "Transform" },
  { id: "base64", label: "Base64", icon: <Binary size={16} />, description: "Encode & decode Base64 strings", category: "Transform" },
  { id: "hash", label: "Hash Gen", icon: <Hash size={16} />, description: "Generate SHA-1, SHA-256, SHA-512 hashes", category: "Transform" },
  { id: "keygen", label: "Key Gen", icon: <Sparkles size={16} />, description: "Generate API keys, tokens & random strings in bulk", category: "Transform" },
  { id: "url", label: "URL Parser", icon: <Link size={16} />, description: "Parse, encode & decode URLs", category: "Transform" },
  { id: "jwt", label: "JWT Decoder", icon: <Key size={16} />, description: "Decode and inspect JWT tokens", category: "Transform" },
  { id: "caseconv", label: "Case Convert", icon: <Type size={16} />, description: "Convert between camelCase, snake_case, etc.", category: "Transform" },
  { id: "slugify", label: "Slugify", icon: <Minus size={16} />, description: "Convert text to URL-safe slugs & naming conventions", category: "Transform" },
  { id: "htmlentity", label: "HTML Entities", icon: <Code size={16} />, description: "Encode & decode HTML entities", category: "Transform" },
  { id: "strescape", label: "String Escape", icon: <Brackets size={16} />, description: "Escape & unescape strings for JSON, HTML, regex & more", category: "Transform" },
  { id: "numformat", label: "Num Format", icon: <Calculator size={16} />, description: "Locale-aware number, currency & percent formatting", category: "Transform" },
  { id: "unitconv", label: "Unit Convert", icon: <Scale size={16} />, description: "Convert length, weight, temp, time, digital & more", category: "Transform" },
  { id: "regex", label: "Regex", icon: <Terminal size={16} />, description: "Test regular expressions live", category: "Inspect" },
  { id: "uuid", label: "UUID Gen", icon: <Shuffle size={16} />, description: "Generate v4 UUIDs instantly", category: "Inspect" },
  { id: "diff", label: "Text Diff", icon: <FileText size={16} />, description: "Compare text and highlight differences", category: "Inspect" },
  { id: "color", label: "Colors", icon: <Palette size={16} />, description: "Convert between HEX, RGB & HSL", category: "Inspect" },
  { id: "timestamp", label: "Timestamps", icon: <Clock size={16} />, description: "Convert Unix timestamps & dates", category: "Inspect" },
  { id: "cron", label: "Cron Parser", icon: <Timer size={16} />, description: "Parse cron expressions & preview runs", category: "Inspect" },
  { id: "textcount", label: "Text Stats", icon: <Hash size={16} />, description: "Word count, frequency analysis & more", category: "Inspect" },
  { id: "markdown", label: "Markdown", icon: <BookOpen size={16} />, description: "Live markdown preview with HTML export", category: "Inspect" },
  { id: "ipsubnet", label: "IP Subnet", icon: <Globe size={16} />, description: "Calculate subnets, CIDR, IP ranges & masks", category: "Inspect" },
  { id: "contrast", label: "Contrast", icon: <Palette size={16} />, description: "WCAG color contrast ratio checker", category: "Inspect" },
  { id: "httpstatus", label: "HTTP Codes", icon: <Server size={16} />, description: "HTTP status code reference with descriptions", category: "Inspect" },
  { id: "png", label: "PNG Maker", icon: <Image size={16} />, description: "Create images with text & gradients, download as PNG", category: "Create" },
  { id: "fontpreview", label: "Font Preview", icon: <TypeIcon size={16} />, description: "Preview & compare font stacks with live controls", category: "Create" },
  { id: "qrcode", label: "QR Code", icon: <QrCode size={16} />, description: "Generate QR codes with custom colors & sizes", category: "Create" },
  { id: "gradient", label: "Gradients", icon: <Paintbrush size={16} />, description: "Design CSS gradients with multi-stop support", category: "Create" },
  { id: "svgicon", label: "SVG Icons", icon: <Shapes size={16} />, description: "Compose SVG icons from basic shapes", category: "Create" },
  { id: "json2ts", label: "JSON → TS", icon: <Code2 size={16} />, description: "Generate TypeScript interfaces from JSON", category: "Create" },
  { id: "chmod", label: "Chmod Calc", icon: <ShieldHalf size={16} />, description: "Calculate Unix file permissions visually", category: "Create" },
  { id: "baseconv", label: "Base Convert", icon: <Calculator size={16} />, description: "Convert between decimal, hex, octal & binary", category: "Transform" },
  { id: "sql", label: "SQL Format", icon: <Database size={16} />, description: "Format, beautify & minify SQL queries", category: "Transform" },
  { id: "boxshadow", label: "Box Shadow", icon: <BoxSelect size={16} />, description: "Visual CSS box-shadow generator", category: "Create" },
  { id: "cssunit", label: "CSS Units", icon: <Ruler size={16} />, description: "Convert between px, rem, em, vw & more", category: "Transform" },
  { id: "palette", label: "Palette", icon: <Pipette size={16} />, description: "Generate color palettes with harmony rules", category: "Create" },
  { id: "aspectratio", label: "Aspect Ratio", icon: <RectangleHorizontal size={16} />, description: "Calculate & convert aspect ratios", category: "Inspect" },
  { id: "regexlib", label: "Regex Library", icon: <Library size={16} />, description: "Common regex patterns ready to use", category: "Inspect" },
  { id: "cipher", label: "Ciphers", icon: <KeySquare size={16} />, description: "Caesar, Vigenère, Atbash, Rail Fence, XOR & Morse", category: "Encrypt" },
  { id: "aes", label: "AES Encrypt", icon: <Shield size={16} />, description: "AES-256-GCM encryption & decryption", category: "Encrypt" },
  { id: "freqanalysis", label: "Freq Analysis", icon: <BarChart3 size={16} />, description: "Letter frequency & entropy analysis", category: "Encrypt" },
  { id: "alphabetmap", label: "Alphabet Map", icon: <Keyboard size={16} />, description: "Custom letter substitution with drag-and-drop", category: "Encrypt" },
  { id: "playfair", label: "Playfair", icon: <Grid3X3 size={16} />, description: "Digraph cipher with 5×5 Polybius square", category: "Encrypt" },
  { id: "textencoder", label: "Text Encode", icon: <BinaryIcon size={16} />, description: "Binary, hex, octal, decimal & Base32 encoding", category: "Encrypt" },
  { id: "advcipher", label: "Adv. Ciphers", icon: <Layers size={16} />, description: "Beaufort, Bifid & Columnar Transposition", category: "Encrypt" },
];

const categories = ["Data", "Transform", "Inspect", "Encrypt", "Create"];

interface SidebarProps {
  activeTool: ToolId;
  onSelect: (id: ToolId) => void;
}

export function ToolSidebar({ activeTool, onSelect }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Lock className="text-primary" size={14} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground tracking-tight">Utilyx</h1>
            <p className="text-[10px] text-muted-foreground">Developer toolkit</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {categories.map((cat) => (
          <div key={cat} className="mb-1">
            <div className="px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {cat}
            </div>
            {tools.filter((t) => t.category === cat).map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelect(tool.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-all ${
                  activeTool === tool.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <span className="text-[10px] text-muted-foreground font-mono">v1.7 — {tools.length} Tools</span>
      </div>
    </aside>
  );
}

export { useCopyToClipboard } from "./CopyButton";
