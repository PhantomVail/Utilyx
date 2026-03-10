import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";
import { LOREM_WORDS, pick, randInt } from "../lib/fakeData";

type LoremType = "words" | "sentences" | "paragraphs";

function generateLorem(count: number, type: LoremType): string {
  if (type === "words") {
    return Array.from({ length: count }, () => pick(LOREM_WORDS)).join(" ");
  }
  if (type === "sentences") {
    return Array.from({ length: count }, () => {
      const len = randInt(8, 16);
      const words = Array.from({ length: len }, () => pick(LOREM_WORDS));
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    }).join(" ");
  }
  // paragraphs
  return Array.from({ length: count }, () => {
    const sentences = randInt(3, 7);
    return Array.from({ length: sentences }, () => {
      const len = randInt(8, 16);
      const words = Array.from({ length: len }, () => pick(LOREM_WORDS));
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    }).join(" ");
  }).join("\n\n");
}

export function LoremGenerator() {
  const [type, setType] = useState<LoremType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [key, setKey] = useState(0);
  const { CopyButton } = useCopyToClipboard();

  const output = useMemo(() => {
    let text = generateLorem(count, type);
    if (startWithLorem && text.length > 0) {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    }
    return text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, type, startWithLorem, key]);

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Type</label>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            {(["words", "sentences", "paragraphs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 text-xs font-medium transition-colors capitalize ${
                  type === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Count</label>
          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
            <button onClick={() => setCount(Math.max(1, count - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm">−</button>
            <input
              type="text" inputMode="numeric" value={count}
              onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n)) setCount(Math.min(50, Math.max(1, n))); }}
              className="w-10 text-center bg-transparent font-mono text-sm text-foreground focus:outline-none border-x border-border py-2"
            />
            <button onClick={() => setCount(Math.min(50, count + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm">+</button>
          </div>
        </div>
        <button
          onClick={() => setStartWithLorem(!startWithLorem)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
            startWithLorem ? "bg-primary/10 border-primary/20 text-primary" : "bg-secondary border-border text-muted-foreground"
          }`}
        >
          Start with "Lorem ipsum..."
        </button>
        <button
          onClick={() => setKey(k => k + 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Regenerate
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {wordCount} words • {charCount} characters
          </span>
          <CopyButton text={output} />
        </div>
        <pre className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-foreground overflow-auto max-h-[400px] whitespace-pre-wrap leading-relaxed">
          {output}
        </pre>
      </div>
    </div>
  );
}
