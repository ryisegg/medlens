import { useNavigate } from "react-router-dom";
import type { Translations } from "../../i18n";

interface Props {
  p: Translations["profile"];
}

const LINKS = [
  { to: "/drugs", key: "quickSearch" as const, icon: "🔍" },
  { to: "/symptoms", key: "quickSymptoms" as const, icon: "🩺" },
  { to: "/calendar", key: "quickCalendar" as const, icon: "📅" },
  { to: "/cabinet", key: "quickCabinet" as const, icon: "🗄️" },
] as const;

export function QuickLinks({ p }: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-[#1c1c1e]">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
        {p.quickLinks}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {LINKS.map(({ to, key, icon }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-3 text-left text-sm font-semibold text-slate-800 transition active:scale-[0.98] dark:bg-[#2c2c2e] dark:text-white"
          >
            <span className="text-lg">{icon}</span>
            <span>{p[key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
