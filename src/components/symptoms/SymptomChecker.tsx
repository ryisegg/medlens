import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { WarningBanner } from "../shared/WarningBanner";
import { getMatchedRedFlagGroups } from "../../data/symptoms";
import { getDrugById } from "../../data/drugs";
import { translateDrugNameOnly, translateCategory } from "../../utils/medicalTranslation";
import { fetchAiSymptomAdvice, type AiSymptomAdvice } from "../../services/aiSymptomAdvice";
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
  language: string;
}

function SymptomSuggestionCard({ suggestion, t, language }: SuggestionCardProps) {
  const navigate = useNavigate();
  const ts = t.symptoms;
  const isZh = language === "zh";
  const categoryDisplay = isZh
    ? `${translateCategory(suggestion.categoryName)} (${suggestion.categoryName})`
    : suggestion.categoryName;

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{categoryDisplay}</h3>

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
                {isZh ? `${translateDrugNameOnly(drug.name)} (${drug.name})` : drug.name}
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

function AiAdviceCard({ advice, language }: { advice: AiSymptomAdvice; language: string }) {
  const isZh = language === "zh";

  return (
    <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm dark:border-blue-900/50 dark:bg-[#1c1c1e]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-[#0a84ff]">
            {isZh ? "AI 分诊增强" : "AI triage assist"}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
            {isZh ? "智能建议" : "Smart guidance"}
          </h3>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {isZh ? "测试版" : "Beta"}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700 dark:text-[#c7c7cc]">{advice.summary}</p>

      {advice.redFlags.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
          <p className="text-xs font-bold text-red-700 dark:text-red-300">
            {isZh ? "需要优先排除" : "Check these first"}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-300">
            {advice.redFlags.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}

      {advice.otcCategories.length > 0 && (
        <div className="mt-4 space-y-3">
          {advice.otcCategories.map((category) => (
            <div key={category.name} className="rounded-xl border border-slate-200 p-3 dark:border-[#3a3a3c]">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</h4>
              {category.examples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {category.examples.map((example) => (
                    <span key={example} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]">
                      {example}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-slate-700 dark:text-[#c7c7cc]">{category.rationale}</p>
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                <strong>{isZh ? "避免/先问药师：" : "Avoid or ask first: "}</strong>{category.avoidIf}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#8e8e93]">
                <strong>{isZh ? "风险：" : "Risks: "}</strong>{category.keyRisks}
              </p>
            </div>
          ))}
        </div>
      )}

      {(advice.selfCare.length > 0 || advice.askForMore.length > 0) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {advice.selfCare.length > 0 && (
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-[#2c2c2e]">
              <p className="text-xs font-bold text-slate-600 dark:text-[#c7c7cc]">{isZh ? "自我护理" : "Self-care"}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-[#c7c7cc]">
                {advice.selfCare.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}
          {advice.askForMore.length > 0 && (
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-[#2c2c2e]">
              <p className="text-xs font-bold text-slate-600 dark:text-[#c7c7cc]">{isZh ? "还需要确认" : "Helpful details"}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-[#c7c7cc]">
                {advice.askForMore.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-[#8e8e93]">{advice.disclaimer}</p>
    </div>
  );
}

function NoSuggestionCard({ language }: { language: string }) {
  const isZh = language === "zh";
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30">
      <div className="mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <span>✨</span>
        <h3 className="text-sm font-bold">{isZh ? "智能分诊建议" : "Smart triage guidance"}</h3>
      </div>
      <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
        {isZh
          ? "暂时没有匹配到明确的非处方药类别。请补充症状持续时间、年龄、是否怀孕/哺乳、基础病和正在使用的药物。若症状严重、持续加重或影响呼吸/意识，请优先就医。"
          : "No specific OTC category matched yet. Add duration, age, pregnancy/lactation status, chronic conditions, and current medications. Seek care first if symptoms are severe, worsening, or affect breathing/consciousness."}
      </p>
      <div className="mt-3 grid gap-2 text-xs text-blue-800 dark:text-blue-300">
        <p>{isZh ? "可以这样写：发烧 2 天，38.8 度，成人，没有基础病。" : "Try: fever for 2 days, 101.8°F, adult, no chronic conditions."}</p>
        <p>{isZh ? "这个提示不是诊断，也不会替代医生或药剂师。" : "This is not a diagnosis and does not replace a clinician or pharmacist."}</p>
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
  const isZh = language === "zh";
  const redFlagGroups = getMatchedRedFlagGroups(detectedRedFlags);
  const hasInput = selectedSymptoms.length > 0 || symptomInput.trim().length > 0;
  const [hasChecked, setHasChecked] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<AiSymptomAdvice | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const runAiAdvice = useCallback(async () => {
    if (!hasInput) {
      setAiAdvice(null);
      setAiError(null);
      return;
    }

    const translatedChips = selectedSymptoms.map((chip) => (
      (t.symptoms.chips as Record<string, string>)[chip] ?? chip
    ));

    setAiLoading(true);
    setAiError(null);

    try {
      const advice = await fetchAiSymptomAdvice({
        language,
        freeText: symptomInput,
        selectedSymptoms: translatedChips,
      });
      setAiAdvice(advice);
    } catch (error) {
      setAiAdvice(null);
      setAiError(error instanceof Error ? error.message : "AI advice is unavailable.");
    } finally {
      setAiLoading(false);
    }
  }, [hasInput, language, selectedSymptoms, symptomInput, t.symptoms.chips]);

  function handleCheck() {
    setHasChecked(true);
    runSymptomCheck();
    void runAiAdvice();
  }

  function handleClear() {
    setHasChecked(false);
    setAiAdvice(null);
    setAiError(null);
    clearSelectedSymptoms();
  }

  return (
    <div className="space-y-3 px-4 py-4">
      <WarningBanner
        level="info"
        title={t.symptoms.disclaimer}
        message={t.symptoms.disclaimerDesc}
      />

      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{t.symptoms.selectSymptoms}</p>
          {(selectedSymptoms.length > 0 || symptomInput) && (
            <button type="button" onClick={handleClear} className="text-xs font-medium text-slate-400 dark:text-[#636366]">
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
          onClick={handleCheck}
          disabled={!hasInput}
          className="mt-3 w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white transition disabled:opacity-40 dark:bg-[#0a84ff]"
        >
          {hasChecked ? (isZh ? "重新分析" : "Analyze again") : t.symptoms.checkButton}
        </button>
        {hasInput && (
          <p className="mt-2 text-center text-xs text-slate-400 dark:text-[#636366]">
            {isZh ? "点击按钮后分析症状并获取 AI 建议。" : "Click the button to analyze symptoms and get AI guidance."}
          </p>
        )}
      </div>

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
              <p className="text-sm text-red-800 dark:text-red-300">
                {isZh ? group.emergencyLineZh : group.emergencyLine}
              </p>
              <div className="mt-3 rounded-xl bg-red-600 px-4 py-3 text-center dark:bg-red-700">
                <p className="text-base font-bold text-white">
                  {isZh ? group.callActionZh : group.callAction}
                </p>
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-slate-500 dark:text-[#636366]">
            {isZh ? "紧急症状请勿自行用药处理。" : "Do not attempt to self-treat emergency symptoms."}
          </p>
        </div>
      )}

      {hasChecked && hasInput && detectedRedFlags.length === 0 && aiLoading && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-800 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
          {isZh ? "AI 正在分析症状..." : "AI is reviewing the symptoms..."}
        </div>
      )}

      {hasChecked && hasInput && detectedRedFlags.length === 0 && aiAdvice && (
        <AiAdviceCard advice={aiAdvice} language={language} />
      )}

      {hasChecked && hasInput && detectedRedFlags.length === 0 && aiError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 shadow-sm dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          {isZh
            ? `AI 后端暂时不可用，正在显示本地建议。${aiError}`
            : `AI backend is unavailable, so local guidance is shown. ${aiError}`}
        </div>
      )}

      {detectedRedFlags.length === 0 && symptomSuggestions.length > 0 && (
        <div className="space-y-3">
          <p className="px-1 text-sm font-semibold text-slate-700 dark:text-white">{t.symptoms.results}</p>
          {symptomSuggestions.map((s, i) => (
            <SymptomSuggestionCard key={i} suggestion={s} t={t} language={language} />
          ))}
        </div>
      )}

      {hasChecked && hasInput && detectedRedFlags.length === 0 && symptomSuggestions.length === 0 && !aiAdvice && (
        <NoSuggestionCard language={language} />
      )}
    </div>
  );
}
