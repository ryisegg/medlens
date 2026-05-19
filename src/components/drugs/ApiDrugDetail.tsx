import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiDrugDetail } from "../../types/api";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { analyzeDrugRisks } from "../../services/drugIntelligence";
import { lookupZhDrug } from "../../data/zhDrugNames";
import { translateSections } from "../../services/translation";

interface Props { drug: ApiDrugDetail }

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ icon, children, zhLabel }: { icon: string; children: React.ReactNode; zhLabel?: string }) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-base leading-none">{icon}</span>
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#636366]">
        {children}{zhLabel && <span className="ml-1 normal-case not-italic">/ {zhLabel}</span>}
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

function IntelChip({ icon, label, sublabel, color }: { icon: string; label: string; sublabel?: string; color: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 ${color}`}>
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold leading-tight">{label}</p>
        {sublabel && <p className="mt-0.5 text-[11px] leading-snug opacity-80">{sublabel}</p>}
      </div>
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
  const [translatedTextById, setTranslatedTextById] = useState<Record<string, string>>({});
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationDisclaimer, setTranslationDisclaimer] = useState<string | null>(null);

  const isZh = language === "zh";
  const risks = useMemo(() => analyzeDrugRisks(drug), [drug]);
  const zhEntry = useMemo(() => lookupZhDrug(drug.genericName ?? drug.name), [drug.genericName, drug.name]);

  const translatableSections = useMemo(() => [
    { id: "description", text: drug.description ?? "" },
    { id: "uses", text: drug.indicationsAndUsage ?? "" },
    { id: "dosage", text: drug.dosageAndAdministration ?? "" },
    { id: "warnings", text: drug.warnings ?? "" },
    { id: "contraindications", text: drug.contraindications ?? "" },
    { id: "adverseReactions", text: drug.adverseReactions ?? "" },
    { id: "drugInteractions", text: drug.drugInteractions ?? "" },
    { id: "pregnancy", text: drug.pregnancyInfo ?? "" },
    { id: "nursing", text: drug.nursingMotherInfo ?? "" },
    { id: "children", text: drug.keepOutOfReachOfChildren ?? "" },
  ].filter((section) => section.text.trim().length > 0), [drug]);

  const hasTranslations = Object.keys(translatedTextById).length > 0;
  const translated = (id: string, fallback: string) => isZh ? (translatedTextById[id] ?? fallback) : fallback;

  const hasIntelWarnings =
    risks.hasAlcoholWarning || risks.hasLiverWarning || risks.hasKidneyWarning || risks.hasDuplicateIngredientWarning;

  async function handleTranslate() {
    if (translationLoading || translatableSections.length === 0) return;

    setTranslationLoading(true);
    setTranslationError(null);

    try {
      const result = await translateSections({
        targetLanguage: "zh",
        context: `${drug.name} medication label`,
        sections: translatableSections,
      });
      setTranslatedTextById(Object.fromEntries(result.translations.map((item) => [item.id, item.text])));
      setTranslationDisclaimer(result.disclaimer);
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : "Translation is unavailable.");
    } finally {
      setTranslationLoading(false);
    }
  }

  return (
    <div className="space-y-3 px-4 py-4">
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
            {hasTranslations && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]">
                AI 中文翻译
              </span>
            )}
          </div>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{drug.name}</h1>

        {language === "zh" && zhEntry && (
          <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-[#0a84ff]">{zhEntry.genericZh}</p>
        )}

        {drug.genericName && drug.genericName.toLowerCase() !== drug.name.toLowerCase() && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            <span className="font-medium">{isZh ? "通用名 (Generic)" : t.drug.genericName}:</span>{" "}
            <span className="text-slate-700 dark:text-white">{drug.genericName}</span>
            {isZh && zhEntry && (
              <span className="ml-1.5 text-blue-500 dark:text-[#0a84ff]">({zhEntry.genericZh})</span>
            )}
          </p>
        )}

        {drug.brandNames.length > 0 && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            <span className="font-medium">{isZh ? "商品名 (Brand)" : t.drug.brandNames}:</span>{" "}
            <span className="text-slate-700 dark:text-white">
              {drug.brandNames.slice(0, 5).join(", ")}
            </span>
          </p>
        )}

        {isZh && zhEntry?.brandZh && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-[#8e8e93]">
            常用品名：<span className="font-medium text-slate-700 dark:text-white">{zhEntry.brandZh}</span>
          </p>
        )}

        {language === "zh" && zhEntry?.categoryZh && (
          <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
            {zhEntry.categoryZh}
          </span>
        )}

        {drug.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">
            {translated("description", drug.description)}
          </p>
        )}

        {isZh && translatableSections.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translationLoading}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {translationLoading ? "正在翻译..." : hasTranslations ? "重新翻译本页重点" : "翻译本页重点"}
            </button>
            {translationError && (
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                翻译暂时不可用：{translationError}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
          ⚕️ {translationDisclaimer ?? t.api.disclaimer}
        </p>
      </div>

      {hasIntelWarnings && (
        <div>
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
            {language === "zh" ? "风险提示" : "Risk Signals"}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {risks.hasDuplicateIngredientWarning && (
              <IntelChip
                icon="⚠️"
                label={language === "zh" ? "重复成分警告" : "Duplicate Ingredient Warning"}
                sublabel={risks.duplicateIngredientText}
                color="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
              />
            )}
            {risks.hasAlcoholWarning && (
              <IntelChip
                icon="🍺"
                label={language === "zh" ? "避免饮酒" : "Alcohol Interaction"}
                sublabel={language === "zh" ? "服用此药期间请勿饮酒，可能引发严重不良反应。" : risks.alcoholWarningText}
                color="border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300"
              />
            )}
            {risks.hasLiverWarning && (
              <IntelChip
                icon="🫀"
                label={language === "zh" ? "肝脏注意事项" : "Liver Caution"}
                sublabel={language === "zh" ? "肝病患者服用前请咨询医生。" : risks.liverWarningText}
                color="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
              />
            )}
            {risks.hasKidneyWarning && (
              <IntelChip
                icon="🫘"
                label={language === "zh" ? "肾脏注意事项" : "Kidney Caution"}
                sublabel={language === "zh" ? "肾病患者服用前请咨询医生。" : risks.kidneyWarningText}
                color="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
              />
            )}
          </div>
        </div>
      )}

      {(drug.activeIngredients?.length || drug.dosageForms?.length) ? (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            {drug.activeIngredients && drug.activeIngredients.length > 0 && (
              <div>
                <SectionLabel icon="🔬" zhLabel={isZh ? "活性成分" : undefined}>
                  {language === "zh" ? "Active Ingredients" : t.drug.activeIngredient}
                </SectionLabel>
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
                <SectionLabel icon="💊" zhLabel={isZh ? "剂型" : undefined}>
                  {language === "zh" ? "Dosage Forms" : t.drug.dosageForms}
                </SectionLabel>
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

      {drug.indicationsAndUsage && (
        <Card>
          <SectionLabel icon="✅" zhLabel={isZh ? "用途" : undefined}>
            {language === "zh" ? "Uses" : t.drug.uses}
          </SectionLabel>
          <LongText text={translated("uses", drug.indicationsAndUsage)} />
        </Card>
      )}

      {drug.dosageAndAdministration && (
        <Card>
          <SectionLabel icon="📏" zhLabel={isZh ? "用法用量" : undefined}>
            {language === "zh" ? "Dosage & Administration" : t.api.dosageAndAdmin}
          </SectionLabel>
          <LongText text={translated("dosage", drug.dosageAndAdministration)} />
        </Card>
      )}

      {drug.warnings && (
        <WarningSection
          icon="⚠️"
          title={isZh ? "Warnings / 警告" : t.api.warnings}
          text={translated("warnings", drug.warnings)}
          accentClass="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
        />
      )}

      {drug.contraindications && (
        <WarningSection
          icon="🚫"
          title={isZh ? "Do Not Use / 禁忌人群" : t.drug.contraindications}
          text={translated("contraindications", drug.contraindications)}
          accentClass="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
        />
      )}

      {drug.adverseReactions && (
        <Card>
          <SectionLabel icon="🩺" zhLabel={isZh ? "副作用" : undefined}>
            {language === "zh" ? "Side Effects" : t.drug.sideEffects}
          </SectionLabel>
          <BulletList text={translated("adverseReactions", drug.adverseReactions)} />
        </Card>
      )}

      {drug.drugInteractions && (
        <Card>
          <SectionLabel icon="⚡" zhLabel={isZh ? "药物相互作用" : undefined}>
            {language === "zh" ? "Drug Interactions" : t.drug.interactions}
          </SectionLabel>
          <LongText text={translated("drugInteractions", drug.drugInteractions)} />
        </Card>
      )}

      {(drug.pregnancyInfo || drug.nursingMotherInfo) && (
        <Card>
          <SectionLabel icon="🤰" zhLabel={isZh ? "妊娠期与哺乳期" : undefined}>
            {language === "zh" ? "Pregnancy & Breastfeeding" : t.drug.pregnancy}
          </SectionLabel>
          <div className="space-y-3">
            {drug.pregnancyInfo && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-[#636366]">
                  {isZh ? "Pregnancy / 妊娠期" : t.drug.pregnancyNote}
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">
                  {translated("pregnancy", drug.pregnancyInfo)}
                </p>
              </div>
            )}
            {drug.nursingMotherInfo && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-[#636366]">
                  {isZh ? "Nursing Mothers / 哺乳期" : t.api.nursingMothers}
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">
                  {translated("nursing", drug.nursingMotherInfo)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {drug.keepOutOfReachOfChildren && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-[#3a3a3c] dark:bg-[#1c1c1e]">
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">👶</span>
            <p className="text-sm text-slate-700 dark:text-[#8e8e93]">
              {translated("children", drug.keepOutOfReachOfChildren)}
            </p>
          </div>
        </div>
      )}

      <Card className="text-xs text-slate-400 dark:text-[#636366] space-y-1">
        <p>{t.drug.source}: {SOURCE_LABEL[drug.source]}</p>
        {drug.sourceUrl && (
          <p>
            {t.api.viewFull}:{" "}
            <span className="text-blue-500 dark:text-[#0a84ff] break-all">{drug.sourceUrl}</span>
          </p>
        )}
        <p>{t.drug.lastReviewed}: {drug.lastUpdated}</p>
        <p className="pt-1 border-t border-slate-100 dark:border-[#2c2c2e]">
          <a
            href={`https://www.nmpa.gov.cn/datasearch/search-info.html?type=drugs&name=${encodeURIComponent(zhEntry?.genericZh ?? drug.genericName ?? drug.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-[#0a84ff] hover:underline"
          >
            🔍 查看国家药监局信息{zhEntry?.genericZh ? `（${zhEntry.genericZh}）` : ""}
          </a>
        </p>
      </Card>

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
