import type { Drug, PregnancyCategory, SideEffect } from "../../types";
import { WarningBanner } from "../shared/WarningBanner";
import { InteractionWarning } from "../shared/InteractionWarning";

interface DrugDetailPageProps {
  drug: Drug;
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
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

export function DrugDetailPage({ drug }: DrugDetailPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${
            drug.otcOrRx === "OTC" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>
            {drug.otcOrRx}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {drug.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{drug.name}</h1>
        <p className="mt-1 text-base text-slate-500">Generic: {drug.genericName}</p>
        {drug.brandNames.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">
            Brand names: <span className="font-medium">{drug.brandNames.join(", ")}</span>
          </p>
        )}
        <p className="mt-3 text-base text-slate-700">{drug.description}</p>
      </div>

      <WarningBanner
        level="caution"
        title="Always consult a healthcare professional"
        message="This information is educational only. Never start, stop, or change medication without talking to your doctor or pharmacist."
      />

      <div className="mt-6 space-y-6 divide-y divide-slate-100">
        <InfoSection title="What it's used for">
          <ul className="space-y-1.5">
            {drug.uses.map((use, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                {use}
              </li>
            ))}
          </ul>
        </InfoSection>

        <div className="pt-6">
          <InfoSection title="How it works">
            <p className="text-sm text-slate-700">{drug.mechanism}</p>
          </InfoSection>
        </div>

        <div className="pt-6">
          <InfoSection title="Dosage forms & common doses">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {drug.dosageForms.map((form) => (
                <span key={form} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 capitalize">
                  {form}
                </span>
              ))}
            </div>
            <ul className="space-y-1">
              {drug.commonDoses.map((dose, i) => (
                <li key={i} className="text-sm text-slate-700">• {dose}</li>
              ))}
            </ul>
          </InfoSection>
        </div>

        <div className="pt-6">
          <InfoSection title="Side effects">
            <div className="space-y-2">
              {["common", "serious", "rare"].map((sev) => {
                const effects = drug.sideEffects.filter((s) => s.severity === sev);
                if (effects.length === 0) return null;
                return (
                  <div key={sev}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {sev}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {effects.map((s, i) => (
                        <span key={i} className={`rounded-full px-2.5 py-1 text-xs font-medium ${SEVERITY_STYLE[s.severity]}`}>
                          {s.effect}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </InfoSection>
        </div>

        <div className="pt-6">
          <InfoSection title="Who should not use this">
            <ul className="space-y-1.5">
              {drug.contraindications.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 text-red-500">✕</span>
                  {c}
                </li>
              ))}
            </ul>
          </InfoSection>
        </div>

        {drug.interactions.length > 0 && (
          <div className="pt-6">
            <InfoSection title="Drug interactions">
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
            </InfoSection>
          </div>
        )}

        <div className="pt-6">
          <InfoSection title="Pregnancy & breastfeeding">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Pregnancy category:</span>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${PREGNANCY_BADGE[drug.pregnancyCategory]}`}>
                  {drug.pregnancyCategory}
                </span>
              </div>
              <p className="text-sm text-slate-700"><span className="font-medium">Pregnancy:</span> {drug.pregnancyNote}</p>
              <p className="text-sm text-slate-700"><span className="font-medium">Breastfeeding:</span> {drug.breastfeedingNote}</p>
            </div>
          </InfoSection>
        </div>

        <div className="pt-6">
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 p-4">
            <h2 className="mb-2 text-base font-semibold text-red-800">When to contact a doctor</h2>
            <ul className="space-y-1.5">
              {drug.whenToCallDoctor.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <p>Source: {drug.source}</p>
        <p>Last reviewed: {drug.lastReviewed}</p>
      </div>
    </div>
  );
}
