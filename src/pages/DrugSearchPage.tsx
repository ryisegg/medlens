import { useEffect, useCallback } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ensureExpandedLoaded } from "../data/catalog";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { AutocompleteSearch } from "../components/shared/AutocompleteSearch";
import { DrugCard } from "../components/shared/DrugCard";
import { DrugCardSkeleton } from "../components/shared/DrugCardSkeleton";
import type { Drug, DrugCategory, OtcRxFilter } from "../types";
import { ALL_CATEGORIES, getDrugsByCategory } from "../data/catalog";
import { searchRxNorm } from "../services/rxnormApi";
import { fetchAiDrugSearch } from "../services/aiDrugSearch";
import type { AiDrugSuggestion } from "../services/aiDrugSearch";
import { DRUG_CATEGORY_ZH, translateDrugNameOnly, lookupZhForDrugName } from "../utils/medicalTranslation";

const CATEGORY_EMOJIS: Record<DrugCategory | "All", string> = {
  All: "⊕", "Pain Relief": "💊", Allergy: "🌿", "Cold & Flu": "🤧",
  "Digestive Health": "🫁", Skin: "🧴", Sleep: "🌙", Vitamins: "⭐", "Chronic Conditions": "🏥",
};

const TTY_BADGE_EN: Record<string, string> = {
  SBD: "Brand", SBN: "Brand", BN: "Brand",
  SCD: "Generic", GPCK: "Generic",
  IN: "Ingredient", MIN: "Ingredient",
};

const TTY_BADGE_ZH: Record<string, string> = {
  SBD: "品牌药", SBN: "品牌药", BN: "品牌药",
  SCD: "通用药", GPCK: "通用药",
  IN: "活性成分", MIN: "活性成分",
};

