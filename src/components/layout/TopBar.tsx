import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import type { Language } from "../../types";

export function TopBar() {
  const { language, setLanguage } = useApp();
  const t = getTranslations(language);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-12 items-center justify-between px-4">
        <span className="text-base font-bold text-blue-700">{t.appName}</span>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
}

function LanguageSwitcher({ language, setLanguage }: { language: Language; setLanguage: (l: Language) => void }) {
  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
      {(["en", "zh"] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-2.5 py-1 transition ${
            language === lang
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {lang === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
