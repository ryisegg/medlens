export type DrugCategory =
  | "Pain Relief"
  | "Allergy"
  | "Cold & Flu"
  | "Digestive Health"
  | "Skin"
  | "Sleep"
  | "Vitamins"
  | "Chronic Conditions";

export type DosageForm =
  | "tablet"
  | "capsule"
  | "liquid"
  | "cream"
  | "patch"
  | "injection"
  | "chewable"
  | "softgel";

export type PregnancyCategory = "A" | "B" | "C" | "D" | "X" | "N";

export interface SideEffect {
  effect: string;
  severity: "common" | "serious" | "rare";
}

export interface DrugInteraction {
  drugName: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: DrugCategory;
  activeIngredient: string;
  description: string;
  uses: string[];
  mechanism: string;
  dosageForms: DosageForm[];
  commonDoses: string[];
  sideEffects: SideEffect[];
  contraindications: string[];
  interactions: DrugInteraction[];
  pregnancyCategory: PregnancyCategory;
  pregnancyNote: string;
  breastfeedingNote: string;
  whenToCallDoctor: string[];
  lastReviewed: string;
  source: string;
  otcOrRx: "OTC" | "Rx";
  pillColors: string[];
  pillShapes: string[];
  imprintExamples: string[];
}

export interface SymptomSuggestion {
  categoryName: string;
  exampleDrugs: string[];
  whyItHelps: string;
  whoShouldAvoid: string;
  keyRisks: string;
  whenToSeekCare: string;
}

export interface SymptomMapping {
  symptomKeywords: string[];
  suggestions: SymptomSuggestion[];
}

export type PillColor =
  | "white"
  | "off-white"
  | "yellow"
  | "orange"
  | "pink"
  | "red"
  | "purple"
  | "blue"
  | "green"
  | "brown"
  | "gray"
  | "black"
  | "clear";

export type PillShape =
  | "round"
  | "oval"
  | "oblong"
  | "capsule"
  | "square"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "triangle";

export interface PillIdentifierQuery {
  color: PillColor | "";
  shape: PillShape | "";
  imprint: string;
  strength: string;
}

export interface PillIdentifierResult {
  drug: Drug;
  confidence: "high" | "medium" | "low";
  matchedOn: string[];
}

export type WarningLevel = "emergency" | "caution" | "info";

export interface AppContextValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: DrugCategory | "All";
  setActiveCategory: (c: DrugCategory | "All") => void;
  filteredDrugs: Drug[];
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  symptomInput: string;
  setSymptomInput: (s: string) => void;
  detectedRedFlags: string[];
  symptomSuggestions: SymptomSuggestion[];
  runSymptomCheck: () => void;
  pillQuery: PillIdentifierQuery;
  setPillQuery: (q: PillIdentifierQuery) => void;
  identifierResults: PillIdentifierResult[];
  runIdentifier: () => void;
}
