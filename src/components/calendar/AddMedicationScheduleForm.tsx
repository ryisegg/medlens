import { useState } from "react";
import type { CabinetItem, MedicationSchedule } from "../../types";

interface Props {
  language: string;
  cabinetItems: CabinetItem[];
  onAdd: (schedule: MedicationSchedule) => void;
  onCancel: () => void;
}

const WEEKDAYS = [
  { value: "0", en: "Sun", zh: "周日" },
  { value: "1", en: "Mon", zh: "周一" },
  { value: "2", en: "Tue", zh: "周二" },
  { value: "3", en: "Wed", zh: "周三" },
  { value: "4", en: "Thu", zh: "周四" },
  { value: "5", en: "Fri", zh: "周五" },
  { value: "6", en: "Sat", zh: "周六" },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function buildTimes(frequency: string, firstTime: string, everyHours: string) {
  if (frequency !== "every-x-hours") return [firstTime];
  const hours = Number(everyHours) || 8;
  const [startHour, minute] = firstTime.split(":").map(Number);
  const times: string[] = [];
  for (let h = startHour; h < 24; h += hours) {
    times.push(`${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  return times.length ? times : [firstTime];
}

export function AddMedicationScheduleForm({ language, cabinetItems, onAdd, onCancel }: Props) {
  const isZh = language === "zh";
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("once-daily");
  const [time, setTime] = useState("08:00");
  const [everyHours, setEveryHours] = useState("8");
  const [days, setDays] = useState<string[]>(["1", "2", "3", "4", "5"]);
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [linkedCabinetItemId, setLinkedCabinetItemId] = useState("");

  const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white";
  const label = "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]";

  function submit() {
    const name = medicationName.trim();
    if (!name) return;
    const scheduleFrequency = frequency === "specific-days"
      ? `specific-days:${days.join(",")}`
      : frequency === "every-x-hours"
        ? `every-${everyHours}-hours`
        : frequency;

    onAdd({
      id: crypto.randomUUID(),
      medicationName: name,
      dosage: dosage.trim(),
      frequency: scheduleFrequency,
      times: buildTimes(frequency, time, everyHours),
      startDate,
      endDate: endDate || undefined,
      notes: notes.trim() || undefined,
      linkedCabinetItemId: linkedCabinetItemId || undefined,
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">{isZh ? "添加用药计划" : "Add medication schedule"}</h2>
      <div className="mt-4 space-y-3">
        <div>
          <label className={label}>{isZh ? "药品名称" : "Medication name"}</label>
          <input className={input} value={medicationName} onChange={(e) => setMedicationName(e.target.value)} placeholder={isZh ? "例如：布洛芬" : "e.g. Ibuprofen"} />
        </div>
        <div>
          <label className={label}>{isZh ? "剂量" : "Dosage"}</label>
          <input className={input} value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder={isZh ? "例如：200 mg，1 片" : "e.g. 200 mg, 1 tablet"} />
        </div>
        <div>
          <label className={label}>{isZh ? "频率" : "Frequency"}</label>
          <select className={input} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="once-daily">{isZh ? "每日一次" : "Once daily"}</option>
            <option value="twice-daily">{isZh ? "每日两次" : "Twice daily"}</option>
            <option value="three-times-daily">{isZh ? "每日三次" : "Three times daily"}</option>
            <option value="every-x-hours">{isZh ? "每 X 小时" : "Every X hours"}</option>
            <option value="specific-days">{isZh ? "每周指定日期" : "Specific days of week"}</option>
          </select>
        </div>
        {frequency === "every-x-hours" && (
          <div>
            <label className={label}>{isZh ? "间隔小时" : "Every hours"}</label>
            <input className={input} type="number" min="1" max="24" value={everyHours} onChange={(e) => setEveryHours(e.target.value)} />
          </div>
        )}
        {frequency === "specific-days" && (
          <div>
            <label className={label}>{isZh ? "星期" : "Days"}</label>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setDays((prev) => prev.includes(day.value) ? prev.filter((d) => d !== day.value) : [...prev, day.value])}
                  className={`rounded-lg px-1 py-2 text-[11px] font-semibold ${days.includes(day.value) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"}`}
                >
                  {isZh ? day.zh : day.en}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{isZh ? "开始日期" : "Start date"}</label>
            <input className={input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className={label}>{isZh ? "结束日期" : "End date"}</label>
            <input className={input} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>{isZh ? "提醒时间" : "Reminder time"}</label>
          <input className={input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        {cabinetItems.length > 0 && (
          <div>
            <label className={label}>{isZh ? "关联药箱药品" : "Link cabinet medicine"}</label>
            <select className={input} value={linkedCabinetItemId} onChange={(e) => setLinkedCabinetItemId(e.target.value)}>
              <option value="">{isZh ? "不关联" : "No link"}</option>
              {cabinetItems.map((item) => <option key={item.id} value={item.id}>{item.medicationName}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className={label}>{isZh ? "备注" : "Notes"}</label>
          <textarea className={input} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-[#3a3a3c] dark:text-[#c7c7cc]">
          {isZh ? "取消" : "Cancel"}
        </button>
        <button type="button" onClick={submit} disabled={!medicationName.trim()} className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]">
          {isZh ? "保存计划" : "Save schedule"}
        </button>
      </div>
    </div>
  );
}
