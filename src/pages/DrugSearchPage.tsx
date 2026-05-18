import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { SearchBar } from "../components/shared/SearchBar";
import { DrugCard } from "../components/shared/DrugCard";
import { Spinner } from "../components/shared/Spinner";
import { useLiveSearch } from "../hooks/useLiveSearch";
import type { DrugCategory, OtcRxFilter } from "../types";
import { ALL_CATEGORIES } from "../data/drugs";

const CATEGORY_EMOJIS: Record<DrugCategory | "All", string> = {
  All: "⊕", "Pain Relief": "💊", Allergy: "🌿", "Cold & Flu": "🤧",
  "Digestive Health": "🫁", Skin: "🧴", Sleep: "🌙", Vitamins: "⭐", "Chronic Conditions": "🏥",
};

const TTY_BADGE: Record<string, string> = {
  SBD: "Brand", SBN: "Brand", BN: "Brand",
  SCD: "Generic", GPCK: "Generic",
  IN: "Ingredient", MIN: "Ingredient",
};

export function DrugSearchPage() {
  const navigate = useNavigate();
  const {
    language, searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    otcRxFilter, setOtcRxFilter,
    filteredDrugs,
  } = useApp();
  const t = getTranslations(language);
  const { results: liveResults, loading: liveLoading, error: liveError } = useLiveSearch(searchQuery);

  useEffect(() => {
    document.title = `${t.search.title} — ${t.appName}`;
  }, [t.search.title, t.appName]);

  const categories: (DrugCategory | "All")[] = ["All", ...ALL_CATEGORIES];
  const otcOptions: { value: OtcRxFilter; label: string }[] = [
    { value: "all", label: t.search.all },
    { value: "OTC", label: t.search.otc },
    { value: "Rx", label: t.search.rx },
  ];

  return (
    <div className="space-y-0">
      {/* Search header */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm dark:bg-[#1c1c1e] dark:shadow-none">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.search.placeholder}
          autoFocus
        />

        {/* OTC / Rx filter */}
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

        {/* Category chips — horizontal scroll */}
        <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-0.5">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm dark:bg-[#0a84ff]"
                    : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
                }`}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                <span>{cat === "All" ? t.search.all : cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-slate-400 font-medium dark:text-[#636366]">
          {filteredDrugs.length}{" "}
          {filteredDrugs.length === 1 ? t.search.found : t.search.foundPlural}
        </p>
      </div>

      {/* Local drug list */}
      <div className="px-4 pb-2">
        {filteredDrugs.length === 0 && !searchQuery ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#1c1c1e]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-slate-700 dark:text-white">{t.search.noResults}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-[#636366]">{t.search.noResultsDesc}</p>
          </div>
        ) : filteredDrugs.length > 0 ? (
          <>
            {searchQuery && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
                {t.search.localTitle}
              </p>
            )}
            <div className="space-y-3">
              {filteredDrugs.map((drug) => (
                <DrugCard
                  key={drug.id}
                  drug={drug}
                  onClick={() => navigate(`/drugs/${drug.id}`)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Live API results */}
      {searchQuery.trim().length >= 2 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
              {t.search.liveTitle}
            </p>
            {liveLoading && <Spinner size="sm" />}
          </div>

          {liveError && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">{t.api.searchError}</p>
          )}

          {!liveLoading && !liveError && liveResults.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-[#636366]">{t.api.noLiveResults}</p>
          )}

          {liveResults.length > 0 && (
            <div className="space-y-2">
              {liveResults.map((result) => (
                <button
                  key={result.rxcui}
                  type="button"
                  onClick={() => navigate(`/drugs/api/${encodeURIComponent(result.name)}`)}
                  className="w-full rounded-2xl bg-white px-4 py-3.5 text-left shadow-sm transition active:scale-[0.98] dark:bg-[#1c1c1e]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{result.name}</p>
                    <span className="flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {TTY_BADGE[result.tty] ?? result.tty}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-[#636366]">FDA Database · {result.rxcui}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No results at all */}
      {searchQuery && filteredDrugs.length === 0 && !liveLoading && liveResults.length === 0 && !liveError && (
        <div className="px-4 pb-4">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#1c1c1e]">
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
        </div>
      )}

      {/* Pharmacist reminder */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 dark:bg-amber-950/30 dark:border-amber-800">
          <span className="text-lg flex-shrink-0">⚕️</span>
          <p className="text-xs text-amber-800 font-medium dark:text-amber-300">{t.search.warning}</p>
        </div>
      </div>
    </div>
  );
}
