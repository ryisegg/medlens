import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import { getDrugById } from "../data/drugs";
import { DRUG_CATEGORY_ZH } from "../utils/medicalTranslation";
import type { DrugCategory } from "../types";

const COMMON_SEARCHES = ["Triamcinolone", "Ibuprofen", "Tylenol", "Benadryl", "Metformin", "Lisinopril"];

const CATEGORIES: { cat: DrugCategory; icon: string }[] = [
  { cat: "Pain Relief", icon: "Pain" }, { cat: "Allergy", icon: "Allergy" },
  { cat: "Cold & Flu", icon: "Cold" }, { cat: "Digestive Health", icon: "Gut" },
  { cat: "Skin", icon: "Skin" }, { cat: "Sleep", icon: "Sleep" },
  { cat: "Vitamins", icon: "Vita" }, { cat: "Chronic Conditions", icon: "Rx" },
];

const QUICK_SYMPTOMS = ["发烧 2 天，头痛", "咳嗽喉咙痛", "皮疹很痒", "胃痛恶心"];
const QUICK_SYMPTOMS_EN = ["Fever for 2 days with headache", "Cough and sore throat", "Itchy rash", "Stomach pain and nausea"];

type ActiveTool = "drug" | "symptom" | "pill";

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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">
              {t.reminders.drugName}
            </label>
            <input type="text" value={drugName} onChange={(e) => setDrugName(e.target.value)}
              placeholder={t.reminders.drugNamePlaceholder} className={inputClass} autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">
              {t.reminders.dosage}
            </label>
            <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)}
              placeholder={t.reminders.dosagePlaceholder} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">
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
  const {
    language, setSearchQuery, setActiveCategory, setSymptomInput,
    recentlyViewed, favorites, reminders, addReminder, removeReminder,
  } = useApp();
  const t = getTranslations(language);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>("drug");
  const [drugDraft, setDrugDraft] = useState("");
  const [symptomDraft, setSymptomDraft] = useState("");
  const isZh = language === "zh";

  useEffect(() => {
    document.title = t.appName;
  }, [t.appName]);

  const favoriteDrugs = favorites
    .map((id) => getDrugById(id))
    .filter(Boolean) as ReturnType<typeof getDrugById>[];

  const handleDrugSearch = (term = drugDraft) => {
    const query = term.trim();
    if (!query) return;
    setSearchQuery(query);
    navigate("/drugs");
  };

  const handleSymptomCheck = (text = symptomDraft) => {
    const query = text.trim();
    if (!query) return;
    setSymptomInput(query);
    navigate("/symptoms");
  };

  const handleCategory = (cat: DrugCategory) => {
    setActiveCategory(cat);
    navigate("/drugs");
  };

  const toolClass = (tool: ActiveTool) => activeTool === tool
    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-black"
    : "bg-white text-slate-600 shadow-sm dark:bg-[#1c1c1e] dark:text-[#c7c7cc]";

  const quickSymptoms = isZh ? QUICK_SYMPTOMS : QUICK_SYMPTOMS_EN;

  return (
    <div className="space-y-4 px-4 py-4">
      <section className="rounded-[28px] bg-white p-4 shadow-sm dark:bg-[#1c1c1e]">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#0a84ff]">
            {isZh ? "小药房" : "MedLens"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
            {isZh ? "今天想确认什么？" : "What do you want to check?"}
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "drug" as const, label: isZh ? "查药" : "Drug" },
            { key: "symptom" as const, label: isZh ? "症状" : "Symptoms" },
            { key: "pill" as const, label: isZh ? "识别" : "Pill ID" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTool(item.key)}
              className={`rounded-2xl px-3 py-2.5 text-sm font-semibold transition active:scale-95 ${toolClass(item.key)}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeTool === "drug" && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
              <input
                value={drugDraft}
                onChange={(e) => setDrugDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleDrugSearch(); }}
                placeholder={isZh ? "输入药名，比如 Triamcinolone" : "Type a medicine, e.g. Triamcinolone"}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#636366]"
              />
              <button
                type="button"
                onClick={() => handleDrugSearch()}
                disabled={!drugDraft.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]"
              >
                {isZh ? "搜索" : "Search"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SEARCHES.map((term) => (
                <button key={term} type="button" onClick={() => handleDrugSearch(term)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition active:scale-95 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTool === "symptom" && (
          <div className="mt-4 space-y-3">
            <textarea
              rows={3}
              value={symptomDraft}
              onChange={(e) => setSymptomDraft(e.target.value)}
              placeholder={isZh ? "例如：发烧 2 天，头痛，成人，没有基础病" : "Example: fever for 2 days, headache, adult, no chronic conditions"}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366]"
            />
            <button
              type="button"
              onClick={() => handleSymptomCheck()}
              disabled={!symptomDraft.trim()}
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]"
            >
              {isZh ? "分析症状" : "Analyze symptoms"}
            </button>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((symptom) => (
                <button key={symptom} type="button" onClick={() => handleSymptomCheck(symptom)}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition active:scale-95 dark:bg-blue-950/40 dark:text-blue-300">
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTool === "pill" && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isZh ? "不知道手里的药片是什么？" : "Not sure what a pill is?"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-[#8e8e93]">
              {isZh ? "用颜色、形状、印字和剂量线索快速缩小范围。" : "Use color, shape, imprint, and strength clues to narrow it down."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/identifier")}
              className="mt-3 w-full rounded-2xl bg-slate-950 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              {isZh ? "开始识别" : "Start identifying"}
            </button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("/safety")}
          className="rounded-3xl bg-red-50 p-4 text-left shadow-sm transition active:scale-95 dark:bg-red-950/30"
        >
          <p className="text-sm font-bold text-red-800 dark:text-red-300">{isZh ? "紧急情况" : "Emergency"}</p>
          <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-400">
            {isZh ? "胸痛、呼吸困难、过量或中毒先求助。" : "Chest pain, breathing trouble, overdose, or poisoning."}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setShowAddReminder(true)}
          className="rounded-3xl bg-emerald-50 p-4 text-left shadow-sm transition active:scale-95 dark:bg-emerald-950/30"
        >
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{isZh ? "加提醒" : "Add reminder"}</p>
          <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
            {isZh ? "把常用药和时间放在首页。" : "Keep medicine timing close at hand."}
          </p>
        </button>
      </section>

      <section>
        <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
          {isZh ? "按场景浏览" : "Browse by need"}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ cat, icon }) => (
            <button key={cat} type="button" onClick={() => handleCategory(cat)}
              className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-2 shadow-sm transition active:scale-95 dark:bg-[#1c1c1e]">
              <span className="text-[11px] font-bold text-blue-600 dark:text-[#0a84ff]">{icon}</span>
              <span className="text-center text-[10px] font-medium leading-tight text-slate-600 dark:text-[#8e8e93]">
                {isZh ? DRUG_CATEGORY_ZH[cat] : cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {reminders.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
              {t.reminders.title}
            </h2>
            <button type="button" onClick={() => setShowAddReminder(true)}
              className="text-sm font-semibold text-blue-600 dark:text-[#0a84ff]">
              {t.reminders.add}
            </button>
          </div>
          <div className="rounded-2xl bg-white shadow-sm dark:bg-[#1c1c1e]">
            <ul className="divide-y divide-slate-100 dark:divide-[#2c2c2e]">
              {reminders.slice(0, 3).map((r, i) => (
                <li key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "rounded-t-2xl" : ""} ${i === reminders.length - 1 ? "rounded-b-2xl" : ""}`}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {formatTime(r.time).split(" ")[1]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.drugName}</p>
                    <p className="text-xs text-slate-400 dark:text-[#636366]">
                      {r.dosage ? `${r.dosage} · ` : ""}{t.reminders.daily} {formatTime(r.time)}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeReminder(r.id)}
                    className="flex-shrink-0 text-slate-300 transition hover:text-red-400 dark:text-[#3a3a3c] dark:hover:text-red-500"
                    aria-label={t.reminders.delete}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {favoriteDrugs.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
              {t.favorites.title}
            </h2>
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-medium text-blue-600 dark:text-[#0a84ff]">
              {t.favorites.viewAll}
            </button>
          </div>
          <div className="space-y-3">
            {favoriteDrugs.slice(0, 2).map((drug) => drug && (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
              {t.home.recentlyViewed}
            </h2>
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-medium text-blue-600 dark:text-[#0a84ff]">
              {t.home.viewAll}
            </button>
          </div>
          <div className="space-y-3">
            {recentlyViewed.slice(0, 2).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </section>
      )}

      <div className="h-2" />

      {showAddReminder && (
        <AddReminderSheet onClose={() => setShowAddReminder(false)} onAdd={addReminder} t={t} />
      )}
    </div>
  );
}
