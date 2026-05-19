import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CabinetItem, MedicationSchedule } from "../../types";
import { useApp } from "../../context/AppContext";
import { CabinetItemCard } from "./CabinetItemCard";
import { getExpirationState } from "./ExpirationWarningBadge";

const CABINET_KEY = "medlens_cabinet";
const SCHEDULE_KEY = "medlens_schedules";

type Filter = "all" | "low" | "expired" | "soon";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_ITEM: CabinetItem = {
  id: "",
  medicationName: "",
  genericName: "",
  strength: "",
  quantity: 0,
  dosageForm: "",
  expirationDate: "",
  type: "OTC",
  storageLocation: "",
  notes: "",
};

export function MedicineCabinet() {
  const { language } = useApp();
  const isZh = language === "zh";
  const [items, setItems] = useState<CabinetItem[]>(() => loadJSON(CABINET_KEY, []));
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(() => loadJSON(SCHEDULE_KEY, []));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<CabinetItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => saveJSON(CABINET_KEY, items), [items]);
  useEffect(() => saveJSON(SCHEDULE_KEY, schedules), [schedules]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !q || [item.medicationName, item.genericName, item.strength, item.storageLocation]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(q));
      const expiration = getExpirationState(item.expirationDate);
      const matchesFilter =
        filter === "all" ||
        (filter === "low" && item.quantity <= 5) ||
        (filter === "expired" && expiration === "expired") ||
        (filter === "soon" && expiration === "soon");
      return matchesQuery && matchesFilter;
    });
  }, [filter, items, query]);

  function resetForm() {
    setEditing(null);
    setShowForm(false);
  }

  function saveItem(item: CabinetItem) {
    const normalized: CabinetItem = {
      ...item,
      medicationName: item.medicationName.trim(),
      genericName: item.genericName?.trim() || undefined,
      strength: item.strength?.trim() || undefined,
      dosageForm: item.dosageForm?.trim() || undefined,
      expirationDate: item.expirationDate || undefined,
      storageLocation: item.storageLocation?.trim() || undefined,
      notes: item.notes?.trim() || undefined,
    };
    if (!normalized.medicationName) return;

    setItems((prev) => {
      if (normalized.id) return prev.map((existing) => existing.id === normalized.id ? normalized : existing);
      return [{ ...normalized, id: crypto.randomUUID() }, ...prev];
    });
    resetForm();
  }

  function createSchedule(item: CabinetItem) {
    const schedule: MedicationSchedule = {
      id: crypto.randomUUID(),
      medicationName: item.medicationName,
      dosage: item.strength || "",
      frequency: "once-daily",
      times: ["08:00"],
      startDate: todayIso(),
      notes: item.storageLocation ? `${isZh ? "位置" : "Location"}: ${item.storageLocation}` : undefined,
      linkedCabinetItemId: item.id,
    };
    setSchedules((prev) => [schedule, ...prev]);
  }

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#0a84ff]">
          {isZh ? "我的药箱" : "My Medicine Cabinet"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          {isZh ? "记录家里现有药品" : "Track what you have at home"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#8e8e93]">
          {isZh ? "库存和过期提醒仅供参考，用药前仍需核对标签并咨询专业人员。" : "Inventory and expiration alerts are informational. Always verify labels and ask a professional when unsure."}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isZh ? "搜索药名、成分、位置" : "Search name, generic, location"}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white"
        />
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {([
            ["all", isZh ? "全部" : "All"],
            ["low", isZh ? "库存不足" : "Low Stock"],
            ["soon", isZh ? "即将过期" : "Expiring Soon"],
            ["expired", isZh ? "已过期" : "Expired"],
          ] as [Filter, string][]).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${filter === value ? "bg-slate-950 text-white dark:bg-white dark:text-black" : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={() => { setEditing(EMPTY_ITEM); setShowForm(true); }} className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white dark:bg-[#0a84ff]">
        {isZh ? "添加药品" : "Add medicine"}
      </button>

      {showForm && editing && (
        <CabinetForm language={language} item={editing} onCancel={resetForm} onSave={saveItem} />
      )}

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500 dark:border-[#3a3a3c] dark:bg-[#1c1c1e] dark:text-[#8e8e93]">
          {items.length === 0 ? (isZh ? "药箱还是空的，先添加一盒药。" : "Your cabinet is empty. Add your first medicine.") : (isZh ? "没有匹配的药品。" : "No matching medicines.")}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <CabinetItemCard
              key={item.id}
              item={item}
              language={language}
              schedules={schedules}
              onEdit={(target) => { setEditing(target); setShowForm(true); }}
              onDelete={(id) => setItems((prev) => prev.filter((existing) => existing.id !== id))}
              onCreateSchedule={createSchedule}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CabinetForm({ language, item, onSave, onCancel }: {
  language: string;
  item: CabinetItem;
  onSave: (item: CabinetItem) => void;
  onCancel: () => void;
}) {
  const isZh = language === "zh";
  const [draft, setDraft] = useState<CabinetItem>(item);
  const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white";
  const label = "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">{draft.id ? (isZh ? "编辑药品" : "Edit medicine") : (isZh ? "添加药品" : "Add medicine")}</h2>
      <div className="mt-4 grid gap-3">
        <Field label={isZh ? "药品名称" : "Medication name"} className={label}><input className={input} value={draft.medicationName} onChange={(e) => setDraft({ ...draft, medicationName: e.target.value })} /></Field>
        <Field label={isZh ? "通用名" : "Generic name"} className={label}><input className={input} value={draft.genericName ?? ""} onChange={(e) => setDraft({ ...draft, genericName: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={isZh ? "规格" : "Strength"} className={label}><input className={input} value={draft.strength ?? ""} onChange={(e) => setDraft({ ...draft, strength: e.target.value })} placeholder="200 mg" /></Field>
          <Field label={isZh ? "数量" : "Quantity"} className={label}><input className={input} type="number" min="0" value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={isZh ? "剂型" : "Dosage form"} className={label}><input className={input} value={draft.dosageForm ?? ""} onChange={(e) => setDraft({ ...draft, dosageForm: e.target.value })} placeholder={isZh ? "片剂" : "tablet"} /></Field>
          <Field label={isZh ? "类型" : "Type"} className={label}>
            <select className={input} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as CabinetItem["type"] })}>
              <option value="OTC">{isZh ? "非处方" : "OTC"}</option>
              <option value="Prescription">{isZh ? "处方" : "Prescription"}</option>
            </select>
          </Field>
        </div>
        <Field label={isZh ? "过期日期" : "Expiration date"} className={label}><input className={input} type="date" value={draft.expirationDate ?? ""} onChange={(e) => setDraft({ ...draft, expirationDate: e.target.value })} /></Field>
        <Field label={isZh ? "存放位置" : "Storage location"} className={label}><input className={input} value={draft.storageLocation ?? ""} onChange={(e) => setDraft({ ...draft, storageLocation: e.target.value })} placeholder={isZh ? "浴室柜、厨房抽屉" : "Bathroom cabinet, kitchen drawer"} /></Field>
        <Field label={isZh ? "备注" : "Notes"} className={label}><textarea className={input} rows={2} value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-[#3a3a3c] dark:text-[#c7c7cc]">{isZh ? "取消" : "Cancel"}</button>
        <button type="button" onClick={() => onSave(draft)} disabled={!draft.medicationName.trim()} className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]">{isZh ? "保存" : "Save"}</button>
      </div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <label>
      <span className={className}>{label}</span>
      {children}
    </label>
  );
}
