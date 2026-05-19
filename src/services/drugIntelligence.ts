export interface DrugRiskSignals {
  hasAlcoholWarning: boolean;
  hasLiverWarning: boolean;
  hasKidneyWarning: boolean;
  hasDuplicateIngredientWarning: boolean;
  alcoholWarningText?: string;
  liverWarningText?: string;
  kidneyWarningText?: string;
  duplicateIngredientText?: string;
}

const ALCOHOL_PATTERNS = [/alcohol/i, /alcoholic beverage/i, /do not drink/i, /avoid alcohol/i];
const LIVER_PATTERNS = [/liver disease/i, /liver damage/i, /hepatic/i, /liver failure/i, /cirrhosis/i, /hepatotoxic/i];
const KIDNEY_PATTERNS = [/kidney disease/i, /kidney damage/i, /renal/i, /kidney failure/i, /kidney impairment/i];
const ACETAMINOPHEN_PATTERNS = [/acetaminophen/i, /apap/i, /paracetamol/i];

function firstMatchingSentence(text: string, pattern: RegExp): string | undefined {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const match = sentences.find((s) => pattern.test(s));
  return match?.trim().slice(0, 200);
}

export function analyzeDrugRisks(drug: {
  warnings?: string;
  contraindications?: string;
  drugInteractions?: string;
  activeIngredients?: string[];
  name?: string;
}): DrugRiskSignals {
  const fullText = [drug.warnings ?? "", drug.contraindications ?? "", drug.drugInteractions ?? ""].join(" ");

  const hasAlcohol = ALCOHOL_PATTERNS.some((p) => p.test(fullText));
  const hasLiver = LIVER_PATTERNS.some((p) => p.test(fullText));
  const hasKidney = KIDNEY_PATTERNS.some((p) => p.test(fullText));

  const ingredientNames = (drug.activeIngredients ?? []).join(" ");
  const nameText = drug.name ?? "";
  const hasAcetaminophenIngredient = ACETAMINOPHEN_PATTERNS.some((p) => p.test(ingredientNames) || p.test(nameText));
  const hasDuplicate = hasAcetaminophenIngredient && ACETAMINOPHEN_PATTERNS.some((p) => p.test(fullText));

  return {
    hasAlcoholWarning: hasAlcohol,
    hasLiverWarning: hasLiver,
    hasKidneyWarning: hasKidney,
    hasDuplicateIngredientWarning: hasDuplicate,
    alcoholWarningText: hasAlcohol ? firstMatchingSentence(fullText, /alcohol/i) : undefined,
    liverWarningText: hasLiver ? firstMatchingSentence(fullText, /liver|hepatic/i) : undefined,
    kidneyWarningText: hasKidney ? firstMatchingSentence(fullText, /kidney|renal/i) : undefined,
    duplicateIngredientText: hasDuplicate
      ? "This medication contains acetaminophen. Do not take with other acetaminophen-containing products — accidental overdose can cause serious liver damage."
      : undefined,
  };
}
