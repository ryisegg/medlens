import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search, Pill, Activity, ScanLine, Leaf, Home, HeartPulse,
  Bell, BellPlus, ChevronRight, AlertTriangle,
  Calendar, Archive,
  Thermometer, Wind, Snowflake, Sun, Flame,
  X, User, Sparkles, ShieldAlert,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useMedication } from "../context/MedicationContext";
import { getTranslations } from "../i18n";
import { DrugCard } from "../components/shared/DrugCard";
import { TCMHerbCard } from "../components/tcm/TCMHerbCard";
import {
  TCM_CATEGORY_EN, TCM_CATEGORIES, TCM_HERBS, getTCMHerbById,
} from "../data/tcmHerbs";
import { getDrugsByCategory, getDrugById } from "../data/catalog";
import type { DrugCategory } from "../types";
import type { TCMCategory } from "../types/tcm";

// ── Animation presets ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

// ── Constants ────────────────────────────────────────────────────────────────

const HOME_TABS = [
  { key: "home"    as const, labelZh: "首页", labelEn: "Home",      Icon: Home       },
  { key: "western" as const, labelZh: "西药", labelEn: "Medicines", Icon: Pill       },
  { key: "tcm"     as const, labelZh: "中药", labelEn: "TCM",       Icon: Leaf       },
  { key: "health"  as const, labelZh: "健康", labelEn: "Health",    Icon: HeartPulse },
];

type HomeTabKey = typeof HOME_TABS[number]["key"];

