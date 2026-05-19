// eslint-disable-next-line react-refresh/only-export-components
export function getExpirationState(expirationDate?: string) {
  if (!expirationDate) return "none" as const;
  const today = new Date();
  const expiry = new Date(`${expirationDate}T00:00:00`);
  const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
  if (days < 0) return "expired" as const;
  if (days <= 30) return "soon" as const;
  return "ok" as const;
}

interface Props {
  expirationDate?: string;
  language: string;
}

export function ExpirationWarningBadge({ expirationDate, language }: Props) {
  const isZh = language === "zh";
  const state = getExpirationState(expirationDate);
  if (state === "none" || state === "ok") return null;

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
      state === "expired"
        ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
    }`}>
      {state === "expired" ? (isZh ? "已过期" : "Expired") : (isZh ? "即将过期" : "Expiring Soon")}
    </span>
  );
}
