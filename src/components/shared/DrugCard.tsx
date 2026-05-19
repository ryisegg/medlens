import { useNavigate } from "react-router-dom";
import type { Drug, DrugCategory } from "../../types";
import { useApp } from "../../context/AppContext";
import { translateDrugNameOnly, DRUG_CATEGORY_ZH } from "../../utils/medicalTranslation";

interface DrugCardProps {
  drug: Drug;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<DrugCategory, string> = {
  "Pain Relief":         "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Allergy":             "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Cold & Flu":          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Digestive Health":    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Skin":                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "Sleep":               "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Vitamins":            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Chronic Conditions":  "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300",
};


function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export function DrugCard({ drug, onClick }: DrugCardProps) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, language } = useApp();
  const isFav = favorites.includes(drug.id);
  const isZh = language === "zh";
  const handleClick = onClick ?? (() => navigate(`/drugs/${drug.id}`));

  const zhName = translateDrugNameOnly(drug.name);
  const hasZhName = zhName !== drug.name;

  const categoryLabel = isZh ? DRUG_CATEGORY_ZH[drug.category] : drug.category;
  const otcLabel = isZh
    ? drug.otcOrRx === "OTC" ? "非处方" : "处方药"
    : drug.otcOrRx;
  const brandLabel = isZh ? "商品名" : "Also";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-2xl bg-white px-5 py-4 pr-12 text-left shadow-sm transition active:scale-[0.98] dark:bg-[#1c1c1e] dark:shadow-none"
      >
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[drug.category]}`}>
            {categoryLabel}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            drug.otcOrRx === "OTC"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          }`}>
            {otcLabel}
          </span>
        </div>

        {/* Drug name — Chinese name shown prominently when available */}
        {isZh && hasZhName ? (
          <>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{zhName}</h3>
            <p className="text-xs text-slate-400 dark:text-[#636366]">{drug.name}</p>
          </>
        ) : (
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{drug.name}</h3>
        )}

        <p className="mt-0.5 text-sm text-slate-500 line-clamp-2 dark:text-[#8e8e93]">{drug.description}</p>
        {drug.brandNames.length > 0 && (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-[#636366]">
            {brandLabel}: {drug.brandNames.slice(0, 3).join(", ")}
          </p>
        )}
      </button>

      <button
        type="button"
        onClick={() => toggleFavorite(drug.id)}
        className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 ${
          isFav
            ? "text-red-500 dark:text-red-400"
            : "text-slate-300 dark:text-[#636366]"
        }`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <HeartIcon filled={isFav} />
      </button>
    </div>
  );
}
