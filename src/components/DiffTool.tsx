import { useState, useMemo } from "react";

type DiffSegment = { type: "same" | "add" | "remove"; text: string };
type WordSegment = { type: "same" | "add" | "remove"; text: string };

function diffLines(a: string, b: string): DiffSegment[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const stack: DiffSegment[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      stack.push({ type: "same", text: linesA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "add", text: linesB[j - 1] });
      j--;
    } else {
      stack.push({ type: "remove", text: linesA[i - 1] });
      i--;
    }
  }
  return stack.reverse();
}

function diffWords(a: string, b: string): WordSegment[] {
  const wordsA = a.split(/(\s+)/);
  const wordsB = b.split(/(\s+)/);
  const m = wordsA.length, n = wordsB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = wordsA[i - 1] === wordsB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const stack: WordSegment[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      stack.push({ type: "same", text: wordsA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "add", text: wordsB[j - 1] });
      j--;
    } else {
      stack.push({ type: "remove", text: wordsA[i - 1] });
      i--;
    }
  }
  return stack.reverse();
}

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const user = "World";
greet(user);`;

const SAMPLE_B = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return { success: true };
}

const user = "Utilyx";
const result = greet(user);
console.log(result);`;

type DiffMode = "line" | "word";

export function DiffTool() {
  const [left, setLeft] = useState(SAMPLE_A);
  const [right, setRight] = useState(SAMPLE_B);
  const [mode, setMode] = useState<DiffMode>("word");

  const lineDiff = useMemo(() => diffLines(left, right), [left, right]);
  const wordDiff = useMemo(() => diffWords(left, right), [left, right]);

  const stats = useMemo(() => ({
    added: lineDiff.filter((d) => d.type === "add").length,
    removed: lineDiff.filter((d) => d.type === "remove").length,
    unchanged: lineDiff.filter((d) => d.type === "same").length,
  }), [lineDiff]);

  const renderWordDiff = () => {
    return (
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[400px] p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed">
          {wordDiff.map((seg, i) => {
            if (seg.type === "same") return <span key={i}>{seg.text}</span>;
            if (seg.type === "add") return <span key={i} className="bg-success/20 text-success">{seg.text}</span>;
            return <span key={i} className="bg-destructive/20 text-destructive line-through">{seg.text}</span>;
          })}
        </div>
      </div>
    );
  };

  const renderLineDiff = () => {
    return (
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[400px]">
          {lineDiff.map((line, i) => (
            <div
              key={i}
              className={`flex font-mono text-xs border-b border-border/50 last:border-0 ${
                line.type === "add" ? "bg-success/8" : line.type === "remove" ? "bg-destructive/8" : ""
              }`}
            >
              <span className={`w-8 shrink-0 text-center py-1.5 text-[10px] select-none border-r border-border/50 ${
                line.type === "add" ? "text-success" : line.type === "remove" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {line.type === "add" ? "+" : line.type === "remove" ? "−" : " "}
              </span>
              <pre className={`flex-1 py-1.5 px-3 whitespace-pre-wrap ${
                line.type === "add" ? "text-success" : line.type === "remove" ? "text-destructive" : "text-foreground"
              }`}>
                {line.text || " "}
              </pre>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full h-36 bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Modified</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full h-36 bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs font-mono">
          <span className="text-success">+{stats.added} added</span>
          <span className="text-destructive">−{stats.removed} removed</span>
          <span className="text-muted-foreground">{stats.unchanged} unchanged</span>
        </div>
        <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
          {(["word", "line"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                mode === m ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "word" ? renderWordDiff() : renderLineDiff()}
    </div>
  );
}
