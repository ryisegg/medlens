import { useEffect, useMemo, useState } from "react";
import type { CabinetItem, DoseLog, DoseStatus, MedicationSchedule } from "../../types";
import { useApp } from "../../context/AppContext";
import { AddMedicationScheduleForm } from "./AddMedicationScheduleForm";
import { DoseCard } from "./DoseCard";

const SCHEDULE_KEY = "medlens_schedules";
const DOSE_LOG_KEY = "medlens_dose_logs";
const CABINET_KEY = "medlens_cabinet";

type ViewMode = "day" | "week" | "month";

type GeneratedDose = {
  schedule: MedicationSchedule;
  date: string;
  time: string;
  status: DoseStatus;
  log?: DoseLog;
};

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

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayIso() {
  return iso(new Date());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function startOfMonthGrid(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfWeek(first);
}

function scheduleApplies(schedule: MedicationSchedule, dateIso: string) {
  if (dateIso < schedule.startDate) return false;
  if (schedule.endDate && dateIso > schedule.endDate) return false;
  if (schedule.frequency.startsWith("specific-days:")) {
    const day = new Date(`${dateIso}T00:00:00`).getDay().toString();
    return schedule.frequency.replace("specific-days:", "").split(",").includes(day);
  }
  return true;
}

function statusFor(date: string, time: string, log?: DoseLog): DoseStatus {
  if (log) return log.status;
  const now = new Date();
  const doseAt = new Date(`${date}T${time}:00`);
  return doseAt.getTime() < now.getTime() ? "missed" : "upcoming";
}

function getDates(mode: ViewMode, selected: Date) {
  if (mode === "day") return [iso(selected)];
  if (mode === "week") return Array.from({ length: 7 }, (_, index) => iso(addDays(startOfWeek(selected), index)));
  const first = startOfMonthGrid(selected);
  return Array.from({ length: 42 }, (_, index) => iso(addDays(first, index)));
}

function formatHeader(date: Date, language: string) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function frequencyLabel(frequency: string, language: string) {
  const isZh = language === "zh";
  if (frequency === "once-daily") return isZh ? "每日一次" : "Once daily";
  if (frequency === "twice-daily") return isZh ? "每日两次" : "Twice daily";
  if (frequency === "three-times-daily") return isZh ? "每日三次" : "Three times daily";
  if (frequency.startsWith("every-")) return isZh ? frequency.replace("every-", "每 ").replace("-hours", " 小时") : frequency.replaceAll("-", " ");
  return isZh ? "指定星期" : "Specific days";
}

export function MedicationCalendar() {
  const { language } = useApp();
  const isZh = language === "zh";
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(() => loadJSON(SCHEDULE_KEY, []));
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => loadJSON(DOSE_LOG_KEY, []));
  const [cabinetItems] = useState<CabinetItem[]>(() => loadJSON(CABINET_KEY, []));
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => saveJSON(SCHEDULE_KEY, schedules), [schedules]);
  useEffect(() => saveJSON(DOSE_LOG_KEY, doseLogs), [doseLogs]);

  const selectedDateObj = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);
  const visibleDates = useMemo(() => getDates(viewMode, selectedDateObj), [viewMode, selectedDateObj]);

  const dosesByDate = useMemo(() => {
    const map = new Map<string, GeneratedDose[]>();
    visibleDates.forEach((date) => map.set(date, []));
    for (const date of visibleDates) {
      for (const schedule of schedules) {
        if (!scheduleApplies(schedule, date)) continue;
        for (const time of schedule.times) {
          const log = doseLogs.find((item) => item.scheduleId === schedule.id && item.date === date && item.time === time);
          map.get(date)?.push({ schedule, date, time, log, status: statusFor(date, time, log) });
        }
      }
      map.get(date)?.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [doseLogs, schedules, visibleDates]);

  const selectedDoses = dosesByDate.get(selectedDate) ?? [];

  function moveDate(delta: number) {
    const step = viewMode === "month" ? 30 : viewMode === "week" ? 7 : 1;
    setSelectedDate(iso(addDays(selectedDateObj, delta * step)));
  }

  function updateDoseStatus(dose: GeneratedDose, status: DoseStatus) {
    setDoseLogs((prev) => {
      const existing = prev.find((log) => log.scheduleId === dose.schedule.id && log.date === dose.date && log.time === dose.time);
      if (existing) {
        return prev.map((log) => log.id === existing.id ? { ...log, status } : log);
      }
      return [...prev, {
        id: crypto.randomUUID(),
        scheduleId: dose.schedule.id,
        date: dose.date,
        time: dose.time,
        status,
      }];
    });
  }

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#0a84ff]">
          {isZh ? "用药日历" : "Medication Calendar"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          {formatHeader(selectedDateObj, language)}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#8e8e93]">
          {isZh ? "用药提醒仅供记录与参考，不能替代医生或药剂师建议。" : "Medication reminders are informational and do not replace medical advice."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-[#1c1c1e]">
        {(["day", "week", "month"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`rounded-xl py-2 text-sm font-semibold ${viewMode === mode ? "bg-white text-slate-950 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 dark:text-[#8e8e93]"}`}
          >
            {mode === "day" && (isZh ? "日" : "Day")}
            {mode === "week" && (isZh ? "周" : "Week")}
            {mode === "month" && (isZh ? "月" : "Month")}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => moveDate(-1)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:bg-[#1c1c1e] dark:text-[#c7c7cc]">‹</button>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-white" />
        <button type="button" onClick={() => moveDate(1)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:bg-[#1c1c1e] dark:text-[#c7c7cc]">›</button>
      </div>

      <div className={viewMode === "day" ? "space-y-2" : "grid grid-cols-7 gap-1.5"}>
        {visibleDates.map((date) => {
          const doses = dosesByDate.get(date) ?? [];
          const isSelected = date === selectedDate;
          const isCurrentMonth = new Date(`${date}T00:00:00`).getMonth() === selectedDateObj.getMonth();
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`${viewMode === "day" ? "hidden" : "block"} min-h-[66px] rounded-xl border p-1.5 text-left ${isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 bg-white dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"} ${!isCurrentMonth && viewMode === "month" ? "opacity-45" : ""}`}
            >
              <p className="text-[11px] font-bold text-slate-500 dark:text-[#8e8e93]">{Number(date.slice(-2))}</p>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {doses.slice(0, 4).map((dose) => (
                  <span key={`${dose.schedule.id}-${dose.time}`} className={`h-1.5 w-1.5 rounded-full ${dose.status === "taken" ? "bg-emerald-500" : dose.status === "missed" ? "bg-red-500" : dose.status === "skipped" ? "bg-slate-400" : "bg-blue-500"}`} />
                ))}
              </div>
              {doses.length > 0 && <p className="mt-1 text-[10px] text-slate-400">{doses.length}</p>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-950 dark:text-white">{isZh ? "当日剂量" : "Doses"}</h2>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white dark:bg-[#0a84ff]">
          {showForm ? (isZh ? "收起" : "Close") : (isZh ? "添加计划" : "Add schedule")}
        </button>
      </div>

      {showForm && (
        <AddMedicationScheduleForm
          language={language}
          cabinetItems={cabinetItems}
          onCancel={() => setShowForm(false)}
          onAdd={(schedule) => {
            setSchedules((prev) => [...prev, schedule]);
            setShowForm(false);
          }}
        />
      )}

      {selectedDoses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500 dark:border-[#3a3a3c] dark:bg-[#1c1c1e] dark:text-[#8e8e93]">
          {isZh ? "这一天还没有用药计划。" : "No medication scheduled for this date."}
        </div>
      ) : (
        <div className="space-y-2">
          {selectedDoses.map((dose) => (
            <DoseCard
              key={`${dose.schedule.id}-${dose.date}-${dose.time}`}
              date={dose.date}
              time={dose.time}
              schedule={dose.schedule}
              log={dose.log}
              status={dose.status}
              language={language}
              onStatusChange={(status) => updateDoseStatus(dose, status)}
            />
          ))}
        </div>
      )}

      {schedules.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-slate-950 dark:text-white">{isZh ? "全部计划" : "All schedules"}</h2>
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{schedule.medicationName}</p>
                    <p className="text-xs text-slate-500 dark:text-[#8e8e93]">{schedule.dosage} · {frequencyLabel(schedule.frequency, language)}</p>
                  </div>
                  <button type="button" onClick={() => setSchedules((prev) => prev.filter((item) => item.id !== schedule.id))} className="text-xs font-semibold text-red-500">
                    {isZh ? "删除" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