function matchesQuery(drug: Drug, query: string) {
  if (!query) return true;
  const zhName = drug.chineseName ?? translateDrugNameOnly(drug.name);
  const searchable = [
    drug.name,
    drug.genericName,
    drug.activeIngredient,
    drug.description,
    drug.chineseName,
    drug.chineseSummary,
    zhName,
    ...drug.brandNames,
    ...drug.pillColors,
    ...drug.imprintExamples,
    ...(drug.aliases ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return searchable.includes(query);
}

export function DrugSearchPage() {
  const navigate = useNavigate();
  const {
    language, searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    otcRxFilter, setOtcRxFilter,
    addToRecentSearches, toggleSavedApiDrug, isApiDrugSaved,
  } = useApp();
  const t = getTranslations(language);
  const liveQuery = searchQuery.trim();
  const debouncedAiQuery = useDebouncedValue(liveQuery, 600);
  const q = liveQuery.toLowerCase();

  useEffect(() => {
    void ensureExpandedLoaded();
  }, []);

  const localDrugs = getDrugsByCategory(activeCategory)
    .filter((drug) => otcRxFilter === "all" || drug.otcOrRx === otcRxFilter)
    .filter((drug) => matchesQuery(drug, q));

  const { data: liveResults = [], isPending: liveLoading } = useQuery({
    queryKey: ["rxnorm-page", liveQuery],
    queryFn: () => searchRxNorm(liveQuery),
    enabled: liveQuery.length >= 2,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const showAiSearch = debouncedAiQuery.length >= 3;
  const { data: aiData, isPending: aiLoading, isError: aiError } = useQuery({
    queryKey: ["ai-drug-search", debouncedAiQuery, language],
    queryFn: () => fetchAiDrugSearch({ query: debouncedAiQuery, language }),
    enabled: showAiSearch,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const localNames = new Set(localDrugs.map((drug) => drug.name.toLowerCase()));
  const visibleLiveResults = liveResults
    .filter((result) => !localNames.has(result.name.toLowerCase()))
    .slice(0, 12);
  const totalResults = localDrugs.length + visibleLiveResults.length;
  const liveTitle = language === "zh" ? "RxNorm 在线结果" : "RxNorm live results";
  const loadingText = language === "zh" ? "正在查询 RxNorm..." : "Searching RxNorm...";
  const noLocalText = language === "zh"
    ? "本地药品库没有匹配项，但可以查看下面的 RxNorm 在线结果。"
    : "No local curated match, but RxNorm live results are available below.";

  useEffect(() => {
    document.title = `${t.search.title} — ${t.appName}`;
  }, [t.search.title, t.appName]);

  // Track recent searches (debounced — save after results arrive)
  useEffect(() => {
    if (liveQuery.length < 2) return;
    const timer = window.setTimeout(() => addToRecentSearches(liveQuery), 1500);
    return () => window.clearTimeout(timer);
  }, [liveQuery, addToRecentSearches]);

  const handleRxNormNavigate = useCallback((rxcui: string, name: string) => {
    addToRecentSearches(name);
    navigate(`/drugs/api/${encodeURIComponent(rxcui)}`);
  }, [navigate, addToRecentSearches]);

  const categories = ALL_CATEGORIES.filter((c) => c !== "All") as DrugCategory[];
  const otcOptions: { value: OtcRxFilter; label: string }[] = [
    { value: "all", label: t.search.all },
    { value: "OTC", label: t.search.otc },
    { value: "Rx", label: t.search.rx },
  ];

  return (
    <div className="space-y-0">
      <div className="sticky top-12 z-30 bg-white px-4 pt-3 pb-3 shadow-sm dark:bg-[#1c1c1e] dark:shadow-none border-b border-slate-100 dark:border-[#2c2c2e]">
        <AutocompleteSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.search.placeholder}
          autoFocus
        />

        <div className="mt-3 flex gap-2">
          {otcOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOtcRxFilter(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                otcRxFilter === value
                  ? "bg-blue-600 text-white dark:bg-[#0a84ff]"
                  : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-0.5">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm dark:bg-[#0a84ff]"
                    : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
                }`}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                <span>{language === "zh" ? DRUG_CATEGORY_ZH[cat] : cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-slate-400 font-medium dark:text-[#636366]">
          {totalResults}{" "}
          {totalResults === 1 ? t.search.found : t.search.foundPlural}
        </p>
      </div>

      {/* Local curated results */}
      <div className="px-4 pb-4">
        {localDrugs.length === 0 && !searchQuery ? (
          <div className="space-y-3 mt-1">
            {[1, 2, 3].map((i) => <DrugCardSkeleton key={i} />)}
          </div>
        ) : localDrugs.length > 0 ? (
          <div className="mt-1 space-y-3">
            {localDrugs.map((drug) => (
              <DrugCard
                key={drug.id}
                drug={drug}
                onClick={() => navigate(`/drugs/${drug.id}`)}
              />
            ))}
          </div>
        ) : liveLoading ? (
          <div className="space-y-3 mt-1">
            <p className="px-1 text-xs font-medium text-slate-400 dark:text-[#636366]">{loadingText}</p>
            {[1, 2].map((i) => <DrugCardSkeleton key={i} />)}
          </div>
        ) : visibleLiveResults.length === 0 && !showAiSearch ? (
          <div className="mt-4 rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#1c1c1e]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-slate-700 dark:text-white">{t.search.noResults}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-[#636366]">{t.search.noResultsDesc}</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-950/40 dark:text-[#0a84ff]"
            >
              {t.common.clear}
            </button>
          </div>
        ) : visibleLiveResults.length > 0 ? (
          <div className="mt-1 space-y-3">
            <p className="px-1 text-xs text-slate-400 dark:text-[#636366]">{noLocalText}</p>
          </div>
        ) : null}
      </div>

      {/* AI Search — primary fallback when no local results */}
      {showAiSearch && (
        <div className="px-4 pb-4">
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">AI</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
              {language === "zh" ? "AI 智能药物建议" : "AI Drug Suggestions"}
            </p>
          </div>

          {aiLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1c1c1e] animate-pulse">
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-[#2c2c2e]" />
                  <div className="mt-2 h-2.5 w-full rounded bg-slate-100 dark:bg-[#2c2c2e]" />
                  <div className="mt-1 h-2.5 w-4/5 rounded bg-slate-100 dark:bg-[#2c2c2e]" />
                </div>
              ))}
            </div>
          ) : aiError ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs text-slate-400 dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#636366]">
              {language === "zh" ? "AI 搜索暂时不可用（需配置 API）。" : "AI search unavailable (API not configured)."}
            </div>
          ) : aiData?.suggestions && aiData.suggestions.length > 0 ? (
            <div className="space-y-2">
              {aiData.seeDoctor && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 px-3 py-2.5 dark:bg-amber-950/30 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    {language === "zh" ? "建议咨询医生或药剂师。" : "Consider consulting a doctor or pharmacist for this condition."}
                  </p>
                </div>
              )}
              {aiData.suggestions.map((s: AiDrugSuggestion) => (
                <div key={s.name} className="rounded-2xl bg-white px-4 py-3.5 shadow-sm dark:bg-[#1c1c1e]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">{s.name}</p>
                      {s.genericName && s.genericName !== s.name && (
                        <p className="text-xs text-slate-500 dark:text-[#8e8e93]">{s.genericName}</p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">AI</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        s.otcOrRx === "OTC"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : s.otcOrRx === "Rx"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
                      }`}>
                        {s.otcOrRx}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-[#8e8e93]">{s.summary}</p>
                  {s.keyUses.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.keyUses.map((use) => (
                        <span key={use} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
                          {use}
                        </span>
                      ))}
                    </div>
                  )}
                  {s.warnings && (
                    <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-400">⚠ {s.warnings}</p>
                  )}
                </div>
              ))}
              {aiData.disclaimer && (
                <p className="px-1 text-[10px] text-slate-400 dark:text-[#636366]">{aiData.disclaimer}</p>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* RxNorm live results */}
      {visibleLiveResults.length > 0 && (
        <div className="px-4 pb-4">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
            {liveTitle}
          </p>
          <div className="space-y-2">
            {visibleLiveResults.map((result) => {
              const zhName = lookupZhForDrugName(result.name);
              const saved = isApiDrugSaved(result.name);
              return (
                <div key={result.rxcui} className="relative">
                  <button
                    type="button"
                    onClick={() => handleRxNormNavigate(result.rxcui, result.name)}
                    className="w-full rounded-2xl bg-white px-4 py-3.5 pr-12 text-left shadow-sm transition active:scale-[0.98] dark:bg-[#1c1c1e]"
                  >
                    {language === "zh" && zhName ? (
                      <>
                        <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">{zhName}</p>
                        <p className="text-xs text-slate-500 dark:text-[#8e8e93]">{result.name}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">{result.name}</p>
                    )}
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-[#636366]">
                      <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mr-1">RxNorm</span>
                      {(language === "zh" ? TTY_BADGE_ZH[result.tty] : TTY_BADGE_EN[result.tty]) ?? result.tty}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleSavedApiDrug(result.name); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full transition active:scale-90 ${
                      saved ? "text-blue-600 dark:text-[#0a84ff]" : "text-slate-300 dark:text-[#636366]"
                    }`}
                    aria-label={saved ? "Remove saved" : "Save drug"}
                  >
                    {saved ? (
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" />
                      </svg>
                    ) : (
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 pb-6">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 dark:bg-amber-950/30 dark:border-amber-800">
          <span className="text-lg flex-shrink-0">⚕️</span>
          <p className="text-xs text-amber-800 font-medium dark:text-amber-300">{t.search.warning}</p>
        </div>
      </div>
    </div>
  );
}
