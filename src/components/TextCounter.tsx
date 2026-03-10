import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

function estimateBytes(text: string): number {
  return new TextEncoder().encode(text).length;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function TextCounter() {
  const [input, setInput] = useState("Paste your text here to see detailed statistics about characters, words, sentences, and more.");

  const stats = useMemo(() => {
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, "").length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input.trim() ? (input.match(/[.!?]+/g) || []).length || (input.trim() ? 1 : 0) : 0;
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = input.split("\n").length;
    const bytes = estimateBytes(input);
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));

    // Character frequency
    const freq: Record<string, number> = {};
    for (const ch of input.toLowerCase()) {
      if (/[a-z0-9]/.test(ch)) {
        freq[ch] = (freq[ch] || 0) + 1;
      }
    }
    const topChars = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Word frequency
    const wordFreq: Record<string, number> = {};
    if (input.trim()) {
      for (const w of input.toLowerCase().match(/\b[a-z']+\b/g) || []) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    }
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, bytes, readingTime, speakingTime, topChars, topWords };
  }, [input]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-36 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Type or paste text..."
          spellCheck={false}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {[
          { label: "Characters", value: stats.chars },
          { label: "No spaces", value: stats.charsNoSpaces },
          { label: "Words", value: stats.words },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Size", value: formatBytes(stats.bytes) },
          { label: "Read time", value: `${stats.readingTime}m` },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top words */}
      {stats.topWords.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Top Words</span>
            <div className="space-y-1">
              {stats.topWords.map(([word, count]) => (
                <div key={word} className="flex items-center gap-2 text-xs font-mono">
                  <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(count / stats.topWords[0][1]) * 100}%` }} />
                  </div>
                  <span className="text-foreground w-16 truncate">{word}</span>
                  <span className="text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Top Characters</span>
            <div className="space-y-1">
              {stats.topChars.map(([ch, count]) => (
                <div key={ch} className="flex items-center gap-2 text-xs font-mono">
                  <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(count / stats.topChars[0][1]) * 100}%` }} />
                  </div>
                  <span className="text-foreground w-6">{ch}</span>
                  <span className="text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
