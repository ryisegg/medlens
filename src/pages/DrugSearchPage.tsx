import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { AutocompleteSearch } from "../components/shared/AutocompleteSearch";
import { DrugCard } from "../components/shared/DrugCard";
import { DrugCardSkeleton } from "../components/shared/DrugCardSkeleton";
import type { DrugCategory, OtcRxFilter } from "../types";
import { ALL_CATEGORIES } from "../data/drugs";

const CATEGORY_EMOJIS: Record<DrugCategory | "All", string> = {
  All: "⊕", "Pain Relief": "💊", Allergy: "🌿", "Cold & Flu": "🤧",
  "Digestive Health": "🫁", Skin: "🧴", Sleep: "🌙", Vitamins: "⭐", "Chronic Conditions": "🏥",
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
      {/* Sticky search header */}
      <div className="sticky top-12 z-30 bg-white px-4 pt-3 pb-3 shadow-sm dark:bg-[#1c1c1e] dark:shadow-none border-b border-slate-100 dark:border-[#2c2c2e]">
        <AutocompleteSearch
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

        {/* Category chips */}
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

      {/* Drug list */}
      <div className="px-4 pb-4">
        {filteredDrugs.length === 0 && !searchQuery ? (
          <div className="space-y-3 mt-1">
            {[1, 2, 3].map((i) => <DrugCardSkeleton key={i} />)}
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#1c1c1e]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-slate-700 dark:text-white">{t.search.noResults}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-[#636366]">{t.search.noResultsDesc}</p>
            <p className="mt-1 text-xs text-blue-600 dark:text-[#0a84ff]">{t.search.liveTip}</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-950/40 dark:text-[#0a84ff]"
            >
              {t.common.clear}
            </button>
          </div>
        ) : (
          <div className="mt-1 space-y-3">
            {filteredDrugs.map((drug) => (
              <DrugCard
                key={drug.id}
                drug={drug}
                onClick={() => navigate(`/drugs/${drug.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-6">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 dark:bg-amber-950/30 dark:border-amber-800">
          <span className="text-lg flex-shrink-0">⚕️</span>
          <p className="text-xs text-amber-800 font-medium dark:text-amber-300">{t.search.warning}</p>
        </div>
      </div>
    </div>
  );
}
