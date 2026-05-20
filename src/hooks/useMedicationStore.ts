import { useCallback, useEffect, useState } from "react";
import type { CabinetItem, DoseLog, MedicationSchedule } from "../types";
import { CABINET_KEY, DOSE_LOG_KEY, SCHEDULE_KEY } from "../lib/medicationKeys";
import { loadJSON, saveJSON } from "../lib/storage";

export function useMedicationStore() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(() =>
    loadJSON(SCHEDULE_KEY, []),
  );
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => loadJSON(DOSE_LOG_KEY, []));
  const [cabinetItems, setCabinetItems] = useState<CabinetItem[]>(() =>
    loadJSON(CABINET_KEY, []),
  );

  useEffect(() => saveJSON(SCHEDULE_KEY, schedules), [schedules]);
  useEffect(() => saveJSON(DOSE_LOG_KEY, doseLogs), [doseLogs]);
  useEffect(() => saveJSON(CABINET_KEY, cabinetItems), [cabinetItems]);

  const addSchedule = useCallback((schedule: MedicationSchedule) => {
    setSchedules((prev) => [schedule, ...prev]);
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setDoseLogs((prev) => prev.filter((log) => log.scheduleId !== id));
  }, []);

  const updateDoseLog = useCallback(
    (
      scheduleId: string,
      date: string,
      time: string,
      status: DoseLog["status"],
    ) => {
      setDoseLogs((prev) => {
        const existing = prev.find(
          (log) => log.scheduleId === scheduleId && log.date === date && log.time === time,
        );
        if (existing) {
          return prev.map((log) =>
            log.id === existing.id ? { ...log, status } : log,
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            scheduleId,
            date,
            time,
            status,
          },
        ];
      });
    },
    [],
  );

  const upsertCabinetItem = useCallback((item: CabinetItem) => {
    setCabinetItems((prev) => {
      if (item.id) {
        return prev.map((existing) => (existing.id === item.id ? item : existing));
      }
      return [{ ...item, id: crypto.randomUUID() }, ...prev];
    });
  }, []);

  const removeCabinetItem = useCallback((id: string) => {
    setCabinetItems((prev) => prev.filter((item) => item.id !== id));
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.linkedCabinetItemId === id
          ? { ...schedule, linkedCabinetItemId: undefined }
          : schedule,
      ),
    );
  }, []);

  return {
    schedules,
    setSchedules,
    doseLogs,
    setDoseLogs,
    cabinetItems,
    setCabinetItems,
    addSchedule,
    removeSchedule,
    updateDoseLog,
    upsertCabinetItem,
    removeCabinetItem,
  };
}
