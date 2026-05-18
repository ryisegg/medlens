import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiDrugDetail } from "../../types/api";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";

interface Props { drug: ApiDrugDetail }

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-base leading-none">{icon}</span>
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
        {children}
      </h2>
    </div>
  );
}

function LongText({ text, maxLines = 5 }: { text: string; maxLines?: number }) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split(/\n+/).filter(Boolean);
  const preview = lines.slice(0, maxLines);
  const hasMore = lines.length > maxLines;

  return (
    <div>
      <div className="space-y-2">
        {(expanded ? lines : preview).map((line, i) => (
          <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">
            {line}
          </p>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-xs font-semibold text-blue-600 dark:text-[#0a84ff]"
        >
          {expanded ? "Show less ▲" : `Show more (${lines.length - maxLines} more) ▼`}
        </button>
      )}
    </div>
  );
}

function BulletList({ text }: { text: string }) {
  const lines = text.split(/\n+/).filter(Boolean);
  if (lines.length === 1) {
    return <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{text}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-[#8e8e93]">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 dark:bg-[#0a84ff]" />
          <span className="leading-relaxed">{line}</span>
        </li>
      ))}
    </ul>
  );
}

function WarningSection({ icon, title, text, accentClass }: {
  icon: string; title: string; text: string; accentClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split(/\n+/).filter(Boolean);
  const preview = lines.slice(0, 4);
  const hasMore = lines.length > 4;

  return (
    <div className={`rounded-xl border px-4 py-3 ${accentClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <p className="text-xs font-bold uppercase tracking-widest">{title}</p>
      </div>
      <div className="space-y-1.5">
        {(expanded ? lines : preview).map((line, i) => (
          <p key={i} className="text-sm leading-relaxed">{line}</p>
        ))}
      </div>
      {hasMore && (
        <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-2 text-xs font-semibold underline">
          {expanded ? "Show less" : `+${lines.length - 4} more`}
        </button>
      )}
    </div>
  );
}

const SOURCE_LABEL: Record<ApiDrugDetail["source"], string> = {
  openFDA: "FDA Drug Label Database",
  DailyMed: "DailyMed (NLM / NIH)",
  mock: "MedLens Demo Data",
};

export function ApiDrugDetailView({ drug }: Props) {
  const navigate = useNavigate();
  const { language } = useApp();
  const t = getTranslations(language);

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {drug.otcOrRx !== "unknown" && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                drug.otcOrRx === "OTC"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}>
                {drug.otcOrRx === "OTC" ? t.drug.otc : t.drug.rx}
              </span>
            )}
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {SOURCE_LABEL[drug.source]}
            </span>
          </div>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{drug.name}</h1>
        {drug.genericName && drug.genericName.toLowerCase() !== drug.name.toLowerCase() && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            {t.drug.genericName}:{" "}
            <span className="font-medium text-slate-700 dark:text-white">{drug.genericName}</span>
          </p>
        )}
        {drug.brandNames.length > 0 && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            {t.drug.brandNames}:{" "}
            <span className="font-medium text-slate-700 dark:text-white">
              {drug.brandNames.slice(0, 5).join(", ")}
            </span>
          </p>
        )}
        {drug.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{drug.description}</p>
        )}
      </Card>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
          ⚕️ {t.api.disclaimer}
        </p>
      </div>

      {/* Quick facts row */}
      {(drug.activeIngredients?.length || drug.dosageForms?.length) ? (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            {drug.activeIngredients && drug.activeIngredients.length > 0 && (
              <div>
                <SectionLabel icon="🔬">{t.drug.activeIngredient}</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {drug.activeIngredients.map((ing) => (
                    <span key={ing} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {drug.dosageForms && drug.dosageForms.length > 0 && (
              <div>
                <SectionLabel icon="💊">{t.drug.dosageForms}</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {drug.dosageForms.map((f) => (
                    <span key={f} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 capitalize dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
                      {f.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : null}

      {/* Indications */}
      {drug.indicationsAndUsage && (
        <Card>
          <SectionLabel icon="✅">{t.drug.uses}</SectionLabel>
          <LongText text={drug.indicationsAndUsage} />
        </Card>
      )}

      {/* Dosage */}
      {drug.dosageAndAdministration && (
        <Card>
          <SectionLabel icon="📏">{t.api.dosageAndAdmin}</SectionLabel>
          <LongText text={drug.dosageAndAdministration} />
        </Card>
      )}

      {/* Warnings */}
      {drug.warnings && (
        <WarningSection
          icon="⚠️"
          title={t.api.warnings}
          text={drug.warnings}
          accentClass="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
        />
      )}

      {/* Do Not Use / Contraindications */}
      {drug.contraindications && (
        <WarningSection
          icon="🚫"
          title={t.drug.contraindications}
          text={drug.contraindications}
          accentClass="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
        />
      )}

      {/* Side effects */}
      {drug.adverseReactions && (
        <Card>
          <SectionLabel icon="🩺">{t.drug.sideEffects}</SectionLabel>
          <BulletList text={drug.adverseReactions} />
        </Card>
      )}

      {/* Drug interactions */}
      {drug.drugInteractions && (
        <Card>
          <SectionLabel icon="⚡">{t.drug.interactions}</SectionLabel>
          <LongText text={drug.drugInteractions} />
        </Card>
      )}

      {/* Pregnancy */}
      {(drug.pregnancyInfo || drug.nursingMotherInfo) && (
        <Card>
          <SectionLabel icon="🤰">{t.drug.pregnancy}</SectionLabel>
          <div className="space-y-3">
            {drug.pregnancyInfo && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-[#636366]">{t.drug.pregnancyNote}</p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{drug.pregnancyInfo}</p>
              </div>
            )}
            {drug.nursingMotherInfo && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-[#636366]">{t.api.nursingMothers}</p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{drug.nursingMotherInfo}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Keep out of reach */}
      {drug.keepOutOfReachOfChildren && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-[#3a3a3c] dark:bg-[#1c1c1e]">
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">👶</span>
            <p className="text-sm text-slate-700 dark:text-[#8e8e93]">{drug.keepOutOfReachOfChildren}</p>
          </div>
        </div>
      )}

      {/* Source footer */}
      <Card className="text-xs text-slate-400 dark:text-[#636366] space-y-1">
        <p>{t.drug.source}: {SOURCE_LABEL[drug.source]}</p>
        {drug.sourceUrl && (
          <p>
            {t.api.viewFull}:{" "}
            <span className="text-blue-500 dark:text-[#0a84ff] break-all">{drug.sourceUrl}</span>
          </p>
        )}
        <p>{t.drug.lastReviewed}: {drug.lastUpdated}</p>
      </Card>

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
