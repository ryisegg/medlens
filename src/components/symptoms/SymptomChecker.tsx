import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { WarningBanner } from "../shared/WarningBanner";
import { getMatchedRedFlagGroups } from "../../data/symptoms";
import { getDrugById } from "../../data/drugs";
import type { SymptomSuggestion } from "../../types";
import type { Translations } from "../../i18n";

const CHIPS = [
  "fever", "headache", "cough", "allergy", "stomachPain",
  "diarrhea", "soreThroat", "insomnia", "nausea", "rash",
  "runnyNose", "bodyAche", "backPain", "jointPain", "constipation",
  "eyeIrritation", "periodPain", "toothache", "anxiety", "fatigue",
] as const;

const CHIP_ICONS: Record<string, string> = {
  fever: "🌡️", headache: "🤕", cough: "😮‍💨", allergy: "🤧",
  stomachPain: "🫁", diarrhea: "💧", soreThroat: "🗣️", insomnia: "😴",
  nausea: "🤢", rash: "🧴", runnyNose: "💨", bodyAche: "💪",
  backPain: "🦴", jointPain: "🦵", constipation: "🫙", eyeIrritation: "👁️",
  periodPain: "🩸", toothache: "🦷", anxiety: "😰", fatigue: "😓",
};

interface SuggestionCardProps {
  suggestion: SymptomSuggestion;
  t: Translations;
}

function SymptomSuggestionCard({ suggestion, t }: SuggestionCardProps) {
  const navigate = useNavigate();
  const ts = t.symptoms;

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{suggestion.categoryName}</h3>

      {suggestion.exampleDrugs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestion.exampleDrugs.map((id) => {
            const drug = getDrugById(id);
            return drug ? (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/drugs/${id}`)}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-[#0a84ff]"
              >
                {drug.name}
              </button>
            ) : null;
          })}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">{ts.whyItHelps}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-[#8e8e93]">{suggestion.whyItHelps}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">{ts.whoShouldAvoid}</p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{suggestion.whoShouldAvoid}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">{ts.keyRisks}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-[#8e8e93]">{suggestion.keyRisks}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">{ts.whenToSeekCare}</p>
          <p className="mt-1 text-sm text-red-800 dark:text-red-300">{suggestion.whenToSeekCare}</p>
        </div>
      </div>
    </div>
  );
}

export function SymptomChecker() {
  const {
    language, symptomInput, setSymptomInput,
    selectedSymptoms, toggleSymptom, clearSelectedSymptoms,
    detectedRedFlags, symptomSuggestions, runSymptomCheck,
  } = useApp();
  const t = getTranslations(language);
  const redFlagGroups = getMatchedRedFlagGroups(detectedRedFlags);
  const hasInput = selectedSymptoms.length > 0 || symptomInput.trim().length > 0;

  return (
    <div className="space-y-3 px-4 py-4">
      <WarningBanner
        level="info"
        title={t.symptoms.disclaimer}
        message={t.symptoms.disclaimerDesc}
      />

      {/* Chip selection + free text */}
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{t.symptoms.selectSymptoms}</p>
          {(selectedSymptoms.length > 0 || symptomInput) && (
            <button type="button" onClick={clearSelectedSymptoms} className="text-xs font-medium text-slate-400 dark:text-[#636366]">
              {t.symptoms.clearButton}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            const isSelected = selectedSymptoms.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleSymptom(chip)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm dark:bg-[#0a84ff]"
                    : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
                }`}
              >
                <span>{CHIP_ICONS[chip]}</span>
                <span>{t.symptoms.chips[chip]}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 mb-2 text-xs font-medium text-slate-400 dark:text-[#636366]">{t.symptoms.orType}</p>
        <textarea
          rows={3}
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder={t.symptoms.noSelection}
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:border-[#0a84ff]"
        />

        <button
          type="button"
          onClick={runSymptomCheck}
          disabled={!hasInput}
          className="mt-3 w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white transition disabled:opacity-40 dark:bg-[#0a84ff]"
        >
          {t.symptoms.checkButton}
        </button>
      </div>

      {/* Emergency red-flag banners */}
      {redFlagGroups.length > 0 && (
        <div className="space-y-3">
          {redFlagGroups.map((group, i) => (
            <div key={i} className="rounded-2xl border-2 border-red-500 bg-red-50 p-5 dark:border-red-600 dark:bg-red-950/60">
              <div className="flex items-center gap-2 text-red-800 mb-2 dark:text-red-300">
                <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-base font-bold">{t.warnings.emergency}</span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-300">{group.emergencyLine}</p>
              <div className="mt-3 rounded-xl bg-red-600 px-4 py-3 text-center dark:bg-red-700">
                <p className="text-base font-bold text-white">{group.callAction}</p>
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-slate-500 dark:text-[#636366]">
            Do not attempt to self-treat emergency symptoms.
          </p>
        </div>
      )}

      {/* Drug suggestions */}
      {detectedRedFlags.length === 0 && symptomSuggestions.length > 0 && (
        <div className="space-y-3">
          <p className="px-1 text-sm font-semibold text-slate-700 dark:text-white">{t.symptoms.results}</p>
          {symptomSuggestions.map((s, i) => (
            <SymptomSuggestionCard key={i} suggestion={s} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
