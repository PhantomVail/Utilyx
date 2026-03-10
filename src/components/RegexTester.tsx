import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

const WORKER_TIMEOUT = 3000;

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b([A-Z][a-z]+)\\b");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Hello World, this is Utilyx. Welcome to the Future.");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const idRef = useRef(0);

  const debouncedPattern = useDebounce(pattern, 150);
  const debouncedTest = useDebounce(testString, 150);

  // Init worker
  useEffect(() => {
    workerRef.current = new Worker("/regex-worker.js");
    workerRef.current.onmessage = (e) => {
      const { id, matches: m, error: err } = e.data;
      if (id === idRef.current) {
        clearTimeout(timeoutRef.current);
        setMatches(m);
        setError(err);
      }
    };
    return () => {
      workerRef.current?.terminate();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Run regex in worker
  useEffect(() => {
    if (!debouncedPattern) {
      setMatches([]);
      setError("");
      return;
    }
    const id = ++idRef.current;
    try {
      // Validate pattern syntax on main thread (instant)
      new RegExp(debouncedPattern, flags);
    } catch (e: unknown) {
      setMatches([]);
      setError(e instanceof Error ? e.message : "Invalid pattern");
      return;
    }
    workerRef.current?.postMessage({ pattern: debouncedPattern, flags, testString: debouncedTest, id });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (idRef.current === id) {
        // Worker hung — terminate and recreate
        workerRef.current?.terminate();
        const newWorker = new Worker("/regex-worker.js");
        workerRef.current = newWorker;
        newWorker.onmessage = (e) => {
          const { id: rid, matches: m, error: err } = e.data;
          if (rid === idRef.current) {
            clearTimeout(timeoutRef.current);
            setMatches(m);
            setError(err);
          }
        };
        setError("Execution timed out — pattern may cause catastrophic backtracking");
        setMatches([]);
      }
    }, WORKER_TIMEOUT);
  }, [debouncedPattern, flags, debouncedTest]);

  // Highlight on main thread — safe because we only highlight if we already have matches
  const highlighted = useMemo(() => {
    if (!pattern || error || matches.length === 0) return testString;
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let m;
      let safety = 0;
      while ((m = regex.exec(testString)) !== null) {
        if (++safety > 5000) break;
        if (m.index > lastIndex) parts.push(testString.slice(lastIndex, m.index));
        parts.push(
          <mark key={m.index} className="bg-primary/25 text-primary rounded px-0.5 py-px">{m[0]}</mark>
        );
        lastIndex = m.index + m[0].length;
        if (!m[0]) break;
      }
      if (lastIndex < testString.length) parts.push(testString.slice(lastIndex));
      return parts;
    } catch {
      return testString;
    }
  }, [pattern, flags, testString, error, matches]);

  const hasGroups = matches.some((m) => m.groups.length > 0);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Pattern</label>
        <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary">
          <span className="pl-4 text-muted-foreground font-mono text-sm">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 bg-transparent py-2.5 px-1 font-mono text-sm text-foreground focus:outline-none"
            spellCheck={false}
          />
          <span className="text-muted-foreground font-mono text-sm">/</span>
          <div className="border-l border-border">
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-14 bg-transparent py-2.5 px-2 font-mono text-sm text-accent focus:outline-none text-center"
              placeholder="gi"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 text-sm font-mono">
          ✗ {error}
        </div>
      )}
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-28 bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">Highlighted</label>
        <div className="bg-surface border border-border rounded-lg p-4 font-mono text-sm text-foreground min-h-[70px] whitespace-pre-wrap">
          {highlighted}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5 block">
          Matches ({matches.length})
        </label>
        <div className="space-y-1.5">
          {matches.map((m, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg px-4 py-2.5 text-sm font-mono">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs w-6">#{i + 1}</span>
                <span className="text-primary font-medium">{m.match}</span>
                <span className="text-muted-foreground text-xs ml-auto">index {m.index}</span>
              </div>
              {hasGroups && m.groups.length > 0 && (
                <div className="mt-1.5 pl-9 flex flex-wrap gap-2">
                  {m.groups.map((g, gi) => (
                    <span key={gi} className="inline-flex items-center gap-1 text-xs bg-secondary rounded px-2 py-0.5">
                      <span className="text-muted-foreground">#{gi + 1}</span>
                      <span className="text-accent">{g ?? "∅"}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