const WESTERN_CATS: {
  cat: DrugCategory;
  Icon: React.FC<{ size?: number; className?: string }>;
  shortZh: string;
  shortEn: string;
  color: string;
  bg: string;
}[] = [
  { cat: "Pain Relief",        Icon: Thermometer, shortZh: "止痛",   shortEn: "Pain Relief", color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-950/30"   },
  { cat: "Allergy",            Icon: Wind,        shortZh: "过敏",   shortEn: "Allergy",     color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30"},
  { cat: "Cold & Flu",         Icon: Snowflake,   shortZh: "感冒",   shortEn: "Cold & Flu",  color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30"   },
  { cat: "Digestive Health",   Icon: Flame,       shortZh: "肠胃",   shortEn: "Digestive",   color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30"},
  { cat: "Skin",               Icon: Sparkles,    shortZh: "皮肤",   shortEn: "Skin",        color: "text-emerald-600",bg: "bg-emerald-50 dark:bg-emerald-950/30"},
  { cat: "Sleep",              Icon: Sun,         shortZh: "睡眠",   shortEn: "Sleep",       color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30"},
  { cat: "Vitamins",           Icon: Leaf,        shortZh: "营养",   shortEn: "Vitamins",    color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950/30" },
  { cat: "Chronic Conditions", Icon: Activity,    shortZh: "慢病",   shortEn: "Chronic",     color: "text-slate-600",  bg: "bg-slate-100 dark:bg-slate-800/40"},
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

const POPULAR_TCM_IDS = ["ren-shen", "huang-qi", "dang-gui", "gan-cao", "jin-yin-hua", "ju-hua"];

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

function loadTab(): HomeTabKey {
  try {
    const v = sessionStorage.getItem("medlens_home_tab");
    if (v && HOME_TABS.some((t) => t.key === v)) return v as HomeTabKey;
  } catch { /* ignore */ }
  return "home";
}
function saveTab(t: HomeTabKey) {
  try { sessionStorage.setItem("medlens_home_tab", t); } catch { /* ignore */ }
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
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-[#2c2c2e]";

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

// ────────────────────────────────────────────────────────────────────────────
// Section header used inside tabs
// ────────────────────────────────────────────────────────────────────────────
function SectionLabel({
  children, action,
}: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {children}
      </p>
      {action}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HOME tab
// ────────────────────────────────────────────────────────────────────────────
function HomeTab({
  isZh, navigate, setSearchQuery, setSymptomInput, healthProfile, recentlyViewed,
}: {
  isZh: boolean;
  navigate: ReturnType<typeof useNavigate>;
  setSearchQuery: (q: string) => void;
  setSymptomInput: (s: string) => void;
  healthProfile: { currentMeds: string[] };
  recentlyViewed: ReturnType<typeof useApp>["recentlyViewed"];
}) {
  const [searchDraft, setSearchDraft] = useState("");

  const currentMonth = new Date().getMonth() + 1;
  const seasonCard = SEASONAL.find((s) => s.months.includes(currentMonth)) ?? SEASONAL[0];
  const warnings = useMemo(() => getWarnings(healthProfile.currentMeds ?? [], isZh), [healthProfile.currentMeds, isZh]);

  const handleSearch = () => {
    const q = searchDraft.trim();
    if (!q) return;
    setSearchQuery(q);
    navigate("/drugs");
  };

  return (
    <motion.div className="space-y-4" variants={stagger} initial="hidden" animate="show">
      {/* Search */}
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
              className="rounded-2xl bg-blue-600 px-4 py-3.5 text-[13px] font-bold text-white shadow-md shadow-blue-600/30 active:scale-95 dark:bg-[#0a84ff]"
            >
              {isZh ? "搜索" : "Go"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Interaction Warning */}
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

      {/* Quick Actions 2×2 */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
        {[
          { label: isZh ? "西药查询" : "Medicines",    sub: isZh ? "药品信息、用法用量" : "Dosage & interactions", Icon: Pill,     gradient: "from-blue-500 to-blue-700",     shadow: "shadow-blue-600/25",   action: () => navigate("/drugs") },
          { label: isZh ? "中药库"   : "TCM Herbs",    sub: isZh ? "本草、方剂、交互"     : "Herbs, formulas",        Icon: Leaf,     gradient: "from-emerald-500 to-teal-600",  shadow: "shadow-emerald-600/25",action: () => navigate("/drugs", { state: { mode: "tcm" } }) },
          { label: isZh ? "症状分析" : "Symptom Check", sub: isZh ? "AI 智能建议"          : "AI-powered advice",      Icon: Activity, gradient: "from-violet-500 to-purple-700", shadow: "shadow-violet-600/25", action: () => { setSymptomInput(""); navigate("/symptoms"); } },
          { label: isZh ? "识别药片" : "Pill Identifier",sub: isZh ? "外观印字识别"        : "ID by imprint/shape",    Icon: ScanLine, gradient: "from-amber-400 to-orange-500",  shadow: "shadow-amber-500/25",  action: () => navigate("/identifier") },
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

      {/* Seasonal Card */}
      <motion.div variants={fadeUp} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${seasonCard.gradient} px-4 py-4 text-white shadow-medium`}>
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

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionLabel action={
            <button type="button" onClick={() => navigate("/drugs")} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {isZh ? "全部 →" : "All →"}
            </button>
          }>
            {isZh ? "最近查看" : "Recently Viewed"}
          </SectionLabel>
          <div className="space-y-2.5">
            {recentlyViewed.slice(0, 3).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </motion.div>
      )}

      <p className="text-center text-[10px] leading-relaxed text-slate-300 dark:text-slate-600 pt-1">
        {isZh
          ? "本应用仅供参考，不构成医疗建议。用药前请咨询医生或药师。"
          : "For informational purposes only. Consult a healthcare provider before use."}
      </p>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// WESTERN tab
// ────────────────────────────────────────────────────────────────────────────
function WesternTab({
  isZh, navigate, setActiveCategory, setOtcRxFilter,
}: {
  isZh: boolean;
  navigate: ReturnType<typeof useNavigate>;
  setActiveCategory: (c: DrugCategory | "All") => void;
  setOtcRxFilter: (f: "all" | "OTC" | "Rx") => void;
}) {
  // Drug count per category (memoize)
  const counts = useMemo(() => {
    const m = new Map<DrugCategory, number>();
    for (const { cat } of WESTERN_CATS) m.set(cat, getDrugsByCategory(cat).length);
    return m;
  }, []);

  // Top popular: take 3 herbs by category recency — using common ids
  const popularIds = ["ibuprofen", "acetaminophen", "loratadine", "metformin", "lisinopril", "omeprazole"];
  const popularDrugs = popularIds.map(getDrugById).filter(Boolean) as NonNullable<ReturnType<typeof getDrugById>>[];

  return (
    <motion.div className="space-y-4" variants={stagger} initial="hidden" animate="show">
      {/* Browse hero */}
      <motion.button
        variants={fadeUp}
        type="button"
        onClick={() => navigate("/drugs")}
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 px-5 py-5 text-left text-white shadow-medium active:scale-[0.99]"
      >
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
              {isZh ? "西药数据库" : "Medication Library"}
            </p>
            <h3 className="mt-1 text-lg font-bold">
              {isZh ? "浏览全部药品" : "Browse all medicines"}
            </h3>
            <p className="mt-1 text-xs text-white/75">
              {isZh ? "实时 RxNorm/FDA 接入，AI 智能建议" : "Real-time RxNorm/FDA + AI suggestions"}
            </p>
          </div>
          <ChevronRight size={24} className="text-white/80" />
        </div>
      </motion.button>

      {/* OTC / Rx quick filter */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => { setOtcRxFilter("OTC"); navigate("/drugs"); }}
          className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 px-4 py-3 text-left active:scale-[0.98] dark:bg-emerald-950/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <Pill size={18} className="text-emerald-700 dark:text-emerald-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">OTC</p>
            <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-300">{isZh ? "非处方药" : "Over-the-counter"}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => { setOtcRxFilter("Rx"); navigate("/drugs"); }}
          className="flex items-center gap-2.5 rounded-2xl bg-amber-50 px-4 py-3 text-left active:scale-[0.98] dark:bg-amber-950/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <ShieldAlert size={18} className="text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Rx</p>
            <p className="text-[13px] font-bold text-amber-700 dark:text-amber-300">{isZh ? "处方药" : "Prescription"}</p>
          </div>
        </button>
      </motion.div>

      {/* Category grid 4×2 */}
      <motion.div variants={fadeUp}>
        <SectionLabel>{isZh ? "药品分类" : "Categories"}</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {WESTERN_CATS.map(({ cat, Icon, shortZh, shortEn, color, bg }) => (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveCategory(cat); navigate("/drugs"); }}
              className="flex flex-col items-center rounded-2xl bg-white p-3 shadow-soft dark:bg-[#1c1c1e]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-slate-700 dark:text-white text-center leading-tight">
                {isZh ? shortZh : shortEn}
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">{counts.get(cat) ?? 0}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Popular drugs */}
      {popularDrugs.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionLabel action={
            <button type="button" onClick={() => navigate("/drugs")} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {isZh ? "更多 →" : "More →"}
            </button>
          }>
            {isZh ? "热门药品" : "Popular Medicines"}
          </SectionLabel>
          <div className="space-y-2.5">
            {popularDrugs.slice(0, 4).map((drug) => (
              <DrugCard key={drug.id} drug={drug} onClick={() => navigate(`/drugs/${drug.id}`)} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TCM tab
// ────────────────────────────────────────────────────────────────────────────
function TCMTab({
  isZh, navigate,
}: {
  isZh: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const currentMonth = new Date().getMonth() + 1;
  const season = SEASONAL.find((s) => s.months.includes(currentMonth)) ?? SEASONAL[0];

  // Seasonal herbs lookup
  const seasonalHerbs = season.herbs
    .map((zh) => TCM_HERBS.find((h) => h.nameZh === zh))
    .filter(Boolean) as typeof TCM_HERBS;

  const popularHerbs = POPULAR_TCM_IDS
    .map(getTCMHerbById)
    .filter(Boolean) as NonNullable<ReturnType<typeof getTCMHerbById>>[];

  return (
    <motion.div className="space-y-4" variants={stagger} initial="hidden" animate="show">
      {/* TCM library hero */}
      <motion.button
        variants={fadeUp}
        type="button"
        onClick={() => navigate("/drugs", { state: { mode: "tcm" } })}
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-5 py-5 text-left text-white shadow-medium active:scale-[0.99]"
      >
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
              {isZh ? "中药数据库" : "TCM Herb Library"}
            </p>
            <h3 className="mt-1 text-lg font-bold">
              {TCM_HERBS.length} {isZh ? "味本草" : "herbs · 19 categories"}
            </h3>
            <p className="mt-1 text-xs text-white/75">
              {isZh ? "性味归经、功效主治、中西药相互作用" : "Properties, functions, drug interactions"}
            </p>
          </div>
          <ChevronRight size={24} className="text-white/80" />
        </div>
      </motion.button>

      {/* Seasonal recommendations */}
      <motion.div variants={fadeUp} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${season.gradient} px-4 py-4 text-white shadow-soft`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
          {isZh ? "时令推荐" : "Seasonal Recommendations"}
        </p>
        <p className="mt-0.5 text-[13px] font-bold">{isZh ? season.zhTitle : season.enTitle}</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/80">{isZh ? season.zhTip : season.enTip}</p>
      </motion.div>

      {/* Seasonal herb cards */}
      {seasonalHerbs.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-2.5">
          {seasonalHerbs.map((herb) => (
            <TCMHerbCard key={herb.id} herb={herb} language={isZh ? "zh" : "en"} onClick={() => navigate(`/tcm/${herb.id}`)} />
          ))}
        </motion.div>
      )}

      {/* TCM category scroll */}
      <motion.div variants={fadeUp}>
        <SectionLabel action={
          <button type="button" onClick={() => navigate("/drugs", { state: { mode: "tcm" } })} className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {isZh ? `${TCM_CATEGORIES.length} 类 →` : `${TCM_CATEGORIES.length} categories →`}
          </button>
        }>
          {isZh ? "中药分类" : "TCM Categories"}
        </SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {TCM_QUICK_CATS.map(({ cat, emoji }) => (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/drugs", { state: { mode: "tcm", category: cat } })}
              className="flex flex-col items-center rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/20"
            >
              <span className="text-xl leading-none">{emoji}</span>
              <p className="mt-1.5 text-center text-[10px] font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                {isZh ? cat : TCM_CATEGORY_EN[cat]}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Popular herbs */}
      <motion.div variants={fadeUp}>
        <SectionLabel action={
          <button type="button" onClick={() => navigate("/drugs", { state: { mode: "tcm" } })} className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {isZh ? "更多 →" : "More →"}
          </button>
        }>
          {isZh ? "热门药材" : "Popular Herbs"}
        </SectionLabel>
        <div className="space-y-2.5">
          {popularHerbs.map((herb) => (
            <TCMHerbCard key={herb.id} herb={herb} language={isZh ? "zh" : "en"} onClick={() => navigate(`/tcm/${herb.id}`)} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HEALTH tab
// ────────────────────────────────────────────────────────────────────────────
function HealthTab({
  isZh, navigate, reminders, removeReminder, setShowAddReminder, schedules, cabinetItems, healthProfile,
}: {
  isZh: boolean;
  navigate: ReturnType<typeof useNavigate>;
  reminders: ReturnType<typeof useApp>["reminders"];
  removeReminder: ReturnType<typeof useApp>["removeReminder"];
  setShowAddReminder: (v: boolean) => void;
  schedules: ReturnType<typeof useMedication>["schedules"];
  cabinetItems: ReturnType<typeof useMedication>["cabinetItems"];
  healthProfile: ReturnType<typeof useApp>["healthProfile"];
}) {
  const profileItemCount = (healthProfile.allergies?.length ?? 0)
    + (healthProfile.conditions?.length ?? 0)
    + (healthProfile.currentMeds?.length ?? 0);

  return (
    <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
      {/* Stats row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => navigate("/calendar")}
          className="flex flex-col items-start gap-1.5 rounded-2xl bg-blue-50 p-3 text-left active:scale-[0.98] dark:bg-blue-950/30"
        >
          <Calendar size={18} className="text-blue-500 dark:text-blue-400" />
          <p className="text-lg font-black tabular-nums text-blue-700 dark:text-blue-300 leading-none">{schedules.length}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{isZh ? "用药计划" : "Schedules"}</p>
        </button>
        <button
          type="button"
          onClick={() => navigate("/cabinet")}
          className="flex flex-col items-start gap-1.5 rounded-2xl bg-emerald-50 p-3 text-left active:scale-[0.98] dark:bg-emerald-950/30"
        >
          <Archive size={18} className="text-emerald-600 dark:text-emerald-400" />
          <p className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-300 leading-none">{cabinetItems.length}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{isZh ? "药箱库存" : "Cabinet"}</p>
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex flex-col items-start gap-1.5 rounded-2xl bg-violet-50 p-3 text-left active:scale-[0.98] dark:bg-violet-950/30"
        >
          <HeartPulse size={18} className="text-violet-600 dark:text-violet-400" />
          <p className="text-lg font-black tabular-nums text-violet-700 dark:text-violet-300 leading-none">{profileItemCount}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">{isZh ? "健康档案" : "Health"}</p>
        </button>
      </motion.div>

      {/* Reminders */}
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
        {reminders.length === 0 ? (
          <div className="px-4 pb-4 pt-2">
            <button
              type="button"
              onClick={() => setShowAddReminder(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-3 active:scale-[0.99] dark:border-white/10"
            >
              <BellPlus size={16} className="text-blue-500 dark:text-blue-400" />
              <p className="text-[12px] text-slate-500 dark:text-slate-400">{isZh ? "添加用药提醒，不漏服" : "Set a reminder — never miss a dose"}</p>
            </button>
          </div>
        ) : (
          <>
            <div className="mt-2 divide-y divide-slate-100/80 dark:divide-white/5">
              {reminders.slice().sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5).map((r) => (
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
          </>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white shadow-soft dark:bg-[#1c1c1e]">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30">
            <User size={18} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{isZh ? "健康档案" : "Health Profile"}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{isZh ? "过敏史、慢性病、当前用药" : "Allergies, conditions, medications"}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
        </button>
        <div className="h-px bg-slate-100 dark:bg-white/5" />
        <button
          type="button"
          onClick={() => navigate("/safety")}
          className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30">
            <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{isZh ? "急救信息" : "Emergency Info"}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{isZh ? "急救电话、过量识别、求助" : "Emergency contacts, overdose signs"}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main HomePage
// ────────────────────────────────────────────────────────────────────────────
export function HomePage() {
  const navigate = useNavigate();
  const {
    language, setSearchQuery, setActiveCategory, setOtcRxFilter, setSymptomInput,
    recentlyViewed, reminders, addReminder, removeReminder,
    healthProfile,
  } = useApp();
  const { schedules, cabinetItems } = useMedication();
  const t = getTranslations(language);
  const isZh = language === "zh";

  const [activeTab, setActiveTab] = useState<HomeTabKey>(() => loadTab());
  const [showAddReminder, setShowAddReminder] = useState(false);

  useEffect(() => { document.title = t.appName; }, [t.appName]);
  useEffect(() => { saveTab(activeTab); }, [activeTab]);

  const greeting = getGreeting(isZh);

  return (
    <div className="pb-8">
      {/* ── Header (greeting + SOS) ── */}
      <motion.div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
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

      {/* ── Sticky tab strip ── */}
      <div
        className="sticky top-12 z-30 bg-white/90 backdrop-blur-xl px-4 pt-2 pb-2.5 dark:bg-[#0a0a0a]/90"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
      >
        <div className="flex gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-white/6">
          {HOME_TABS.map(({ key, labelZh, labelEn, Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="relative flex-1 rounded-xl py-2 text-[12px] font-semibold transition-colors duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="home-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-[#1c1c1e]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center justify-center gap-1.5 ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-500"
                }`}>
                  <Icon size={13} strokeWidth={isActive ? 2.4 : 1.8} />
                  {isZh ? labelZh : labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {activeTab === "home" && (
              <HomeTab
                isZh={isZh}
                navigate={navigate}
                setSearchQuery={setSearchQuery}
                setSymptomInput={setSymptomInput}
                healthProfile={healthProfile}
                recentlyViewed={recentlyViewed}
              />
            )}
            {activeTab === "western" && (
              <WesternTab
                isZh={isZh}
                navigate={navigate}
                setActiveCategory={setActiveCategory}
                setOtcRxFilter={setOtcRxFilter}
              />
            )}
            {activeTab === "tcm" && (
              <TCMTab isZh={isZh} navigate={navigate} />
            )}
            {activeTab === "health" && (
              <HealthTab
                isZh={isZh}
                navigate={navigate}
                reminders={reminders}
                removeReminder={removeReminder}
                setShowAddReminder={setShowAddReminder}
                schedules={schedules}
                cabinetItems={cabinetItems}
                healthProfile={healthProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reminder modal */}
      <AnimatePresence>
        {showAddReminder && (
          <AddReminderSheet onClose={() => setShowAddReminder(false)} onAdd={addReminder} t={t} />
        )}
      </AnimatePresence>
    </div>
  );
}
