import type { DoseLog, DoseStatus, MedicationSchedule } from "../../types";

const STATUS_STYLE: Record<DoseStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40",
  taken: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40",
  missed: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40",
  skipped: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#2c2c2e] dark:text-[#c7c7cc] dark:border-[#3a3a3c]",
};

const STATUS_ZH: Record<DoseStatus, string> = {
  upcoming: "待服用",
  taken: "已服用",
  missed: "已错过",
  skipped: "已跳过",
};

const STATUS_EN: Record<DoseStatus, string> = {
  upcoming: "Upcoming",
  taken: "Taken",
  missed: "Missed",
  skipped: "Skipped",
};

interface DoseCardProps {
  date: string;
  time: string;
  schedule: MedicationSchedule;
  log?: DoseLog;
  status: DoseStatus;
  language: string;
  onStatusChange: (status: DoseStatus) => void;
}

export function DoseCard({ time, schedule, status, language, onStatusChange }: DoseCardProps) {
  const isZh = language === "zh";
  const statusLabel = isZh ? STATUS_ZH[status] : STATUS_EN[status];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 dark:text-[#636366]">{time}</p>
          <h3 className="mt-0.5 truncate text-sm font-bold text-slate-950 dark:text-white">{schedule.medicationName}</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8e8e93]">{schedule.dosage}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[status]}`}>
          {statusLabel}
        </span>
      </div>

      {schedule.notes && (
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
          {schedule.notes}
        </p>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["taken", "skipped", "missed"] as DoseStatus[]).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => onStatusChange(next)}
            className={`rounded-xl px-2 py-2 text-xs font-semibold transition active:scale-95 ${
              status === next
                ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]"
            }`}
          >
            {isZh ? STATUS_ZH[next] : STATUS_EN[next]}
          </button>
        ))}
      </div>
    </div>
  );
}
