import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { SymptomChecker } from "../components/symptoms/SymptomChecker";

export function SymptomPage() {
  const { language } = useApp();
  const t = getTranslations(language);

  useEffect(() => {
    document.title = `${t.symptoms.title} — ${t.appName}`;
  }, [t.symptoms.title, t.appName]);

  return <SymptomChecker />;
}
