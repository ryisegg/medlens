import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppContextValue,
  DrugCategory,
  PillIdentifierQuery,
  PillIdentifierResult,
  SymptomSuggestion,
} from "../types";
import { getDrugsByCategory } from "../data/drugs";
import { detectRedFlags, getSymptomSuggestions } from "../data/symptoms";
import { runPillIdentifier } from "../data/identifier";

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_PILL_QUERY: PillIdentifierQuery = {
  color: "",
  shape: "",
  imprint: "",
  strength: "",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQueryRaw] = useState("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory | "All">("All");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState<SymptomSuggestion[]>([]);
  const [pillQuery, setPillQuery] = useState<PillIdentifierQuery>(EMPTY_PILL_QUERY);
  const [identifierResults, setIdentifierResults] = useState<PillIdentifierResult[]>([]);

  const filteredDrugs = useMemo(() => {
    const byCategory = getDrugsByCategory(activeCategory);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return byCategory;
    return byCategory.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        d.activeIngredient.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [searchQuery, activeCategory]);

  // Real-time red flag detection — updates on every keystroke
  const detectedRedFlags = useMemo(
    () => detectRedFlags(symptomInput),
    [symptomInput],
  );

  const setSearchQuery = useCallback((q: string) => setSearchQueryRaw(q), []);

  const runSymptomCheck = useCallback(() => {
    if (detectedRedFlags.length > 0) {
      setSymptomSuggestions([]);
    } else {
      setSymptomSuggestions(getSymptomSuggestions(symptomInput));
    }
  }, [symptomInput, detectedRedFlags]);

  const runIdentifier = useCallback(() => {
    setIdentifierResults(runPillIdentifier(pillQuery));
  }, [pillQuery]);

  const value = useMemo<AppContextValue>(
    () => ({
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      filteredDrugs,
      mobileNavOpen,
      setMobileNavOpen,
      symptomInput,
      setSymptomInput,
      detectedRedFlags,
      symptomSuggestions,
      runSymptomCheck,
      pillQuery,
      setPillQuery,
      identifierResults,
      runIdentifier,
    }),
    [
      searchQuery,
      setSearchQuery,
      activeCategory,
      filteredDrugs,
      mobileNavOpen,
      symptomInput,
      detectedRedFlags,
      symptomSuggestions,
      runSymptomCheck,
      pillQuery,
      identifierResults,
      runIdentifier,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
