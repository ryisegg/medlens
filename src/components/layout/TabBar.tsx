import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  House, Pill, Heartbeat, FirstAidKit, UserCircle,
} from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

const TABS = [
  { to: "/",         key: "home",     Icon: House,       labelEn: "Home",     labelZh: "首页" },
  { to: "/drugs",    key: "drugs",    Icon: Pill,        labelEn: "Search",   labelZh: "查药" },
  { to: "/symptoms", key: "symptoms", Icon: Heartbeat,   labelEn: "Symptoms", labelZh: "症状" },
  { to: "/cabinet",  key: "cabinet",  Icon: FirstAidKit, labelEn: "Cabinet",  labelZh: "药箱" },
  { to: "/profile",  key: "profile",  Icon: UserCircle,  labelEn: "Profile",  labelZh: "我的" },
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
      <div className="flex h-16 items-center">
        {TABS.map(({ to, Icon, labelEn, labelZh }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="flex flex-1 flex-col items-center justify-center"
            aria-label={isZh ? labelZh : labelEn}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative flex h-9 w-9 items-center justify-center"
                  animate={{ scale: isActive ? 1 : 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={22}
                    weight={isActive ? "fill" : "duotone"}
                    className={`relative z-10 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                </motion.div>
                <span
                  className={`mt-0.5 text-[10px] leading-none transition-all ${
                    isActive
                      ? "font-bold text-blue-600 dark:text-blue-400"
                      : "font-medium text-slate-400 dark:text-slate-500"
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
