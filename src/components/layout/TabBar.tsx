import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Activity, Calendar, Archive, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TABS = [
  { to: "/drugs",    key: "search",    Icon: Pill,     labelEn: "Medicines",  labelZh: "查药"  },
  { to: "/symptoms", key: "symptoms",  Icon: Activity,  labelEn: "Symptoms",   labelZh: "症状"  },
  { to: "/calendar", key: "calendar",  Icon: Calendar,  labelEn: "Calendar",   labelZh: "日历"  },
  { to: "/cabinet",  key: "cabinet",   Icon: Archive,   labelEn: "Cabinet",    labelZh: "药箱"  },
  { to: "/profile",  key: "profile",   Icon: User,      labelEn: "Profile",    labelZh: "我的"  },
] as const;

export function TabBar() {
  const { language } = useApp();
  const isZh = language === "zh";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#111]/95 backdrop-blur-2xl"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 -1px 0 rgba(0,0,0,0.04), 0 -8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex h-14 items-center">
        {TABS.map(({ to, Icon, labelEn, labelZh }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
            aria-label={isZh ? labelZh : labelEn}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative flex h-7 w-7 items-center justify-center">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="pill"
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/50"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {isZh ? labelZh : labelEn}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
