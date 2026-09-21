const SAFE_LATIN_TERMS = new Set([
  "AI",
  "KPI",
  "YouBike",
  "Taipei",
  "Facebook",
  "LINE",
]);

/**
 * A conservative post-generation audit. Realtime audio streams before the full
 * sentence is available, so this is used for diagnostics while Local Tool
 * answers are grounded prospectively through exact function output.
 */
export function findUngroundedNamedEntities(
  answer: string,
  groundingTexts: string[]
) {
  const grounded = groundingTexts.join("\n").toLowerCase();
  const candidates = String(answer || "").match(/\b[A-Z][a-z]{2,}\b/g) || [];

  return [...new Set(candidates)].filter(
    (candidate) =>
      !SAFE_LATIN_TERMS.has(candidate) &&
      !grounded.includes(candidate.toLowerCase())
  );
}

