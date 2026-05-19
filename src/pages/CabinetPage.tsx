import { useEffect } from "react";
import { MedicineCabinet } from "../components/cabinet/MedicineCabinet";
import { useApp } from "../context/AppContext";

export function CabinetPage() {
  const { language } = useApp();

  useEffect(() => {
    document.title = `${language === "zh" ? "我的药箱" : "My Medicine Cabinet"} — MedLens`;
  }, [language]);

  return <MedicineCabinet />;
}
