import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { WarningBanner } from "../shared/WarningBanner";
import { getMatchedRedFlagGroups } from "../../data/symptoms";
import { getDrugById } from "../../data/drugs";
import type { SymptomSuggestion } from "../../types";

function SymptomSuggestionCard({ suggestion }: { suggestion: SymptomSuggestion }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{suggestion.categoryName}</h3>

      {suggestion.exampleDrugs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestion.exampleDrugs.map((id) => {
            const drug = getDrugById(id);
            return drug ? (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/drugs/${id}`)}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                {drug.name}
              </button>
            ) : null;
          })}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Why it may help</p>
          <p className="mt-1 text-sm text-slate-700">{suggestion.whyItHelps}</p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Who should avoid it</p>
          <p className="mt-1 text-sm text-amber-800">{suggestion.whoShouldAvoid}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Key risks</p>
          <p className="mt-1 text-sm text-slate-700">{suggestion.keyRisks}</p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">When to seek medical care</p>
          <p className="mt-1 text-sm text-red-800">{suggestion.whenToSeekCare}</p>
        </div>
      </div>
    </div>
  );
}

export function SymptomChecker() {
  const { symptomInput, setSymptomInput, detectedRedFlags, symptomSuggestions, runSymptomCheck } = useApp();
  const redFlagGroups = getMatchedRedFlagGroups(detectedRedFlags);
  const hasResults = symptomSuggestions.length > 0 || detectedRedFlags.length > 0;

  return (
    <div className="space-y-4">
      <WarningBanner
        level="info"
        title="This tool does not diagnose illness"
        message="MedLens only provides general OTC medication guidance. This is not a substitute for professional medical advice. Always consult a doctor or pharmacist before taking any medication."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="symptom-input" className="mb-2 block text-sm font-medium text-slate-700">
          Describe your symptoms
        </label>
        <textarea
          id="symptom-input"
          rows={4}
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder="e.g. headache, fever, runny nose, stomach ache…"
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={runSymptomCheck}
          disabled={!symptomInput.trim()}
          className="mt-3 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Symptoms
        </button>
      </div>

      {/* Emergency red-flag warnings — shown immediately on input match */}
      {redFlagGroups.length > 0 && (
        <div className="space-y-3">
          {redFlagGroups.map((group, i) => (
            <div key={i} className="rounded-2xl border-2 border-red-500 bg-red-50 p-5">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-base font-bold">Seek Emergency Help</span>
              </div>
              <p className="mt-2 text-sm text-red-800">{group.emergencyLine}</p>
              <div className="mt-3 rounded-lg bg-red-600 px-4 py-3 text-center">
                <p className="text-base font-bold text-white">{group.callAction}</p>
              </div>
            </div>
          ))}
          <p className="text-sm text-slate-500 text-center">
            Do not attempt to self-treat emergency symptoms. Please seek immediate medical care.
          </p>
        </div>
      )}

      {/* Symptom suggestions — only when no red flags */}
      {detectedRedFlags.length === 0 && symptomSuggestions.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700">
            Based on your symptoms, here are some OTC options to consider:
          </p>
          {symptomSuggestions.map((s, i) => (
            <SymptomSuggestionCard key={i} suggestion={s} />
          ))}
        </div>
      )}

      {hasResults === false && symptomInput.trim() && (
        <p className="text-center text-sm text-slate-500">
          Click "Check Symptoms" to see suggestions for your symptoms.
        </p>
      )}
    </div>
  );
}
