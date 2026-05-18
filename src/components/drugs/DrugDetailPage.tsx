import type { Drug, PregnancyCategory, SideEffect } from "../../types";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { WarningBanner } from "../shared/WarningBanner";
import { InteractionWarning } from "../shared/InteractionWarning";

interface DrugDetailPageProps {
  drug: Drug;
}

const SEVERITY_STYLE: Record<SideEffect["severity"], string> = {
  common: "bg-slate-100 text-slate-600",
  serious: "bg-red-100 text-red-700",
  rare: "bg-amber-100 text-amber-700",
};

const PREGNANCY_BADGE: Record<PregnancyCategory, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-green-100 text-green-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
  X: "bg-red-200 text-red-900 font-bold",
  N: "bg-slate-100 text-slate-600",
};

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">{children}</h2>;
}

export function DrugDetailPage({ drug }: DrugDetailPageProps) {
  const { language } = useApp();
  const t = getTranslations(language);

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Header card */}
      <Card>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            drug.otcOrRx === "OTC" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>
            {drug.otcOrRx === "OTC" ? t.drug.otc : t.drug.rx}
          </span>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {drug.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{drug.name}</h1>
        <p className="mt-0.5 text-sm text-slate-500">{t.drug.genericName}: <span className="font-medium">{drug.genericName}</span></p>
        {drug.brandNames.length > 0 && (
          <p className="mt-0.5 text-sm text-slate-500">
            {t.drug.brandNames}: <span className="font-medium">{drug.brandNames.join(", ")}</span>
          </p>
        )}
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">{drug.description}</p>
      </Card>

      <WarningBanner
        level="caution"
        title={t.drug.disclaimer}
        message={t.drug.disclaimerDesc}
      />

      {/* Uses */}
      <Card>
        <SectionTitle>{t.drug.uses}</SectionTitle>
        <ul className="space-y-2">
          {drug.uses.map((use, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              {use}
            </li>
          ))}
        </ul>
      </Card>

      {/* How it works */}
      <Card>
        <SectionTitle>{t.drug.mechanism}</SectionTitle>
        <p className="text-sm text-slate-700 leading-relaxed">{drug.mechanism}</p>
      </Card>

      {/* Dosage */}
      <Card>
        <SectionTitle>{t.drug.dosageForms}</SectionTitle>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {drug.dosageForms.map((form) => (
            <span key={form} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 capitalize">
              {form}
            </span>
          ))}
        </div>
        <SectionTitle>{t.drug.commonDoses}</SectionTitle>
        <ul className="space-y-1">
          {drug.commonDoses.map((dose, i) => (
            <li key={i} className="text-sm text-slate-700">• {dose}</li>
          ))}
        </ul>
      </Card>

      {/* Side effects */}
      <Card>
        <SectionTitle>{t.drug.sideEffects}</SectionTitle>
        <div className="space-y-3">
          {(["common", "serious", "rare"] as SideEffect["severity"][]).map((sev) => {
            const effects = drug.sideEffects.filter((s) => s.severity === sev);
            if (effects.length === 0) return null;
            const label = sev === "common" ? t.drug.common : sev === "serious" ? t.drug.serious : t.drug.rare;
            return (
              <div key={sev}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {effects.map((s, i) => (
                    <span key={i} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLE[s.severity]}`}>
                      {s.effect}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Contraindications */}
      <Card>
        <SectionTitle>{t.drug.contraindications}</SectionTitle>
        <ul className="space-y-2">
          {drug.contraindications.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-red-500 flex-shrink-0">✕</span>
              {c}
            </li>
          ))}
        </ul>
      </Card>

      {/* Drug interactions */}
      {drug.interactions.length > 0 && (
        <Card>
          <SectionTitle>{t.drug.interactions}</SectionTitle>
          <div className="space-y-2">
            {drug.interactions.map((inter, i) => (
              <InteractionWarning
                key={i}
                drugA={drug.name}
                drugB={inter.drugName}
                severity={inter.severity}
                description={inter.description}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Pregnancy */}
      <Card>
        <SectionTitle>{t.drug.pregnancy}</SectionTitle>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{t.drug.pregnancyCategory}:</span>
            <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${PREGNANCY_BADGE[drug.pregnancyCategory]}`}>
              {drug.pregnancyCategory}
            </span>
          </div>
          <p className="text-sm text-slate-700"><span className="font-medium">{t.drug.pregnancyNote}:</span> {drug.pregnancyNote}</p>
          <p className="text-sm text-slate-700"><span className="font-medium">{t.drug.breastfeedingNote}:</span> {drug.breastfeedingNote}</p>
        </div>
      </Card>

      {/* When to call doctor */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4">
        <h2 className="mb-3 text-sm font-semibold text-red-800 uppercase tracking-wide">{t.drug.whenToCallDoctor}</h2>
        <ul className="space-y-2">
          {drug.whenToCallDoctor.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-700">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency signs — if drug has them */}
      {drug.emergencySigns && drug.emergencySigns.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 px-5 py-4">
          <h2 className="mb-1 text-sm font-semibold text-red-900 uppercase tracking-wide">{t.drug.emergencySigns}</h2>
          <p className="mb-3 text-xs text-red-700">{t.drug.emergencySignsDesc}</p>
          <ul className="space-y-2">
            {drug.emergencySigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800 font-medium">
                <span className="text-red-500 flex-shrink-0">⚠</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-2xl bg-white px-5 py-3 shadow-sm text-xs text-slate-400 space-y-0.5">
        <p>{t.drug.source}: {drug.source}</p>
        <p>{t.drug.lastReviewed}: {drug.lastReviewed}</p>
      </div>

      <div className="h-2" />
    </div>
  );
}
