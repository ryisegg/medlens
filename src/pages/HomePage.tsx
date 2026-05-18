import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import type { DrugCategory } from "../types";

const COMMON_SEARCHES = ["Ibuprofen", "Tylenol", "Benadryl", "Aspirin", "Metformin"];

const QUICK_ACTIONS = [
  { key: "searchDrug", to: "/drugs", icon: "💊", bg: "bg-blue-50", iconBg: "bg-blue-100" },
  { key: "identifyPill", to: "/identifier", icon: "🔍", bg: "bg-green-50", iconBg: "bg-green-100" },
  { key: "checkSymptoms", to: "/symptoms", icon: "🩺", bg: "bg-purple-50", iconBg: "bg-purple-100" },
  { key: "safetyInfo", to: "/safety", icon: "🛡️", bg: "bg-orange-50", iconBg: "bg-orange-100" },
] as const;

const CATEGORIES: { cat: DrugCategory; icon: string }[] = [
  { cat: "Pain Relief", icon: "💊" }, { cat: "Allergy", icon: "🌿" },
  { cat: "Cold & Flu", icon: "🤧" }, { cat: "Digestive Health", icon: "🫁" },
  { cat: "Skin", icon: "🧴" }, { cat: "Sleep", icon: "🌙" },
  { cat: "Vitamins", icon: "⭐" }, { cat: "Chronic Conditions", icon: "🏥" },
];

export function HomePage() {
  const navigate = useNavigate();
  const { language, setSearchQuery, setActiveCategory, recentlyViewed } = useApp();
  const t = getTranslations(language);

  useEffect(() => {
    document.title = t.appName;
  }, [t.appName]);

  const handleCommonSearch = (term: string) => {
    setSearchQuery(term);
    navigate("/drugs");
  };

  const handleCategory = (cat: DrugCategory) => {
    setActiveCategory(cat);
    navigate("/drugs");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      {/* Hero card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
          {t.appName}
        </div>
        <h1 className="text-xl font-bold leading-snug">{t.home.heroTitle}</h1>
        <p className="mt-2 text-sm text-blue-100">{t.home.heroSubtitle}</p>
        <button
          type="button"
          onClick={() => navigate("/drugs")}
          className="mt-4 flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {t.search.placeholder}
        </button>
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-slate-500 uppercase tracking-wide">{t.home.quickActions}</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ key, to, icon, bg, iconBg }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 rounded-2xl ${bg} p-4 text-left shadow-sm transition active:scale-95`}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} text-xl`}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.home[key as keyof typeof t.home] as string}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t.home[`${key}Desc` as keyof typeof t.home] as string}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Common searches */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-slate-500 uppercase tracking-wide">{t.home.commonSearches}</h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleCommonSearch(term)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 active:scale-95"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{t.home.recentlyViewed}</h2>
          {recentlyViewed.length > 0 && (
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-medium text-blue-600">
              {t.home.viewAll}
            </button>
          )}
        </div>
        {recentlyViewed.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-slate-400 shadow-sm">
            {t.home.noRecent}
          </div>
        ) : (
          <div className="space-y-3">
            {recentlyViewed.slice(0, 3).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by category */}
      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-slate-500 uppercase tracking-wide">
          {language === "en" ? "Browse by Category" : "按类别浏览"}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ cat, icon }) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategory(cat)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 shadow-sm transition active:scale-95"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-center text-[10px] font-medium leading-tight text-slate-600">
                {language === "en" ? cat : translateCategory(cat)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Emergency banner */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <p className="text-sm font-bold text-red-800">{t.home.emergency}</p>
            <p className="mt-1 text-xs text-red-700">{t.home.emergencyDesc}</p>
          </div>
        </div>
      </div>

      {/* Bottom spacer for breathing room */}
      <div className="h-2" />
    </div>
  );
}

function translateCategory(cat: string): string {
  const map: Record<string, string> = {
    "Pain Relief": "止痛", "Allergy": "抗过敏", "Cold & Flu": "感冒流感",
    "Digestive Health": "消化", "Skin": "皮肤", "Sleep": "睡眠",
    "Vitamins": "维生素", "Chronic Conditions": "慢性病",
  };
  return map[cat] ?? cat;
}
