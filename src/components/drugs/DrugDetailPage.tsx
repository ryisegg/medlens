import { useNavigate } from "react-router-dom";
import type { Drug, PregnancyCategory, SideEffect } from "../../types";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { WarningBanner } from "../shared/WarningBanner";
import { InteractionWarning } from "../shared/InteractionWarning";

interface DrugDetailPageProps {
  drug: Drug;
}

const SEVERITY_STYLE: Record<SideEffect["severity"], string> = {
  common: "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]",
  serious: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  rare: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const PREGNANCY_BADGE: Record<PregnancyCategory, string> = {
  A: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  B: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  D: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  X: "bg-red-200 text-red-900 font-bold dark:bg-red-900/50 dark:text-red-200",
  N: "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] dark:shadow-none">
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

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export function DrugDetailPage({ drug }: DrugDetailPageProps) {
  const navigate = useNavigate();
  const { language, favorites, toggleFavorite } = useApp();
  const t = getTranslations(language);
  const isFav = favorites.includes(drug.id);

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 mb-3 flex-1">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              drug.otcOrRx === "OTC"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            }`}>
              {drug.otcOrRx === "OTC" ? t.drug.otc : t.drug.rx}
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {drug.category}
            </span>
          </div>
          {/* Favorite button */}
          <button
            type="button"
            onClick={() => toggleFavorite(drug.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-90 ${
              isFav
                ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                : "bg-slate-100 text-slate-500 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
            }`}
          >
            <HeartIcon filled={isFav} />
            <span>{isFav ? t.drug.removeFromFavorites : t.drug.addToFavorites}</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{drug.name}</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
          {t.drug.genericName}: <span className="font-medium text-slate-700 dark:text-white">{drug.genericName}</span>
        </p>
        {drug.brandNames.length > 0 && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            {t.drug.brandNames}: <span className="font-medium text-slate-700 dark:text-white">{drug.brandNames.join(", ")}</span>
          </p>
        )}
        <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-[#8e8e93]">{drug.description}</p>
      </Card>

      <WarningBanner level="caution" title={t.drug.disclaimer} message={t.drug.disclaimerDesc} />

      {/* Uses */}
      <Card>
        <SectionTitle>{t.drug.uses}</SectionTitle>
        <ul className="space-y-2">
          {drug.uses.map((use, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-[#8e8e93]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              {use}
            </li>
          ))}
        </ul>
      </Card>

      {/* Mechanism */}
      <Card>
        <SectionTitle>{t.drug.mechanism}</SectionTitle>
        <p className="text-sm text-slate-700 leading-relaxed dark:text-[#8e8e93]">{drug.mechanism}</p>
      </Card>

      {/* Dosage */}
      <Card>
        <SectionTitle>{t.drug.dosageForms}</SectionTitle>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {drug.dosageForms.map((form) => (
            <span key={form} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 capitalize dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
              {form}
            </span>
          ))}
        </div>
        <SectionTitle>{t.drug.commonDoses}</SectionTitle>
        <ul className="space-y-1">
          {drug.commonDoses.map((dose, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-[#8e8e93]">• {dose}</li>
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
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">{label}</p>
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
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-[#8e8e93]">
              <span className="mt-0.5 text-red-500 flex-shrink-0 dark:text-red-400">✕</span>
              {c}
            </li>
          ))}
        </ul>
      </Card>

      {/* Interactions */}
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
            <span className="text-sm text-slate-500 dark:text-[#8e8e93]">{t.drug.pregnancyCategory}:</span>
            <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${PREGNANCY_BADGE[drug.pregnancyCategory]}`}>
              {drug.pregnancyCategory}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-[#8e8e93]">
            <span className="font-medium text-slate-900 dark:text-white">{t.drug.pregnancyNote}:</span> {drug.pregnancyNote}
          </p>
          <p className="text-sm text-slate-700 dark:text-[#8e8e93]">
            <span className="font-medium text-slate-900 dark:text-white">{t.drug.breastfeedingNote}:</span> {drug.breastfeedingNote}
          </p>
        </div>
      </Card>

      {/* When to call doctor */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-950/40">
        <h2 className="mb-3 text-[10px] font-bold text-red-800 uppercase tracking-widest dark:text-red-300">{t.drug.whenToCallDoctor}</h2>
        <ul className="space-y-2">
          {drug.whenToCallDoctor.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency signs */}
      {drug.emergencySigns && drug.emergencySigns.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 px-5 py-4 dark:border-red-600 dark:bg-red-950/60">
          <h2 className="mb-1 text-[10px] font-bold text-red-900 uppercase tracking-widest dark:text-red-300">{t.drug.emergencySigns}</h2>
          <p className="mb-3 text-xs text-red-700 dark:text-red-400">{t.drug.emergencySignsDesc}</p>
          <ul className="space-y-2">
            {drug.emergencySigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800 font-medium dark:text-red-300">
                <span className="text-red-500 flex-shrink-0 dark:text-red-400">⚠</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-2xl bg-white px-5 py-3 shadow-sm text-xs text-slate-400 space-y-0.5 dark:bg-[#1c1c1e] dark:text-[#636366]">
        <p>{t.drug.source}: {drug.source}</p>
        <p>{t.drug.lastReviewed}: {drug.lastReviewed}</p>
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
