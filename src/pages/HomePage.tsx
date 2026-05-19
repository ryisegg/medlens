import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import { getDrugById } from "../data/drugs";
import type { DrugCategory } from "../types";

const COMMON_SEARCHES = ["Ibuprofen", "Tylenol", "Benadryl", "Aspirin", "Metformin", "Lisinopril"];

const QUICK_ACTIONS = [
  { key: "searchDrug",    to: "/drugs",      icon: "💊", bg: "bg-blue-50 dark:bg-blue-950/40",    iconBg: "bg-blue-100 dark:bg-blue-900/50" },
  { key: "identifyPill",  to: "/identifier", icon: "🔍", bg: "bg-green-50 dark:bg-green-950/40",  iconBg: "bg-green-100 dark:bg-green-900/50" },
  { key: "checkSymptoms", to: "/symptoms",   icon: "🩺", bg: "bg-purple-50 dark:bg-purple-950/40",iconBg: "bg-purple-100 dark:bg-purple-900/50" },
  { key: "safetyInfo",    to: "/safety",     icon: "🛡️", bg: "bg-orange-50 dark:bg-orange-950/40",iconBg: "bg-orange-100 dark:bg-orange-900/50" },
] as const;

const CATEGORIES: { cat: DrugCategory; icon: string }[] = [
  { cat: "Pain Relief", icon: "💊" }, { cat: "Allergy", icon: "🌿" },
  { cat: "Cold & Flu", icon: "🤧" }, { cat: "Digestive Health", icon: "🫁" },
  { cat: "Skin", icon: "🧴" }, { cat: "Sleep", icon: "🌙" },
  { cat: "Vitamins", icon: "⭐" }, { cat: "Chronic Conditions", icon: "🏥" },
];

const STAT_CARDS = [
  { value: "500+", labelEn: "Medications", labelZh: "药品收录" },
  { value: "3", labelEn: "FDA Databases", labelZh: "FDA数据库" },
  { value: "EN/ZH", labelEn: "Bilingual", labelZh: "双语支持" },
];

