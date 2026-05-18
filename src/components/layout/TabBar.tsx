import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";

function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ) : (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" />
    </svg>
  ) : (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function SymptomsIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" />
    </svg>
  ) : (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function PillIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.255 3A23.933 23.933 0 0121 12c0 3.183-.62 6.22-1.745 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.205a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09" />
    </svg>
  ) : (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.7-1.41 2.7H4.21c-1.44 0-2.41-1.7-1.41-2.7L4.2 15.3" />
    </svg>
  );
}

function SafetyIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
    </svg>
  ) : (
    <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const TABS = [
  { to: "/", label: "home" as const, Icon: HomeIcon },
  { to: "/drugs", label: "search" as const, Icon: SearchIcon },
  { to: "/symptoms", label: "symptoms" as const, Icon: SymptomsIcon },
  { to: "/identifier", label: "identifier" as const, Icon: PillIcon },
  { to: "/safety", label: "safety" as const, Icon: SafetyIcon },
] as const;

export function TabBar() {
  const { language } = useApp();
  const t = getTranslations(language);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-[#3a3a3c] dark:bg-[#1c1c1e]/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-[#0a84ff]"
                  : "text-slate-400 dark:text-[#636366]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className="text-[10px] font-medium leading-none">{t.tabs[label]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
