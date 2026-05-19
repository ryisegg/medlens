import type { PillIdentifierQuery, PillIdentifierResult } from "../types";
import { drugs } from "./catalog";

export function runPillIdentifier(query: PillIdentifierQuery): PillIdentifierResult[] {
  const { color, shape, imprint } = query;
  const hasAnyInput = color || shape || imprint.trim();
  if (!hasAnyInput) return [];

  const results: PillIdentifierResult[] = [];

  for (const drug of drugs) {
    const matchedOn: string[] = [];

    if (imprint.trim()) {
      const impMatch = drug.imprintExamples.some((imp) =>
        imp.toLowerCase().includes(imprint.toLowerCase()),
      );
      if (impMatch) matchedOn.push("imprint");
    }
    if (color) {
      const colorMatch = drug.pillColors.includes(color);
      if (colorMatch) matchedOn.push("color");
    }
    if (shape) {
      const shapeMatch = drug.pillShapes.includes(shape);
      if (shapeMatch) matchedOn.push("shape");
    }

    if (matchedOn.length === 0) continue;

    const confidence: PillIdentifierResult["confidence"] =
      matchedOn.includes("imprint") && matchedOn.length >= 2
        ? "high"
        : matchedOn.includes("imprint")
          ? "medium"
          : matchedOn.length >= 2
            ? "medium"
            : "low";

    results.push({ drug, confidence, matchedOn });
  }

  const order = { high: 0, medium: 1, low: 2 };
  return results.sort((a, b) => order[a.confidence] - order[b.confidence]);
}
