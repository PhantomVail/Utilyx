// Web Worker for regex execution — prevents main thread freeze on catastrophic backtracking
self.onmessage = function (e) {
  const { pattern, flags, testString, id } = e.data;
  try {
    const regex = new RegExp(pattern, flags);
    const results = [];
    if (flags.includes("g")) {
      let m;
      while ((m = regex.exec(testString)) !== null) {
        results.push({ match: m[0], index: m.index, groups: m.slice(1) });
        if (!m[0]) break;
        if (results.length > 5000) break;
      }
    } else {
      const m = regex.exec(testString);
      if (m) results.push({ match: m[0], index: m.index, groups: m.slice(1) });
    }
    self.postMessage({ id, matches: results, error: "" });
  } catch (err) {
    self.postMessage({ id, matches: [], error: err.message || "Invalid pattern" });
  }
};
