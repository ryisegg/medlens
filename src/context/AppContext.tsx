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
  Drug,
  DrugCategory,
  Language,
  OtcRxFilter,
  PillIdentifierQuery,
  PillIdentifierResult,
  SymptomSuggestion,
} from "../types";
import { getDrugById, getDrugsByCategory } from "../data/drugs";
import { detectRedFlags, getSymptomSuggestions, CHIP_SYMPTOM_KEYWORDS } from "../data/symptoms";
import { runPillIdentifier } from "../data/identifier";

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_PILL_QUERY: PillIdentifierQuery = {
  color: "", shape: "", imprint: "", strength: "", scored: "",
};

function loadRecentlyViewed(): Drug[] {
  try {
    const stored = localStorage.getItem("medlens_recent");
    if (!stored) return [];
    const ids: string[] = JSON.parse(stored);
    return ids.map((id) => getDrugById(id)).filter(Boolean) as Drug[];
  } catch {
    return [];
  }
}

function loadLanguage(): Language {
  try {
    const stored = localStorage.getItem("medlens_lang");
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // ignore
  }
  return "en";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageRaw] = useState<Language>(loadLanguage);
  const [searchQuery, setSearchQueryRaw] = useState("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory | "All">("All");
  const [otcRxFilter, setOtcRxFilter] = useState<OtcRxFilter>("all");
  const [recentlyViewed, setRecentlyViewed] = useState<Drug[]>(loadRecentlyViewed);
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSuggestions, setSymptomSuggestions] = useState<SymptomSuggestion[]>([]);
  const [pillQuery, setPillQuery] = useState<PillIdentifierQuery>(EMPTY_PILL_QUERY);
  const [identifierResults, setIdentifierResults] = useState<PillIdentifierResult[]>([]);

  // ── Language ─────────────────────────────────────────────────────────────
  const setLanguage = useCallback((lang: Language) => {
    setLanguageRaw(lang);
    try { localStorage.setItem("medlens_lang", lang); } catch { /* ignore */ }
  }, []);

  // ── Drug search ───────────────────────────────────────────────────────────
  const filteredDrugs = useMemo(() => {
    let result = getDrugsByCategory(activeCategory);
    if (otcRxFilter !== "all") {
      result = result.filter((d) => d.otcOrRx === otcRxFilter);
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return result;
    return result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        d.activeIngredient.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.imprintExamples.some((imp) => imp.toLowerCase().includes(q)),
    );
  }, [searchQuery, activeCategory, otcRxFilter]);

  const setSearchQuery = useCallback((q: string) => setSearchQueryRaw(q), []);

  // ── Recently viewed ───────────────────────────────────────────────────────
  const addToRecentlyViewed = useCallback((drug: Drug) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((d) => d.id !== drug.id);
      const updated = [drug, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("medlens_recent", JSON.stringify(updated.map((d) => d.id)));
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  // ── Symptom chips ─────────────────────────────────────────────────────────
  const toggleSymptom = useCallback((symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    );
  }, []);

  const clearSelectedSymptoms = useCallback(() => {
    setSelectedSymptoms([]);
    setSymptomInput("");
    setSymptomSuggestions([]);
  }, []);

  // Build combined symptom string from selected chips + free text
  const combinedSymptomInput = useMemo(() => {
    const chipKeywords = selectedSymptoms
      .flatMap((chip) => CHIP_SYMPTOM_KEYWORDS[chip] ?? [chip])
      .join(" ");
    return [chipKeywords, symptomInput].filter(Boolean).join(" ");
  }, [selectedSymptoms, symptomInput]);

  // Real-time red flag detection
  const detectedRedFlags = useMemo(
    () => detectRedFlags(combinedSymptomInput),
    [combinedSymptomInput],
  );

  const runSymptomCheck = useCallback(() => {
    if (detectedRedFlags.length > 0) {
      setSymptomSuggestions([]);
    } else {
      setSymptomSuggestions(getSymptomSuggestions(combinedSymptomInput));
    }
  }, [combinedSymptomInput, detectedRedFlags]);

  // ── Pill identifier ───────────────────────────────────────────────────────
  const runIdentifier = useCallback(() => {
    setIdentifierResults(runPillIdentifier(pillQuery));
  }, [pillQuery]);

  const value = useMemo<AppContextValue>(
    () => ({
      language, setLanguage,
      searchQuery, setSearchQuery,
      activeCategory, setActiveCategory,
      otcRxFilter, setOtcRxFilter,
      filteredDrugs,
      recentlyViewed, addToRecentlyViewed,
      symptomInput, setSymptomInput,
      selectedSymptoms, toggleSymptom, clearSelectedSymptoms,
      detectedRedFlags,
      symptomSuggestions, runSymptomCheck,
      pillQuery, setPillQuery,
      identifierResults, runIdentifier,
    }),
    [
      language, setLanguage,
      searchQuery, setSearchQuery,
      activeCategory,
      otcRxFilter,
      filteredDrugs,
      recentlyViewed, addToRecentlyViewed,
      symptomInput,
      selectedSymptoms, toggleSymptom, clearSelectedSymptoms,
      detectedRedFlags,
      symptomSuggestions, runSymptomCheck,
      pillQuery,
      identifierResults, runIdentifier,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
