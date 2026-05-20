import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import { getDrugById } from "../data/catalog";
import { DRUG_CATEGORY_ZH } from "../utils/medicalTranslation";
import type { DrugCategory } from "../types";

const COMMON_SEARCHES = ["Triamcinolone", "Ibuprofen", "Tylenol", "Benadryl", "Metformin", "Lisinopril"];
const QUICK_SYMPTOMS = ["发烧 2 天，头痛", "咳嗽喉咙痛", "皮疹很痒", "胃痛恶心"];
const QUICK_SYMPTOMS_EN = ["Fever for 2 days with headache", "Cough and sore throat", "Itchy rash", "Stomach pain and nausea"];

const CATEGORIES: { cat: DrugCategory; shortZh: string; shortEn: string }[] = [
  { cat: "Pain Relief", shortZh: "止痛", shortEn: "Pain" },
  { cat: "Allergy", shortZh: "过敏", shortEn: "Allergy" },
  { cat: "Cold & Flu", shortZh: "感冒", shortEn: "Cold" },
  { cat: "Digestive Health", shortZh: "肠胃", shortEn: "Gut" },
  { cat: "Skin", shortZh: "皮肤", shortEn: "Skin" },
  { cat: "Sleep", shortZh: "睡眠", shortEn: "Sleep" },
  { cat: "Vitamins", shortZh: "营养", shortEn: "Vita" },
  { cat: "Chronic Conditions", shortZh: "慢病", shortEn: "Rx" },
];

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
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366]";

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-2xl dark:bg-[#1c1c1e]">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 dark:bg-[#3a3a3c]" />
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t.reminders.add}</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.drugName}</label>
            <input value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder={t.reminders.drugNamePlaceholder} className={inputClass} autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.dosage}</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder={t.reminders.dosagePlaceholder} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.time}</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-[#3a3a3c] dark:text-[#8e8e93]">
            {t.reminders.cancel}
          </button>
          <button
            type="button"
            disabled={!drugName.trim()}
            onClick={() => { onAdd({ drugName: drugName.trim(), dosage: dosage.trim(), time }); onClose(); }}
            className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]"
          >
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
  const isZh = language === "zh";
  const [activeTool, setActiveTool] = useState<ActiveTool>("drug");
  const [drugDraft, setDrugDraft] = useState("");
  const [symptomDraft, setSymptomDraft] = useState("");
  const [pillDraft, setPillDraft] = useState("");
  const [showAddReminder, setShowAddReminder] = useState(false);

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

  const handlePillIdentify = () => {
    navigate("/identifier");
  };

  const runActiveTool = () => {
    if (activeTool === "drug") handleDrugSearch();
    if (activeTool === "symptom") handleSymptomCheck();
    if (activeTool === "pill") handlePillIdentify();
  };

  const activeCanRun = activeTool === "drug"
    ? drugDraft.trim().length > 0
    : activeTool === "symptom"
      ? symptomDraft.trim().length > 0
      : true;

  const quickSymptoms = isZh ? QUICK_SYMPTOMS : QUICK_SYMPTOMS_EN;

  return (
    <div className="px-4 py-4">
      <section className="border-b border-slate-200 pb-4 dark:border-[#2c2c2e]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
              {isZh ? "小药房" : "MedLens"}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              {isZh ? "先查清楚，再用药。" : "Check first. Take safer."}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAddReminder(true)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-[#3a3a3c] dark:bg-[#1c1c1e] dark:text-[#c7c7cc]"
          >
            {isZh ? "提醒" : "Reminder"}
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-[#2c2c2e]">
            {[
              { key: "drug" as const, label: isZh ? "查药" : "Drug" },
              { key: "symptom" as const, label: isZh ? "症状" : "Symptoms" },
              { key: "pill" as const, label: isZh ? "识别" : "Pill ID" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTool(item.key)}
                className={`rounded-lg px-2 py-2 text-sm font-semibold transition ${
                  activeTool === item.key
                    ? "bg-white text-slate-950 shadow-sm dark:bg-black dark:text-white"
                    : "text-slate-500 dark:text-[#8e8e93]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {activeTool === "drug" && (
              <input
                value={drugDraft}
                onChange={(e) => setDrugDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleDrugSearch(); }}
                placeholder={isZh ? "输入药名、品牌或成分" : "Medicine, brand, or ingredient"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white"
              />
            )}

            {activeTool === "symptom" && (
              <textarea
                rows={3}
                value={symptomDraft}
                onChange={(e) => setSymptomDraft(e.target.value)}
                placeholder={isZh ? "描述症状、持续多久、年龄和基础病" : "Describe symptoms, duration, age, and conditions"}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white"
              />
            )}

            {activeTool === "pill" && (
              <input
                value={pillDraft}
                onChange={(e) => setPillDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePillIdentify(); }}
                placeholder={isZh ? "可输入印字线索，比如 I2 或 44 183" : "Optional imprint, e.g. I2 or 44 183"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white"
              />
            )}
          </div>

          <button
            type="button"
            onClick={runActiveTool}
            disabled={!activeCanRun}
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition disabled:opacity-40 dark:bg-[#0a84ff]"
          >
            {activeTool === "drug" && (isZh ? "搜索药品" : "Search medicine")}
            {activeTool === "symptom" && (isZh ? "分析症状" : "Analyze symptoms")}
            {activeTool === "pill" && (isZh ? "进入识别" : "Identify pill")}
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(activeTool === "symptom" ? quickSymptoms : COMMON_SEARCHES).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => activeTool === "symptom" ? handleSymptomCheck(item) : handleDrugSearch(item)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-[#3a3a3c] dark:bg-[#1c1c1e] dark:text-[#c7c7cc]"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
            {isZh ? "常用入口" : "Common needs"}
          </h2>
          <button type="button" onClick={() => navigate("/safety")} className="text-xs font-semibold text-red-600 dark:text-red-400">
            {isZh ? "急救信息" : "Emergency info"}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ cat, shortZh, shortEn }) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); navigate("/drugs"); }}
              className="min-h-[72px] rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center shadow-sm transition active:scale-95 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white">{isZh ? shortZh : shortEn}</p>
              <p className="mt-1 text-[10px] leading-tight text-slate-400 dark:text-[#636366]">
                {isZh ? DRUG_CATEGORY_ZH[cat] : cat}
              </p>
            </button>
          ))}
        </div>
      </section>

      {reminders.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">{t.reminders.title}</h2>
            <button type="button" onClick={() => setShowAddReminder(true)} className="text-xs font-semibold text-blue-600 dark:text-[#0a84ff]">{t.reminders.add}</button>
          </div>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-[#2c2c2e] dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
            {reminders.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-16 text-xs font-semibold text-slate-500 dark:text-[#8e8e93]">{formatTime(r.time)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.drugName}</p>
                  {r.dosage && <p className="text-xs text-slate-400 dark:text-[#636366]">{r.dosage}</p>}
                </div>
                <button type="button" onClick={() => removeReminder(r.id)} aria-label={t.reminders.delete} className="text-slate-300 hover:text-red-400 dark:text-[#3a3a3c]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {favoriteDrugs.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">{t.favorites.title}</h2>
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-semibold text-blue-600 dark:text-[#0a84ff]">{t.favorites.viewAll}</button>
          </div>
          <div className="space-y-3">
            {favoriteDrugs.slice(0, 2).map((drug) => drug && (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-[#636366]">{t.home.recentlyViewed}</h2>
            <button type="button" onClick={() => navigate("/drugs")} className="text-xs font-semibold text-blue-600 dark:text-[#0a84ff]">{t.home.viewAll}</button>
          </div>
          <div className="space-y-3">
            {recentlyViewed.slice(0, 2).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />

      {showAddReminder && (
        <AddReminderSheet onClose={() => setShowAddReminder(false)} onAdd={addReminder} t={t} />
      )}
    </div>
  );
}
