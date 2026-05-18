interface InteractionWarningProps {
  drugA: string;
  drugB: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
}

const SEVERITY_STYLES = {
  mild: {
    container: "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/40",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    icon: "text-yellow-600 dark:text-yellow-400",
    text: "text-slate-800 dark:text-white",
    desc: "text-slate-700 dark:text-[#8e8e93]",
  },
  moderate: {
    container: "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/40",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    icon: "text-orange-600 dark:text-orange-400",
    text: "text-slate-800 dark:text-white",
    desc: "text-slate-700 dark:text-[#8e8e93]",
  },
  severe: {
    container: "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
    text: "text-slate-800 dark:text-white",
    desc: "text-slate-700 dark:text-[#8e8e93]",
  },
};

export function InteractionWarning({ drugA, drugB, severity, description }: InteractionWarningProps) {
  const s = SEVERITY_STYLES[severity];
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);

  return (
    <div className={`rounded-xl border p-3 ${s.container}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <svg className={`h-4 w-4 flex-shrink-0 ${s.icon}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className={`text-sm font-semibold ${s.text}`}>{drugA} + {drugB}</span>
        </div>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
          {label}
        </span>
      </div>
      <p className={`mt-1.5 text-sm ${s.desc}`}>{description}</p>
    </div>
  );
}
