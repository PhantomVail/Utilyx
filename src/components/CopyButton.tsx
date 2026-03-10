import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-secondary hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function useCopyToClipboard() {
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };
  return { copy, CopyButton };
}
