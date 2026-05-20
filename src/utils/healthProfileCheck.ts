import type { HealthProfile } from "../types";

export type HealthMatchKind = "allergy" | "condition" | "currentMed";

export interface HealthProfileMatch {
  kind: HealthMatchKind;
  term: string;
  context?: string;
}

const ALLERGY_PATTERNS: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /penicillin|amoxicillin|ampicillin|augmentin/i, terms: ["penicillin", "amoxicillin", "青霉素", "阿莫西林"] },
  { pattern: /sulfa|sulfonamide|sulfamethoxazole|bactrim/i, terms: ["sulfa", "sulfonamide", "磺胺"] },
  { pattern: /aspirin|salicylate/i, terms: ["aspirin", "salicylate", "阿司匹林"] },
  { pattern: /nsaid|ibuprofen|naproxen|ketorolac|diclofenac/i, terms: ["nsaid", "ibuprofen", "naproxen", "布洛芬"] },
  { pattern: /latex/i, terms: ["latex", "乳胶"] },
  { pattern: /codeine|morphine|opioid/i, terms: ["codeine", "morphine", "opioid", "可待因", "吗啡"] },
];

const CONDITION_PATTERNS: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /liver disease|hepatic|cirrhosis|hepatotoxic/i, terms: ["liver", "hepatic", "肝病", "肝"] },
  { pattern: /kidney disease|renal|kidney failure|renal impairment/i, terms: ["kidney", "renal", "肾病", "肾"] },
  { pattern: /pregnancy|pregnant|lactation|breastfeeding|nursing mother/i, terms: ["pregnancy", "pregnant", "lactation", "breastfeeding", "妊娠", "哺乳", "怀孕"] },
  { pattern: /diabetes|diabetic/i, terms: ["diabetes", "diabetic", "糖尿病"] },
  { pattern: /hypertension|high blood pressure/i, terms: ["hypertension", "blood pressure", "高血压"] },
  { pattern: /asthma|copd|bronchospasm/i, terms: ["asthma", "copd", "哮喘"] },
  { pattern: /bleeding disorder|anticoagulant|warfarin|blood thinner/i, terms: ["bleeding", "anticoagulant", "warfarin", "出血", "抗凝"] },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termInText(term: string, text: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (normalized.length < 2) return false;
  return new RegExp(`\\b${escapeRegex(normalized)}\\b`, "i").test(text);
}

function findSentence(text: string, pattern: RegExp): string | undefined {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.find((s) => pattern.test(s))?.trim().slice(0, 180);
}

type TermMatch = { term: string; context?: string };

function matchTermsInText(
  profileTerms: string[],
  text: string,
  patterns: Array<{ pattern: RegExp; terms: string[] }>,
): TermMatch[] {
  const matches: TermMatch[] = [];
  const seen = new Set<string>();

  for (const term of profileTerms) {
    const lower = term.toLowerCase();
    if (termInText(term, text)) {
      const key = `direct:${lower}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ term, context: findSentence(text, new RegExp(escapeRegex(term), "i")) });
      }
      continue;
    }
    for (const { pattern, terms } of patterns) {
      if (!terms.some((t) => lower.includes(t.toLowerCase()) || t.toLowerCase().includes(lower))) {
        continue;
      }
      if (!pattern.test(text)) continue;
      const key = `pattern:${pattern.source}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ term, context: findSentence(text, pattern) });
      break;
    }
  }

  return matches;
}

export function checkHealthProfileAgainstDrugText(
  profile: HealthProfile,
  drugText: string,
): HealthProfileMatch[] {
  if (!drugText.trim()) return [];

  const allergyMatches = matchTermsInText(profile.allergies, drugText, ALLERGY_PATTERNS).map(
    (m) => ({ ...m, kind: "allergy" as const }),
  );
  const conditionMatches = matchTermsInText(profile.conditions, drugText, CONDITION_PATTERNS).map(
    (m) => ({ ...m, kind: "condition" as const }),
  );
  const medMatches = profile.currentMeds
    .filter((med) => termInText(med, drugText))
    .map((term) => ({
      kind: "currentMed" as const,
      term,
      context: findSentence(drugText, new RegExp(escapeRegex(term), "i")),
    }));

  return [...allergyMatches, ...conditionMatches, ...medMatches];
}

export function buildDrugLabelText(drug: {
  name?: string;
  genericName?: string;
  warnings?: string;
  contraindications?: string;
  drugInteractions?: string;
  adverseReactions?: string;
  description?: string;
  pregnancyInfo?: string;
  nursingMotherInfo?: string;
  activeIngredients?: string[];
}): string {
  return [
    drug.name,
    drug.genericName,
    drug.description,
    drug.warnings,
    drug.contraindications,
    drug.drugInteractions,
    drug.adverseReactions,
    drug.pregnancyInfo,
    drug.nursingMotherInfo,
    ...(drug.activeIngredients ?? []),
  ]
    .filter(Boolean)
    .join("\n");
}
