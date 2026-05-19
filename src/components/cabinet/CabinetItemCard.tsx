import type { CabinetItem, MedicationSchedule } from "../../types";
import { ExpirationWarningBadge } from "./ExpirationWarningBadge";
import { LowStockBadge } from "./LowStockBadge";

interface Props {
  item: CabinetItem;
  language: string;
  schedules: MedicationSchedule[];
  onEdit: (item: CabinetItem) => void;
  onDelete: (id: string) => void;
  onCreateSchedule: (item: CabinetItem) => void;
}

export function CabinetItemCard({ item, language, schedules, onEdit, onDelete, onCreateSchedule }: Props) {
  const isZh = language === "zh";
  const linked = schedules.some((schedule) => schedule.linkedCabinetItemId === item.id);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-950 dark:text-white">{item.medicationName}</h3>
          {(item.genericName || item.strength) && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
              {[item.genericName, item.strength].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${item.type === "OTC" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}>
          {item.type === "OTC" ? (isZh ? "非处方" : "OTC") : (isZh ? "处方" : "Rx")}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ExpirationWarningBadge expirationDate={item.expirationDate} language={language} />
        <LowStockBadge quantity={item.quantity} language={language} />
        {linked && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {isZh ? "已关联日程" : "Linked"}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-[#8e8e93]">
        <p><span className="font-semibold text-slate-700 dark:text-[#c7c7cc]">{isZh ? "数量" : "Quantity"}:</span> {item.quantity}</p>
        {item.dosageForm && <p><span className="font-semibold text-slate-700 dark:text-[#c7c7cc]">{isZh ? "剂型" : "Form"}:</span> {item.dosageForm}</p>}
        {item.expirationDate && <p><span className="font-semibold text-slate-700 dark:text-[#c7c7cc]">{isZh ? "过期" : "Expires"}:</span> {item.expirationDate}</p>}
        {item.storageLocation && <p><span className="font-semibold text-slate-700 dark:text-[#c7c7cc]">{isZh ? "位置" : "Location"}:</span> {item.storageLocation}</p>}
      </div>

      {item.notes && (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">{item.notes}</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onCreateSchedule(item)} className="rounded-xl bg-blue-50 px-2 py-2 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {isZh ? "加日程" : "Schedule"}
        </button>
        <button type="button" onClick={() => onEdit(item)} className="rounded-xl bg-slate-100 px-2 py-2 text-xs font-bold text-slate-600 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]">
          {isZh ? "编辑" : "Edit"}
        </button>
        <button type="button" onClick={() => onDelete(item.id)} className="rounded-xl bg-red-50 px-2 py-2 text-xs font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {isZh ? "删除" : "Delete"}
        </button>
      </div>
    </div>
  );
}
