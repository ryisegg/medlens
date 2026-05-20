import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  Search, Pill, Activity, ScanLine, Leaf,
  Bell, BellPlus, ChevronRight, AlertTriangle,
  Flame, Wind, Snowflake, Sun, Calendar, Archive,
  Thermometer, X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useMedication } from "../context/MedicationContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import { TCM_CATEGORY_EN } from "../data/tcmHerbs";
import type { DrugCategory } from "../types";
import type { TCMCategory } from "../types/tcm";

// ── Fade/slide animation presets ─────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ── Static data ───────────────────────────────────────────────────────────────

const WESTERN_CATS: { cat: DrugCategory; Icon: React.FC<{ size?: number; className?: string }>; shortZh: string; shortEn: string; color: string; bg: string }[] = [
  { cat: "Pain Relief",        Icon: ({ size, className }) => <Thermometer size={size} className={className} />, shortZh: "止痛",   shortEn: "Pain",     color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-950/30"   },
  { cat: "Allergy",            Icon: ({ size, className }) => <Wind size={size} className={className} />,         shortZh: "过敏",   shortEn: "Allergy",  color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30"},
  { cat: "Cold & Flu",         Icon: ({ size, className }) => <Snowflake size={size} className={className} />,    shortZh: "感冒",   shortEn: "Cold",     color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30"   },
  { cat: "Digestive Health",   Icon: ({ size, className }) => <Flame size={size} className={className} />,        shortZh: "肠胃",   shortEn: "Gut",      color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30"},
  { cat: "Sleep",              Icon: ({ size, className }) => <Sun size={size} className={className} />,          shortZh: "睡眠",   shortEn: "Sleep",    color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30"},
  { cat: "Vitamins",           Icon: ({ size, className }) => <Leaf size={size} className={className} />,         shortZh: "营养",   shortEn: "Vitamins", color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950/30" },
  { cat: "Chronic Conditions", Icon: ({ size, className }) => <Activity size={size} className={className} />,     shortZh: "慢病",   shortEn: "Chronic",  color: "text-slate-600",  bg: "bg-slate-100 dark:bg-slate-800/40"},
];

const TCM_QUICK_CATS: { cat: TCMCategory; emoji: string }[] = [
  { cat: "补气药",     emoji: "🌿" },
  { cat: "补血药",     emoji: "🍎" },
  { cat: "清热药",     emoji: "❄️" },
  { cat: "解表药",     emoji: "🌬️" },
  { cat: "活血化瘀药", emoji: "🔴" },
  { cat: "安神药",     emoji: "🌙" },
  { cat: "温里药",     emoji: "🔥" },
  { cat: "理气药",     emoji: "🍃" },
  { cat: "化痰止咳药", emoji: "💨" },
  { cat: "消食药",     emoji: "🫃" },
];

const SEASONAL = [
  { months: [12, 1, 2], zhTitle: "冬季养生", enTitle: "Winter Wellness",
    herbs: ["桂枝", "黄芪", "当归"], gradient: "from-slate-700 to-slate-800",
    zhTip: "温阳散寒，固护正气。宜食温补，推荐：黄芪红枣茶。",
    enTip: "Warm yang, dispel cold. Try: astragalus-jujube tea.", badge: "冬 Winter" },
  { months: [3, 4, 5], zhTitle: "春季养生", enTitle: "Spring Wellness",
    herbs: ["柴胡", "菊花", "枸杞子"], gradient: "from-emerald-600 to-teal-700",
    zhTip: "疏肝解郁，升发阳气。推荐：菊花枸杞茶。",
    enTip: "Soothe the liver, lift yang energy. Try: chrysanthemum-goji tea.", badge: "春 Spring" },
  { months: [6, 7, 8], zhTitle: "夏季养生", enTitle: "Summer Wellness",
    herbs: ["金银花", "薄荷", "西洋参"], gradient: "from-amber-500 to-orange-600",
    zhTip: "清热解暑，益气养阴。推荐：金银花露。",
    enTip: "Clear summer heat, nourish qi. Try: honeysuckle tea.", badge: "夏 Summer" },
  { months: [9, 10, 11], zhTitle: "秋季养生", enTitle: "Autumn Wellness",
    herbs: ["麦冬", "百合", "沙参"], gradient: "from-orange-500 to-amber-600",
    zhTip: "润肺滋阴，防燥护肤。推荐：百合银耳羹。",
    enTip: "Moisten lungs, nourish yin. Try: lily bulb soup.", badge: "秋 Autumn" },
];

const INTERACTION_TRIGGERS = [
  { keywords: ["warfarin", "华法林", "coumadin"], herbs: ["丹参", "当归", "三七"], riskZh: "增加出血风险", riskEn: "Increased bleeding risk" },
  { keywords: ["insulin", "胰岛素", "metformin", "二甲双胍"], herbs: ["人参", "黄芪"], riskZh: "可能增强降糖效果，注意低血糖", riskEn: "May enhance hypoglycemic effect" },
  { keywords: ["digoxin", "地高辛"], herbs: ["甘草", "麻黄"], riskZh: "可能增强心脏毒性，需监测", riskEn: "May potentiate cardiac toxicity" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting(isZh: boolean): string {
  const h = new Date().getHours();
  if (isZh) {
    if (h < 6)  return "深夜好";
    if (h < 12) return "早安 ☀️";
    if (h < 18) return "下午好";
    return "晚上好 🌙";
  }
  if (h < 6)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function getWarnings(meds: string[], isZh: boolean) {
  const out: { drug: string; herbs: string[]; label: string }[] = [];
  for (const med of meds) {
    const l = med.toLowerCase();
    for (const e of INTERACTION_TRIGGERS) {
      if (e.keywords.some((k) => l.includes(k.toLowerCase()))) {
        out.push({ drug: med, herbs: e.herbs, label: isZh ? e.riskZh : e.riskEn });
      }
    }
  }
  return out;
}

// ── AddReminderSheet ──────────────────────────────────────────────────────────

function AddReminderSheet({
  onClose, onAdd, t,
}: {
  onClose: () => void;
  onAdd: (d: { drugName: string; dosage: string; time: string }) => void;
  t: ReturnType<typeof getTranslations>;
}) {
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("08:00");
  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-[#2c2c2e]";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-2xl dark:bg-[#1c1c1e]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200 dark:bg-[#3a3a3c]" />
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t.reminders.add}</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.drugName}</label>
            <input value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder={t.reminders.drugNamePlaceholder} className={inputCls} autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.dosage}</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder={t.reminders.dosagePlaceholder} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#8e8e93]">{t.reminders.time}</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
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
            className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 disabled:opacity-40 dark:bg-[#0a84ff]"
          >
            {t.reminders.save}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const {
    language, setSearchQuery, setActiveCategory, setSymptomInput,
    recentlyViewed, reminders, addReminder, removeReminder, healthProfile,
  } = useApp();
  const { schedules, cabinetItems } = useMedication();
  const t = getTranslations(language);
  const isZh = language === "zh";

  const [searchDraft, setSearchDraft] = useState("");
  const [showAddReminder, setShowAddReminder] = useState(false);

  useEffect(() => { document.title = t.appName; }, [t.appName]);

  const greeting = getGreeting(isZh);
  const currentMonth = new Date().getMonth() + 1;
  const seasonCard = SEASONAL.find((s) => s.months.includes(currentMonth)) ?? SEASONAL[0];

  const warnings = useMemo(
    () => getWarnings(healthProfile.currentMeds ?? [], isZh),
    [healthProfile.currentMeds, isZh],
  );

  const handleSearch = () => {
    const q = searchDraft.trim();
    if (!q) return;
    setSearchQuery(q);
    navigate("/drugs");
  };

  return (
    <motion.div
      className="space-y-4 px-4 py-4 pb-10"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            {isZh ? "小药房" : "MedLens"}
          </p>
          <h1 className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {greeting}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/safety")}
          className="flex items-center gap-1.5 rounded-2xl bg-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/30 active:scale-95"
        >
          <AlertTriangle size={13} strokeWidth={2.5} />
          {isZh ? "急救" : "SOS"}
        </button>
      </motion.div>

      {/* ── Search ── */}
      <motion.div variants={fadeUp}>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder={isZh ? "搜索西药、中药名…" : "Search medicines, herbs…"}
              className="w-full rounded-2xl border border-slate-200/80 bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-900 shadow-soft placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-white/8 dark:bg-[#1c1c1e] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
          {searchDraft.trim().length > 0 && (
            <motion.button
              type="button"
              onClick={handleSearch}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl bg-blue-600 px-4 py-3.5 text-[13px] font-bold text-white shadow-md shadow-blue-600/30 active:scale-95 dark:bg-[#0a84ff]"
            >
              {isZh ? "搜索" : "Go"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      {(schedules.length > 0 || cabinetItems.length > 0) && (
        <motion.div variants={fadeUp} className="flex gap-2">
          {schedules.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/calendar")}
              className="flex flex-1 items-center gap-2.5 rounded-2xl bg-blue-50 px-3.5 py-3 active:scale-[0.98] dark:bg-blue-950/30"
            >
              <Calendar size={18} className="text-blue-500 dark:text-blue-400" />
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">{isZh ? "用药计划" : "Schedules"}</p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{schedules.length} {isZh ? "项进行中" : "active"}</p>
              </div>
            </button>
          )}
          {cabinetItems.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/cabinet")}
              className="flex flex-1 items-center gap-2.5 rounded-2xl bg-emerald-50 px-3.5 py-3 active:scale-[0.98] dark:bg-emerald-950/30"
            >
              <Archive size={18} className="text-emerald-600 dark:text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{isZh ? "药箱库存" : "Cabinet"}</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{cabinetItems.length} {isZh ? "种药品" : "items"}</p>
              </div>
            </button>
          )}
        </motion.div>
      )}

      {/* ── Interaction Warning ── */}
      {warnings.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 dark:border-amber-700/40 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                {isZh ? "中西药相互作用提示" : "Drug–Herb Interaction Alert"}
              </p>
              {warnings.map((w, i) => (
                <p key={i} className="mt-0.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  <span className="font-semibold">{w.drug}</span> + {w.herbs.join("/")} — {w.label}
                </p>
              ))}
              <button type="button" onClick={() => navigate("/profile")} className="mt-1.5 text-[11px] font-semibold text-amber-700 underline underline-offset-2 dark:text-amber-400">
                {isZh ? "管理用药记录 →" : "Manage medications →"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions 2×2 ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
        {[
          {
            label: isZh ? "西药查询" : "Medicines",
            sub: isZh ? "药品信息、用法用量" : "Dosage & interactions",
            Icon: Pill, gradient: "from-blue-500 to-blue-700",
            shadow: "shadow-blue-600/25", action: () => navigate("/drugs"),
          },
          {
            label: isZh ? "中药库" : "TCM Herbs",
            sub: isZh ? "本草、方剂、交互" : "Herbs, formulas",
            Icon: Leaf, gradient: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-600/25", action: () => navigate("/drugs", { state: { mode: "tcm" } }),
          },
          {
            label: isZh ? "症状分析" : "Symptom Check",
            sub: isZh ? "AI 智能建议" : "AI-powered advice",
            Icon: Activity, gradient: "from-violet-500 to-purple-700",
            shadow: "shadow-violet-600/25", action: () => { setSymptomInput(""); navigate("/symptoms"); },
          },
          {
            label: isZh ? "识别药片" : "Pill Identifier",
            sub: isZh ? "外观印字识别" : "ID by imprint/shape",
            Icon: ScanLine, gradient: "from-amber-400 to-orange-500",
            shadow: "shadow-amber-500/25", action: () => navigate("/identifier"),
          },
        ].map(({ label, sub, Icon, gradient, shadow, action }) => (
          <motion.button
            key={label}
            type="button"
            onClick={action}
            whileTap={{ scale: 0.96 }}
            className={`rounded-2xl bg-gradient-to-br ${gradient} px-4 py-4 text-left text-white shadow-lg ${shadow}`}
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Icon size={19} strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-bold leading-tight">{label}</p>
            <p className="mt-0.5 text-[11px] text-white/70">{sub}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Seasonal TCM Card ── */}
      <motion.div
        variants={fadeUp}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${seasonCard.gradient} px-4 py-4 text-white shadow-medium`}
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -right-2 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
              {isZh ? "时令养生" : "Seasonal Wellness"}
            </p>
            <h3 className="mt-1 text-[15px] font-bold">{isZh ? seasonCard.zhTitle : seasonCard.enTitle}</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/80">
              {isZh ? seasonCard.zhTip : seasonCard.enTip}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
            {seasonCard.badge}
          </span>
        </div>
        <div className="relative mt-3 flex gap-1.5">
          {seasonCard.herbs.map((herb) => (
            <button
              key={herb}
              type="button"
              onClick={() => navigate("/drugs", { state: { mode: "tcm", query: herb } })}
              className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm hover:bg-white/25 active:bg-white/30 transition-colors"
            >
              {herb}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Reminders ── */}
      {reminders.length > 0 ? (
        <motion.div variants={fadeUp} className="rounded-2xl bg-white shadow-soft dark:bg-[#1c1c1e]">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-slate-400 dark:text-slate-500" />
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                {isZh ? "用药提醒" : "Reminders"}
              </p>
            </div>
            <button type="button" onClick={() => setShowAddReminder(true)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <BellPlus size={13} /> {isZh ? "添加" : "Add"}
            </button>
          </div>
          <div className="mt-2 divide-y divide-slate-100/80 dark:divide-white/5">
            {reminders.slice().sort((a, b) => a.time.localeCompare(b.time)).slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                  <p className="text-xs font-bold tabular-nums text-blue-700 dark:text-blue-300">{formatTime(r.time)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">{r.drugName}</p>
                  {r.dosage && <p className="text-[11px] text-slate-400 dark:text-slate-500">{r.dosage}</p>}
                </div>
                <button type="button" onClick={() => removeReminder(r.id)} className="flex-shrink-0 rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-400 active:scale-90 transition-all dark:text-slate-600">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 pt-2">
            <button type="button" onClick={() => navigate("/calendar")} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-[12px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors dark:bg-white/5 dark:text-slate-400">
              {isZh ? "查看用药日历" : "View medication calendar"}
              <ChevronRight size={13} />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          variants={fadeUp}
          type="button"
          onClick={() => setShowAddReminder(true)}
          className="flex w-full items-center gap-3.5 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/30 active:scale-[0.99] dark:border-white/10 dark:bg-[#1c1c1e]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
            <BellPlus size={18} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-white">{isZh ? "添加用药提醒" : "Set medication reminder"}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{isZh ? "定时提醒，不漏服" : "Never miss a dose"}</p>
          </div>
          <ChevronRight size={15} className="ml-auto text-slate-300 dark:text-slate-600" />
        </motion.button>
      )}

      {/* ── Western Categories ── */}
      <motion.div variants={fadeUp}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
            {isZh ? "西药分类" : "Western Medicines"}
          </p>
          <button type="button" onClick={() => navigate("/drugs")} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            {isZh ? "全部 →" : "Browse →"}
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {WESTERN_CATS.map(({ cat, Icon, shortZh, shortEn, color, bg }) => (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveCategory(cat); navigate("/drugs"); }}
              className="flex shrink-0 flex-col items-center rounded-2xl bg-white p-3 shadow-soft active:scale-95 dark:bg-[#1c1c1e]"
              style={{ minWidth: "72px" }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-700 dark:text-white">{isZh ? shortZh : shortEn}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── TCM Categories ── */}
      <motion.div variants={fadeUp}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Leaf size={12} className="text-emerald-500" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
              {isZh ? "中药分类" : "TCM Herb Categories"}
            </p>
          </div>
          <button type="button" onClick={() => navigate("/drugs", { state: { mode: "tcm" } })} className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {isZh ? "中药库 →" : "Herbs →"}
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {TCM_QUICK_CATS.map(({ cat, emoji }) => (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/drugs", { state: { mode: "tcm", category: cat } })}
              className="flex shrink-0 flex-col items-center rounded-2xl bg-emerald-50 p-3 active:scale-95 dark:bg-emerald-950/20"
              style={{ minWidth: "72px" }}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                {isZh ? cat : TCM_CATEGORY_EN[cat]}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              {isZh ? "最近查看" : "Recently Viewed"}
            </p>
            <button type="button" onClick={() => navigate("/drugs")} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {isZh ? "药品库 →" : "All →"}
            </button>
          </div>
          <div className="space-y-2.5">
            {recentlyViewed.slice(0, 3).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Disclaimer ── */}
      <motion.p variants={fadeUp} className="text-center text-[10px] leading-relaxed text-slate-300 dark:text-slate-600">
        {isZh
          ? "本应用仅供参考，不构成医疗建议。用药前请咨询医生或药师。"
          : "For informational purposes only. Consult a healthcare provider before use."}
      </motion.p>

      {showAddReminder && (
        <AddReminderSheet onClose={() => setShowAddReminder(false)} onAdd={addReminder} t={t} />
      )}
    </motion.div>
  );
}
