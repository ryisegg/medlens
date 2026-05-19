import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import type { Language } from "../../types";

function LogoMark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-sm shadow-blue-500/20 dark:from-[#0a84ff] dark:via-cyan-400 dark:to-emerald-300">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_32%)]" />
      <svg className="relative h-6 w-6 text-white drop-shadow-sm" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="11" width="20" height="14" rx="5" fill="currentColor" fillOpacity="0.96" />
        <path d="M11 11V8.8C11 7.25 12.25 6 13.8 6h4.4C19.75 6 21 7.25 21 8.8V11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <path d="M16 14.2v7.6M12.2 18h7.6" stroke="#0F766E" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="22.5" cy="22.5" r="5" stroke="#0F172A" strokeWidth="2" fill="rgba(255,255,255,0.35)" />
        <path d="M26 26l2.6 2.6" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function TopBar() {
  const { language, setLanguage, isDark, toggleDark } = useApp();
  const t = getTranslations(language);
  const brand = language === "zh" ? "小药房" : t.appName;

  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-[#2c2c2e] dark:bg-black/90"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <div className="leading-tight">
            <span className="block text-base font-black text-slate-950 dark:text-white">{brand}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
              MedLens
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition active:scale-90 dark:bg-[#1c1c1e] dark:text-[#8e8e93]"
            aria-label={isDark ? t.common.lightMode : t.common.darkMode}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher({ language, setLanguage }: { language: Language; setLanguage: (l: Language) => void }) {
  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      {(["en", "zh"] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-2.5 py-1 transition ${
            language === lang
              ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-black"
              : "text-slate-500 dark:text-[#8e8e93]"
          }`}
        >
          {lang === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
