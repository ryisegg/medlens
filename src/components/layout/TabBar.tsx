import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";

function SearchIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" />
    </svg>
  ) : (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function SymptomsIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" />
    </svg>
  ) : (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3a.75.75 0 011.5 0v1.5h.75A2.25 2.25 0 0121 6.75v11.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.25V6.75A2.25 2.25 0 015.25 4.5H6V3a.75.75 0 01.75-.75zM4.5 9v9.25c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75V9h-15z" />
    </svg>
  ) : (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 4.5h13.5A1.5 1.5 0 0120.25 6v12.75a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
    </svg>
  );
}

function CabinetIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 4.5A2.25 2.25 0 016.75 2.25h10.5A2.25 2.25 0 0119.5 4.5v15.75a.75.75 0 01-1.5 0V19.5H6v.75a.75.75 0 01-1.5 0V4.5zM6 4.5V18h5.25V4.5H6zm6.75 0V18H18V4.5h-5.25zM9 10.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H9zm5.25 0a.75.75 0 000 1.5H15a.75.75 0 000-1.5h-.75z" />
    </svg>
  ) : (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25V21M6 21V5.25A.75.75 0 016.75 4.5h10.5a.75.75 0 01.75.75V21M6 12h12M10.5 8.25h-1.5M15 8.25h-1.5M10.5 15.75h-1.5M15 15.75h-1.5" />
    </svg>
  );
}

function SafetyIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
    </svg>
  ) : (
    <svg className="h-[25px] w-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const TABS = [
  { to: "/drugs", key: "search", Icon: SearchIcon },
  { to: "/symptoms", key: "symptoms", Icon: SymptomsIcon },
  { to: "/calendar", key: "calendar", Icon: CalendarIcon },
  { to: "/cabinet", key: "cabinet", Icon: CabinetIcon },
  { to: "/safety", key: "safety", Icon: SafetyIcon },
] as const;

const LABELS = {
  en: { search: "Search", symptoms: "Symptoms", calendar: "Calendar", cabinet: "Cabinet", safety: "Safety" },
  zh: { search: "查药", symptoms: "症状", calendar: "日历", cabinet: "药箱", safety: "安全" },
} as const;

export function TabBar() {
  const { language } = useApp();
  const t = getTranslations(language);
  const labels = language === "zh" ? LABELS.zh : LABELS.en;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-[#3a3a3c] dark:bg-[#1c1c1e]/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14">
        {TABS.map(({ to, key, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-[#0a84ff]"
                  : "text-slate-400 dark:text-[#636366]"
              }`
            }
            aria-label={labels[key] ?? t.tabs.search}
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className="text-[10px] font-medium leading-none">{labels[key]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
