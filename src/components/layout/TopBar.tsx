import { Moon, Sun } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import type { Language } from "../../types";

function LogoMark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 shadow-md shadow-blue-500/25">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_50%)]" />
      <svg className="relative h-5 w-5 text-white drop-shadow-sm" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="11" width="20" height="14" rx="5" fill="currentColor" fillOpacity="0.95" />
        <path d="M11 11V8.8C11 7.25 12.25 6 13.8 6h4.4C19.75 6 21 7.25 21 8.8V11"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M16 14.2v7.6M12.2 18h7.6" stroke="rgba(13,148,136,0.9)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function LanguageSwitcher({ language, setLanguage }: { language: Language; setLanguage: (l: Language) => void }) {
  return (
    <div className="flex items-center rounded-full border border-slate-200/80 bg-slate-50/80 p-0.5 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
      {(["en", "zh"] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-2.5 py-1 transition-all duration-200 ${
            language === lang
              ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-black"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {lang === "en" ? "EN" : "中"}
        </button>
      ))}
    </div>
  );
}

export function TopBar() {
  const { language, setLanguage, isDark, toggleDark } = useApp();
  const t = getTranslations(language);
  const isZh = language === "zh";

  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 bg-white/90 dark:bg-[#111]/90 backdrop-blur-2xl"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <div className="leading-none">
            <span className="block text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
              {isZh ? "小药房" : "MedLens"}
            </span>
            {!isZh && (
              <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                Health Reference
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 text-slate-500 transition-all duration-200 hover:bg-slate-200 active:scale-90 dark:bg-white/8 dark:text-slate-400 dark:hover:bg-white/12"
            aria-label={isDark ? t.common.lightMode : t.common.darkMode}
          >
            {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>

          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
      </div>
    </header>
  );
}
