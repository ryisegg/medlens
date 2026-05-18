import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiDrugDetail } from "../../types/api";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";

interface Props {
  drug: ApiDrugDetail;
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-[#636366]">
      {children}
    </h2>
  );
}

interface CollapsibleSectionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  accentColor?: string;
}

function CollapsibleSection({ title, content, defaultOpen = false, accentColor }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const lines = content.split(/\n+/).filter(Boolean);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <SectionTitle>{title}</SectionTitle>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform dark:text-[#636366] ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`mt-1 space-y-1.5 ${accentColor ? `border-l-2 ${accentColor} pl-3` : ""}`}>
          {lines.length > 1 ? (
            lines.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">
                {line}
              </p>
            ))
          ) : (
            <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{content}</p>
          )}
        </div>
      )}
    </Card>
  );
}

const SOURCE_LABELS: Record<ApiDrugDetail["source"], string> = {
  openFDA: "FDA Drug Label Database",
  DailyMed: "DailyMed (NLM)",
  mock: "MedLens Demo Data",
};

export function ApiDrugDetailView({ drug }: Props) {
  const navigate = useNavigate();
  const { language } = useApp();
  const t = getTranslations(language);

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Header card */}
      <Card>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {drug.otcOrRx !== "unknown" && (
            <Badge
              color={
                drug.otcOrRx === "OTC"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }
            >
              {drug.otcOrRx === "OTC" ? t.drug.otc : t.drug.rx}
            </Badge>
          )}
          <Badge color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {SOURCE_LABELS[drug.source]}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{drug.name}</h1>
        {drug.genericName && drug.genericName.toLowerCase() !== drug.name.toLowerCase() && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            {t.drug.genericName}: <span className="font-medium text-slate-700 dark:text-white">{drug.genericName}</span>
          </p>
        )}
        {drug.brandNames.length > 0 && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            {t.drug.brandNames}: <span className="font-medium text-slate-700 dark:text-white">{drug.brandNames.slice(0, 4).join(", ")}</span>
          </p>
        )}
        {drug.description && (
          <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-[#8e8e93]">{drug.description}</p>
        )}
      </Card>

      {/* Educational disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
          ⚕️ {t.api.disclaimer}
        </p>
      </div>

      {/* Active ingredients */}
      {drug.activeIngredients && drug.activeIngredients.length > 0 && (
        <Card>
          <SectionTitle>{t.drug.activeIngredient}</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {drug.activeIngredients.map((ing) => (
              <span key={ing} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
                {ing}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Dosage forms */}
      {drug.dosageForms && drug.dosageForms.length > 0 && (
        <Card>
          <SectionTitle>{t.drug.dosageForms}</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {drug.dosageForms.map((form) => (
              <span key={form} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 capitalize dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
                {form.toLowerCase()}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Collapsible sections */}
      {drug.indicationsAndUsage && (
        <CollapsibleSection
          title={t.drug.uses}
          content={drug.indicationsAndUsage}
          defaultOpen
        />
      )}

      {drug.dosageAndAdministration && (
        <CollapsibleSection
          title={t.drug.dosageForms}
          content={drug.dosageAndAdministration}
        />
      )}

      {drug.warnings && (
        <CollapsibleSection
          title={t.drug.contraindications}
          content={drug.warnings}
          accentColor="border-amber-400"
        />
      )}

      {drug.contraindications && (
        <CollapsibleSection
          title={t.api.doNotUse}
          content={drug.contraindications}
          accentColor="border-red-400"
        />
      )}

      {drug.adverseReactions && (
        <CollapsibleSection
          title={t.drug.sideEffects}
          content={drug.adverseReactions}
          accentColor="border-orange-400"
        />
      )}

      {drug.drugInteractions && (
        <CollapsibleSection
          title={t.drug.interactions}
          content={drug.drugInteractions}
          accentColor="border-purple-400"
        />
      )}

      {drug.pregnancyInfo && (
        <CollapsibleSection
          title={t.drug.pregnancy}
          content={drug.pregnancyInfo}
        />
      )}

      {drug.nursingMotherInfo && (
        <CollapsibleSection
          title={t.api.nursingMothers}
          content={drug.nursingMotherInfo}
        />
      )}

      {drug.keepOutOfReachOfChildren && (
        <Card>
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p className="text-sm text-slate-700 dark:text-[#8e8e93]">{drug.keepOutOfReachOfChildren}</p>
          </div>
        </Card>
      )}

      {/* Source footer */}
      <div className="rounded-2xl bg-white px-5 py-3 shadow-sm text-xs text-slate-400 space-y-0.5 dark:bg-[#1c1c1e] dark:text-[#636366]">
        <p>{t.drug.source}: {SOURCE_LABELS[drug.source]}</p>
        {drug.sourceUrl && (
          <p>{t.api.viewFull}: <span className="text-blue-500 dark:text-[#0a84ff]">{drug.sourceUrl}</span></p>
        )}
        <p>{t.drug.lastReviewed}: {drug.lastUpdated}</p>
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/drugs")}
        className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
      >
        ← {t.drug.backToSearch}
      </button>

      <div className="h-2" />
    </div>
  );
}
