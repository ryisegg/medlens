import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Pill, CaretRight } from "@phosphor-icons/react";
import type { Drug, DrugCategory } from "../../types";
import { useApp } from "../../context/AppContext";
import { translateDrugNameOnly, DRUG_CATEGORY_ZH } from "../../utils/medicalTranslation";

interface DrugCardProps {
  drug: Drug;
  onClick?: () => void;
}

const CATEGORY_CONFIG: Record<DrugCategory, { color: string; bg: string; darkBg: string; darkColor: string }> = {
  "Pain Relief":        { color: "text-rose-600",   bg: "bg-rose-50",   darkBg: "dark:bg-rose-950/30",  darkColor: "dark:text-rose-400"   },
  "Allergy":            { color: "text-purple-600",  bg: "bg-purple-50", darkBg: "dark:bg-purple-950/30",darkColor: "dark:text-purple-400"  },
  "Cold & Flu":         { color: "text-blue-600",    bg: "bg-blue-50",   darkBg: "dark:bg-blue-950/30",  darkColor: "dark:text-blue-400"    },
  "Digestive Health":   { color: "text-orange-600",  bg: "bg-orange-50", darkBg: "dark:bg-orange-950/30",darkColor: "dark:text-orange-400"  },
  "Skin":               { color: "text-emerald-600", bg: "bg-emerald-50",darkBg: "dark:bg-emerald-950/30",darkColor: "dark:text-emerald-400"},
  "Sleep":              { color: "text-indigo-600",  bg: "bg-indigo-50", darkBg: "dark:bg-indigo-950/30",darkColor: "dark:text-indigo-400"  },
  "Vitamins":           { color: "text-amber-600",   bg: "bg-amber-50",  darkBg: "dark:bg-amber-950/30", darkColor: "dark:text-amber-400"   },
  "Chronic Conditions": { color: "text-slate-600",   bg: "bg-slate-100", darkBg: "dark:bg-slate-800/40", darkColor: "dark:text-slate-400"   },
};

export function DrugCard({ drug, onClick }: DrugCardProps) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, language } = useApp();
  const isFav = favorites.includes(drug.id);
  const isZh = language === "zh";
  const handleClick = onClick ?? (() => navigate(`/drugs/${drug.id}`));

  const zhName = drug.chineseName ?? translateDrugNameOnly(drug.name);
  const hasZhName = zhName !== drug.name;
  const description = isZh && drug.chineseSummary ? drug.chineseSummary : drug.description;

  const catConfig = CATEGORY_CONFIG[drug.category];
  const categoryLabel = isZh ? DRUG_CATEGORY_ZH[drug.category] : drug.category;
  const otcLabel = isZh
    ? drug.otcOrRx === "OTC" ? "非处方" : "处方药"
    : drug.otcOrRx;

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-soft dark:bg-[#1c1c1e]"
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-start gap-3.5 p-4 text-left"
      >
        {/* Category icon area */}
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${catConfig.bg} ${catConfig.darkBg}`}>
          <Pill size={22} weight="duotone" className={`${catConfig.color} ${catConfig.darkColor}`} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pr-8">
          {isZh && hasZhName ? (
            <>
              <p className="text-base font-bold leading-tight text-slate-900 dark:text-white">{zhName}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{drug.name}</p>
            </>
          ) : (
            <p className="text-base font-bold leading-tight text-slate-900 dark:text-white">{drug.name}</p>
          )}

          <p className="mt-1 text-[13px] leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
            {description}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${catConfig.bg} ${catConfig.color} ${catConfig.darkBg} ${catConfig.darkColor}`}>
              {categoryLabel}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              drug.otcOrRx === "OTC"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            }`}>
              {otcLabel}
            </span>
            {drug.brandNames.length > 0 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {drug.brandNames.slice(0, 2).join(" · ")}
              </span>
            )}
          </div>
        </div>

        <CaretRight size={16} weight="bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
      </button>

      {/* Favorite button */}
      <motion.button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggleFavorite(drug.id); }}
        whileTap={{ scale: 0.85 }}
        className={`absolute top-3.5 right-8 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          isFav
            ? "text-rose-500 dark:text-rose-400"
            : "text-slate-300 hover:text-slate-400 dark:text-slate-600"
        }`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={20} weight={isFav ? "fill" : "regular"} />
      </motion.button>
    </motion.div>
  );
}
