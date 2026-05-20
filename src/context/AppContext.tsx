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
  ApiHistoryEntry,
  Drug,
  DrugCategory,
  HealthProfile,
  Language,
  OtcRxFilter,
  PillIdentifierQuery,
  PillIdentifierResult,
  RecentSearch,
  Reminder,
  SavedApiDrug,
  SymptomSuggestion,
} from "../types";
import { getDrugById, getDrugsByCategory } from "../data/drugs";
import { detectRedFlags, getSymptomSuggestions, CHIP_SYMPTOM_KEYWORDS } from "../data/symptoms";
import { translateDrugNameOnly } from "../utils/medicalTranslation";
import { runPillIdentifier } from "../data/identifier";

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_PILL_QUERY: PillIdentifierQuery = {
  color: "", shape: "", imprint: "", strength: "", scored: "",
};

// ── localStorage helpers ────────────────────────────────────────────────────
function loadStr(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch { return fallback; }
}
function saveJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function loadLanguage(): Language {
  const v = loadStr("medlens_lang", "en");
  return (v === "en" || v === "zh") ? v : "en";
}
function loadDark(): boolean {
  return loadStr("medlens_theme", "light") === "dark";
}
function loadOnboarded(): boolean {
  return loadStr("medlens_onboarded", "") === "1";
}
function loadRecentlyViewed(): Drug[] {
  const ids = loadJSON<string[]>("medlens_recent", []);
  return ids.map((id) => getDrugById(id)).filter(Boolean) as Drug[];
}
function loadFavorites(): string[] {
  return loadJSON<string[]>("medlens_favorites", []);
}
function loadReminders(): Reminder[] {
  return loadJSON<Reminder[]>("medlens_reminders", []);
}
function loadSavedApiDrugs(): SavedApiDrug[] {
  return loadJSON<SavedApiDrug[]>("medlens_saved_api", []);
}
function loadApiHistory(): ApiHistoryEntry[] {
  return loadJSON<ApiHistoryEntry[]>("medlens_api_history", []);
}
function loadRecentSearches(): RecentSearch[] {
  return loadJSON<RecentSearch[]>("medlens_recent_searches", []);
}
const DEFAULT_HEALTH_PROFILE: HealthProfile = { allergies: [], conditions: [], currentMeds: [] };
function loadHealthProfile(): HealthProfile {
  return loadJSON<HealthProfile>("medlens_health_profile", DEFAULT_HEALTH_PROFILE);
}
function loadRegion(): "US" | "CN" {
  const v = loadStr("medlens_region", "US");
  return v === "CN" ? "CN" : "US";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageRaw] = useState<Language>(loadLanguage);
  const [isDark, setIsDark] = useState<boolean>(loadDark);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(loadOnboarded);
  const [searchQuery, setSearchQueryRaw] = useState("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory | "All">("All");
  const [otcRxFilter, setOtcRxFilter] = useState<OtcRxFilter>("all");
  const [recentlyViewed, setRecentlyViewed] = useState<Drug[]>(loadRecentlyViewed);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSuggestions, setSymptomSuggestions] = useState<SymptomSuggestion[]>([]);
  const [pillQuery, setPillQuery] = useState<PillIdentifierQuery>(EMPTY_PILL_QUERY);
  const [identifierResults, setIdentifierResults] = useState<PillIdentifierResult[]>([]);
  const [savedApiDrugs, setSavedApiDrugs] = useState<SavedApiDrug[]>(loadSavedApiDrugs);
  const [apiHistory, setApiHistory] = useState<ApiHistoryEntry[]>(loadApiHistory);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>(loadHealthProfile);
  const [region, setRegionRaw] = useState<"US" | "CN">(loadRegion);

  // ── Language ──────────────────────────────────────────────────────────────
  const setLanguage = useCallback((lang: Language) => {
    setLanguageRaw(lang);
    try { localStorage.setItem("medlens_lang", lang); } catch { /* ignore */ }
  }, []);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try { localStorage.setItem("medlens_theme", next ? "dark" : "light"); } catch { /* quota */ }
      return next;
    });
  }, []);

  // ── Onboarding ────────────────────────────────────────────────────────────
  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
    try { localStorage.setItem("medlens_onboarded", "1"); } catch { /* quota */ }
  }, []);

  // ── Drug search ───────────────────────────────────────────────────────────
  const filteredDrugs = useMemo(() => {
    let result = getDrugsByCategory(activeCategory);
    if (otcRxFilter !== "all") {
      result = result.filter((d) => d.otcOrRx === otcRxFilter);
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return result;
    return result.filter((d) => {
      const zhName = translateDrugNameOnly(d.name);
      return (
        d.name.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        d.activeIngredient.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.imprintExamples.some((imp) => imp.toLowerCase().includes(q)) ||
        (zhName !== d.name && zhName.includes(q))
      );
    });
  }, [searchQuery, activeCategory, otcRxFilter]);

  const setSearchQuery = useCallback((q: string) => setSearchQueryRaw(q), []);

  // ── Recently viewed ───────────────────────────────────────────────────────
  const addToRecentlyViewed = useCallback((drug: Drug) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((d) => d.id !== drug.id);
      const updated = [drug, ...filtered].slice(0, 5);
      saveJSON("medlens_recent", updated.map((d) => d.id));
      return updated;
    });
  }, []);

  // ── Favorites ─────────────────────────────────────────────────────────────
  const toggleFavorite = useCallback((drugId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(drugId)
        ? prev.filter((id) => id !== drugId)
        : [...prev, drugId];
      saveJSON("medlens_favorites", next);
      return next;
    });
  }, []);

  // ── Reminders ─────────────────────────────────────────────────────────────
  const addReminder = useCallback((data: { drugName: string; dosage: string; time: string }) => {
    const reminder: Reminder = { id: Date.now().toString(), ...data };
    setReminders((prev) => {
      const next = [...prev, reminder];
      saveJSON("medlens_reminders", next);
      return next;
    });
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveJSON("medlens_reminders", next);
      return next;
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

  const combinedSymptomInput = useMemo(() => {
    const chipKeywords = selectedSymptoms
      .flatMap((chip) => CHIP_SYMPTOM_KEYWORDS[chip] ?? [chip])
      .join(" ");
    return [chipKeywords, symptomInput].filter(Boolean).join(" ");
  }, [selectedSymptoms, symptomInput]);

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

  // ── Saved API drugs ───────────────────────────────────────────────────────
  const toggleSavedApiDrug = useCallback((name: string, genericName?: string) => {
    setSavedApiDrugs((prev) => {
      const exists = prev.some((d) => d.name.toLowerCase() === name.toLowerCase());
      const next = exists
        ? prev.filter((d) => d.name.toLowerCase() !== name.toLowerCase())
        : [{ name, genericName, savedAt: Date.now() }, ...prev];
      saveJSON("medlens_saved_api", next);
      return next;
    });
  }, []);

  const isApiDrugSaved = useCallback((name: string) => {
    return savedApiDrugs.some((d) => d.name.toLowerCase() === name.toLowerCase());
  }, [savedApiDrugs]);

  // ── API view history ──────────────────────────────────────────────────────
  const addToApiHistory = useCallback((name: string, genericName?: string) => {
    setApiHistory((prev) => {
      const filtered = prev.filter((d) => d.name.toLowerCase() !== name.toLowerCase());
      const next = [{ name, genericName, viewedAt: Date.now() }, ...filtered].slice(0, 20);
      saveJSON("medlens_api_history", next);
      return next;
    });
  }, []);

  const clearApiHistory = useCallback(() => {
    setApiHistory([]);
    try { localStorage.removeItem("medlens_api_history"); } catch { /* ignore */ }
  }, []);

  // ── Recent searches ───────────────────────────────────────────────────────
  const addToRecentSearches = useCallback((query: string) => {
    const q = query.trim();
    if (!q || q.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.query.toLowerCase() !== q.toLowerCase());
      const next = [{ query: q, searchedAt: Date.now() }, ...filtered].slice(0, 10);
      saveJSON("medlens_recent_searches", next);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try { localStorage.removeItem("medlens_recent_searches"); } catch { /* ignore */ }
  }, []);

  // ── Health profile ────────────────────────────────────────────────────────
  const updateHealthProfile = useCallback((patch: Partial<HealthProfile>) => {
    setHealthProfile((prev) => {
      const next = { ...prev, ...patch };
      saveJSON("medlens_health_profile", next);
      return next;
    });
  }, []);

  // ── Region ────────────────────────────────────────────────────────────────
  const setRegion = useCallback((r: "US" | "CN") => {
    setRegionRaw(r);
    try { localStorage.setItem("medlens_region", r); } catch { /* ignore */ }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      language, setLanguage,
      isDark, toggleDark,
      hasOnboarded, completeOnboarding,
      searchQuery, setSearchQuery,
      activeCategory, setActiveCategory,
      otcRxFilter, setOtcRxFilter,
      filteredDrugs,
      recentlyViewed, addToRecentlyViewed,
      favorites, toggleFavorite,
      reminders, addReminder, removeReminder,
      symptomInput, setSymptomInput,
      selectedSymptoms, toggleSymptom, clearSelectedSymptoms,
      detectedRedFlags,
      symptomSuggestions, runSymptomCheck,
      pillQuery, setPillQuery,
      identifierResults, runIdentifier,
      savedApiDrugs, toggleSavedApiDrug, isApiDrugSaved,
      apiHistory, addToApiHistory, clearApiHistory,
      recentSearches, addToRecentSearches, clearRecentSearches,
      healthProfile, updateHealthProfile,
      region, setRegion,
    }),
    [
      language, setLanguage,
      isDark, toggleDark,
      hasOnboarded, completeOnboarding,
      searchQuery, setSearchQuery,
      activeCategory, otcRxFilter, filteredDrugs,
      recentlyViewed, addToRecentlyViewed,
      favorites, toggleFavorite,
      reminders, addReminder, removeReminder,
      symptomInput, selectedSymptoms, toggleSymptom, clearSelectedSymptoms,
      detectedRedFlags, symptomSuggestions, runSymptomCheck,
      pillQuery, identifierResults, runIdentifier,
      savedApiDrugs, toggleSavedApiDrug, isApiDrugSaved,
      apiHistory, addToApiHistory, clearApiHistory,
      recentSearches, addToRecentSearches, clearRecentSearches,
      healthProfile, updateHealthProfile,
      region, setRegion,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