function translateCategory(cat: string): string {
  const map: Record<string, string> = {
    "Pain Relief": "止痛", "Allergy": "抗过敏", "Cold & Flu": "感冒流感",
    "Digestive Health": "消化", "Skin": "皮肤", "Sleep": "睡眠",
    "Vitamins": "维生素", "Chronic Conditions": "慢性病",
  };
  return map[cat] ?? cat;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

interface AddReminderSheetProps {
  onClose: () => void;
  onAdd: (data: { drugName: string; dosage: string; time: string }) => void;
  t: ReturnType<typeof getTranslations>;
}

function AddReminderSheet({ onClose, onAdd, t }: AddReminderSheetProps) {
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("08:00");

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366]";

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-2xl dark:bg-[#1c1c1e]">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 dark:bg-[#3a3a3c]" />
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t.reminders.add}</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide dark:text-[#8e8e93]">
              {t.reminders.drugName}
            </label>
            <input type="text" value={drugName} onChange={(e) => setDrugName(e.target.value)}
              placeholder={t.reminders.drugNamePlaceholder} className={inputClass} autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide dark:text-[#8e8e93]">
              {t.reminders.dosage}
            </label>
            <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)}
              placeholder={t.reminders.dosagePlaceholder} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide dark:text-[#8e8e93]">
              {t.reminders.time}
            </label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-[#3a3a3c] dark:text-[#8e8e93]">
            {t.reminders.cancel}
          </button>
          <button type="button" disabled={!drugName.trim()}
            onClick={() => { onAdd({ drugName: drugName.trim(), dosage: dosage.trim(), time }); onClose(); }}
            className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]">
            {t.reminders.save}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { language, setSearchQuery, setActiveCategory, recentlyViewed, favorites, reminders, addReminder, removeReminder } = useApp();
  const t = getTranslations(language);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const isZh = language === "zh";

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

  const favoriteDrugs = favorites
    .map((id) => getDrugById(id))
    .filter(Boolean) as ReturnType<typeof getDrugById>[];

  return (
    <div className="space-y-4 px-4 py-4">

      {/* Hero — platform pitch */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-6 right-12 h-24 w-24 rounded-full bg-white/5" />

        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{t.appName}</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            {isZh ? "AI 驱动" : "AI-Powered"}
          </span>
        </div>

        <h1 className="text-xl font-bold leading-snug">{t.home.heroTitle}</h1>
        <p className="mt-1.5 text-sm text-blue-100">{t.home.heroSubtitle}</p>

        {/* Stats row */}
        <div className="mt-4 flex gap-3">
          {STAT_CARDS.map((s) => (
            <div key={s.value} className="flex-1 rounded-2xl bg-white/15 px-2 py-2 text-center backdrop-blur-sm">
              <p className="text-sm font-bold">{s.value}</p>
              <p className="text-[10px] text-blue-200">{isZh ? s.labelZh : s.labelEn}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/drugs")}
          className="mt-4 flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {t.search.placeholder}
        </button>
      </div>

      {/* Trust indicators */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: "🏛️", labelEn: "FDA Data", labelZh: "FDA数据" },
          { icon: "🔒", labelEn: "No Login", labelZh: "无需登录" },
          { icon: "🌐", labelEn: "EN + ZH", labelZh: "中英双语" },
        ].map((item) => (
          <div key={item.icon} className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 shadow-sm dark:bg-[#1c1c1e]">
            <span className="text-xl">{item.icon}</span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-[#8e8e93]">
              {isZh ? item.labelZh : item.labelEn}
            </span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 px-1 text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
          {t.home.quickActions}
        </h2>
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
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {t.home[key as keyof typeof t.home] as string}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8e8e93]">
                  {t.home[`${key}Desc` as keyof typeof t.home] as string}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Medication Reminders */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
            {t.reminders.title}
          </h2>
          <button type="button" onClick={() => setShowAddReminder(true)}
            className="text-sm font-semibold text-blue-600 dark:text-[#0a84ff]">
            {t.reminders.add}
          </button>
        </div>
        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#1c1c1e]">
          {reminders.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-slate-400 dark:text-[#636366]">
              {t.reminders.empty}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-[#2c2c2e]">
              {reminders.map((r, i) => (
                <li key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "rounded-t-2xl" : ""} ${i === reminders.length - 1 ? "rounded-b-2xl" : ""}`}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                    <span className="text-base">🕐</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate dark:text-white">{r.drugName}</p>
                    <p className="text-xs text-slate-400 dark:text-[#636366]">
                      {r.dosage ? `${r.dosage} · ` : ""}{t.reminders.daily} {formatTime(r.time)}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeReminder(r.id)}
                    className="flex-shrink-0 text-slate-300 hover:text-red-400 transition dark:text-[#3a3a3c] dark:hover:text-red-500"
                    aria-label={t.reminders.delete}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Favorites */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
            {t.favorites.title}
          </h2>
          {favoriteDrugs.length > 3 && (
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-medium text-blue-600 dark:text-[#0a84ff]">
              {t.favorites.viewAll}
            </button>
          )}
        </div>
        {favoriteDrugs.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-5 text-center shadow-sm dark:bg-[#1c1c1e]">
            <span className="text-2xl">♡</span>
            <p className="mt-1 text-sm text-slate-400 dark:text-[#636366]">{t.favorites.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteDrugs.slice(0, 3).map((drug) => drug && (
              <div key={drug.id} className="relative">
                <DrugCard drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Common searches */}
      <section>
        <h2 className="mb-3 px-1 text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
          {t.home.commonSearches}
        </h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_SEARCHES.map((term) => (
            <button key={term} type="button" onClick={() => handleCommonSearch(term)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 active:scale-95 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white">
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
            {t.home.recentlyViewed}
          </h2>
          {recentlyViewed.length > 0 && (
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-medium text-blue-600 dark:text-[#0a84ff]">
              {t.home.viewAll}
            </button>
          )}
        </div>
        {recentlyViewed.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-5 text-center text-sm text-slate-400 shadow-sm dark:bg-[#1c1c1e] dark:text-[#636366]">
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
        <h2 className="mb-3 px-1 text-xs font-semibold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
          {isZh ? "按类别浏览" : "Browse by Category"}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ cat, icon }) => (
            <button key={cat} type="button" onClick={() => handleCategory(cat)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 shadow-sm transition active:scale-95 dark:bg-[#1c1c1e]">
              <span className="text-2xl">{icon}</span>
              <span className="text-center text-[10px] font-medium leading-tight text-slate-600 dark:text-[#8e8e93]">
                {isZh ? translateCategory(cat) : cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Emergency banner */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/40">
        <div className="flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-300">{t.home.emergency}</p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{t.home.emergencyDesc}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-300">
                📞 911
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-300">
                ☎ Poison Control: 1-800-222-1222
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-800 dark:bg-red-900/40 dark:text-red-300">
                💬 Crisis: 988
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-2" />

      {showAddReminder && (
        <AddReminderSheet onClose={() => setShowAddReminder(false)} onAdd={addReminder} t={t} />
      )}
    </div>
  );
}
