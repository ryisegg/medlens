import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { IdentifierForm } from "../components/identifier/IdentifierForm";

export function IdentifierPage() {
  const { language } = useApp();
  const t = getTranslations(language);

  useEffect(() => {
    document.title = `${t.identifier.title} — ${t.appName}`;
  }, [t.identifier.title, t.appName]);

  return <IdentifierForm />;
}
