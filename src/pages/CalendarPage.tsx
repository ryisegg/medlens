import { useEffect } from "react";
import { MedicationCalendar } from "../components/calendar/MedicationCalendar";
import { useApp } from "../context/AppContext";

export function CalendarPage() {
  const { language } = useApp();

  useEffect(() => {
    document.title = `${language === "zh" ? "用药日历" : "Medication Calendar"} — MedLens`;
  }, [language]);

  return <MedicationCalendar />;
}
