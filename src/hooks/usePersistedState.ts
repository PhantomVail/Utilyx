import { useState, useCallback, useEffect } from "react";

export function usePersistedState<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`utilyx:${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`utilyx:${key}`, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [key, state]);

  return [state, setState];
}
