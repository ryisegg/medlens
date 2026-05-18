import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-[#8e8e93]">
          <span className="mt-0.5 flex-shrink-0 text-blue-500 dark:text-[#0a84ff]">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SafetyPage() {
  const { language } = useApp();
  const t = getTranslations(language);
  const ts = t.safety;

  useEffect(() => {
    document.title = `${ts.title} — ${t.appName}`;
  }, [ts.title, t.appName]);

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Emergency banner */}
      <div className="rounded-2xl border-2 border-red-500 bg-red-50 px-5 py-4 dark:border-red-600 dark:bg-red-950/60">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🚨</span>
          <h2 className="text-base font-bold text-red-900 dark:text-red-300">{ts.emergencyTitle}</h2>
        </div>
        <p className="text-sm text-red-800 mb-3 dark:text-red-400">{ts.emergencyDesc}</p>
        <ul className="space-y-1.5">
          {ts.emergencySigns.map((sign, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-800 font-medium dark:text-red-300">
              <span className="flex-shrink-0 text-red-500 dark:text-red-400">⚠</span>
              {sign}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-red-600 py-3 text-center dark:bg-red-700">
          <p className="text-xl font-bold text-white">120 / 911</p>
          <p className="text-xs text-red-200">{language === "en" ? "Call immediately" : "立即拨打"}</p>
        </div>
      </div>

      {/* Emergency resources */}
      <Section title={ts.emergencyResources}>
        <div className="space-y-2">
          {ts.resources.map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-[#2c2c2e]">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-slate-500 dark:text-[#8e8e93]">{r.desc}</p>
              </div>
              <span className="text-sm font-bold text-blue-700 text-right dark:text-[#0a84ff]">{r.number}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Drug interactions */}
      <Section title={ts.interactionsTitle}>
        <p className="mb-3 text-sm text-slate-600 dark:text-[#8e8e93]">{ts.interactionsDesc}</p>
        <BulletList items={ts.interactionsItems} />
      </Section>

      {/* Special populations */}
      <Section title={ts.vulnerableTitle}>
        <p className="mb-3 text-sm text-slate-600 dark:text-[#8e8e93]">{ts.vulnerableDesc}</p>
        <BulletList items={ts.vulnerableItems} />
      </Section>

      {/* Alcohol */}
      <Section title={ts.alcoholTitle}>
        <p className="mb-3 text-sm text-slate-600 dark:text-[#8e8e93]">{ts.alcoholDesc}</p>
        <BulletList items={ts.alcoholItems} />
      </Section>

      {/* Hidden acetaminophen */}
      <Section title={ts.acetaminophenTitle}>
        <p className="mb-3 text-sm text-slate-600 dark:text-[#8e8e93]">{ts.acetaminophenDesc}</p>
        <BulletList items={ts.acetaminophenItems} />
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{ts.acetaminophenRule}</p>
        </div>
      </Section>

      {/* Prescription warning */}
      <Section title={ts.prescriptionTitle}>
        <p className="mb-3 text-sm text-slate-600 dark:text-[#8e8e93]">{ts.prescriptionDesc}</p>
        <BulletList items={ts.prescriptionItems} />
      </Section>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-slate-100 px-5 py-4 dark:bg-[#2c2c2e]">
        <h2 className="mb-2 text-sm font-bold text-slate-700 dark:text-[#8e8e93]">{ts.disclaimerTitle}</h2>
        <p className="text-xs text-slate-500 leading-relaxed dark:text-[#636366]">{ts.disclaimerDesc}</p>
      </div>

      <div className="h-2" />
    </div>
  );
}
