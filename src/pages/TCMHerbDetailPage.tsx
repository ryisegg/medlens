import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTCMHerbById, TCM_CATEGORY_EN, TCM_NATURE_COLOR, TCM_NATURE_EN, TCM_FLAVOR_EN } from '../data/tcmHerbs';
import { translateMeridian, translateTCMFunction, translateTCMIndication } from '../data/tcmDictionary';

const SEVERITY_STYLE = {
  mild:     'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
  moderate: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300',
  severe:   'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
};

const SEVERITY_LABEL: Record<string, string> = {
  mild: '轻度', moderate: '中度', severe: '严重',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-soft dark:bg-[#1c1c1e]">
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-[#8e8e93]">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TCMHerbDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const isZh = language === 'zh';

  const herb = id ? getTCMHerbById(id) : undefined;

  if (!herb) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-4xl">🌿</div>
        <p className="font-semibold text-slate-700 dark:text-white">
          {isZh ? '未找到该药材' : 'Herb not found'}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {isZh ? '返回' : 'Go back'}
        </button>
      </div>
    );
  }

  const natureColor = TCM_NATURE_COLOR[herb.properties.nature] ?? TCM_NATURE_COLOR['平'];
  const categoryLabel = isZh ? herb.category : TCM_CATEGORY_EN[herb.category];

  // ── Bilingual helpers ────────────────────────────────────────────────────
  const functions = isZh
    ? herb.functions
    : (herb.functionsEn ?? herb.functions.map(translateTCMFunction));

  const indications = isZh
    ? herb.indications
    : (herb.indicationsEn ?? herb.indications.map(translateTCMIndication));

  const contraindications = isZh
    ? herb.contraindications
    : (herb.contraindicationsEn ?? herb.contraindications);

  const commonFormulas = isZh
    ? herb.commonFormulas
    : (herb.commonFormulasEn ?? herb.commonFormulas);

  const dosage = isZh ? herb.dosage : (herb.dosageEn ?? herb.dosage);
  const modernResearch = isZh ? herb.modernResearch : (herb.modernResearchEn ?? herb.modernResearch);
  const notes = isZh ? herb.notes : (herb.notesEn ?? herb.notes);
  const aliases = isZh ? herb.aliases : (herb.aliasesEn ?? herb.aliases);

  // Whether any English translation is missing — show subtle banner if so
  const missingEn = !isZh && (
    !herb.functionsEn || !herb.indicationsEn || !herb.dosageEn ||
    !herb.contraindicationsEn || !herb.notesEn || !herb.modernResearchEn
  );

  return (
    <motion.div
      className="space-y-3 px-4 py-3 pb-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 active:scale-95"
      >
        <ChevronLeft size={16} strokeWidth={2.2} />
        {isZh ? '中药库' : 'TCM Herbs'}
      </button>

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 py-5 text-white shadow-medium">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-2 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight">{herb.nameZh}</h1>
            <p className="mt-0.5 text-sm text-white/80">{herb.namePinyin}</p>
            <p className="text-sm text-white/80">{herb.nameEn}</p>
            <p className="mt-0.5 text-xs italic text-white/60">{herb.nameLatin}</p>
            {aliases.length > 0 && (
              <p className="mt-1.5 text-xs text-white/70">
                {isZh ? '别名：' : 'Also known as: '}{aliases.join(isZh ? '、' : ', ')}
              </p>
            )}
          </div>
          <span className="flex-shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {categoryLabel}
          </span>
        </div>

        {/* Properties */}
        <div className="relative mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${natureColor}`}>
            {isZh ? `性：${herb.properties.nature}` : `Nature: ${TCM_NATURE_EN[herb.properties.nature]}`}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {isZh
              ? `味：${herb.properties.flavor.join('、')}`
              : `Flavor: ${herb.properties.flavor.map(f => TCM_FLAVOR_EN[f]).join(', ')}`}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {isZh
              ? `归经：${herb.properties.meridians.join('、')}`
              : `Meridians: ${herb.properties.meridians.map(translateMeridian).join(', ')}`}
          </span>
        </div>
      </div>

      {/* Translation status banner (English only, when partial) */}
      {missingEn && (
        <div className="rounded-2xl border border-blue-200/70 bg-blue-50 px-3.5 py-2.5 dark:border-blue-700/40 dark:bg-blue-950/20">
          <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300">
            <span className="font-semibold">ℹ Partial translation.</span> Some fields fall back to Chinese with auto-translation. Full manual translation prioritizes high-frequency herbs.
          </p>
        </div>
      )}

      {/* Functions */}
      <Section title={isZh ? '功效' : 'Functions'}>
        <div className="flex flex-wrap gap-2">
          {functions.map((f, i) => (
            <span key={i} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              {f}
            </span>
          ))}
        </div>
      </Section>

      {/* Indications */}
      <Section title={isZh ? '主治' : 'Indications'}>
        <BulletList items={indications} />
      </Section>

      {/* Dosage */}
      <Section title={isZh ? '用量用法' : 'Dosage'}>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-[#8e8e93]">{dosage}</p>
      </Section>

      {/* Contraindications */}
      {contraindications.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-4 dark:border-amber-700/40 dark:bg-amber-950/20">
          <div className="mb-2.5 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-400">
              {isZh ? '禁忌 / 注意事项' : 'Contraindications'}
            </p>
          </div>
          <BulletList items={contraindications} />
        </div>
      )}

      {/* Drug Interactions */}
      {herb.interactions.length > 0 && (
        <Section title={isZh ? '中西药相互作用' : 'Drug Interactions'}>
          <div className="space-y-2">
            {herb.interactions.map((ix, i) => (
              <div key={i} className={`rounded-xl border px-3 py-2.5 ${SEVERITY_STYLE[ix.severity]}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    {isZh
                      ? <>{ix.nameZh} <span className="font-normal opacity-70">({ix.name})</span></>
                      : <>{ix.name} <span className="font-normal opacity-70">({ix.nameZh})</span></>
                    }
                  </p>
                  <span className="flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                    {isZh ? SEVERITY_LABEL[ix.severity] : ix.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed">{isZh ? ix.noteZh : ix.note}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Common Formulas */}
      {commonFormulas.length > 0 && (
        <Section title={isZh ? '常用方剂' : 'Common Formulas'}>
          <div className="flex flex-wrap gap-2">
            {commonFormulas.map((f, i) => (
              <span key={i} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
                {f}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Modern Research */}
      {modernResearch && (
        <Section title={isZh ? '现代研究' : 'Modern Research'}>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8e8e93]">{modernResearch}</p>
        </Section>
      )}

      {/* Notes */}
      {notes && (
        <Section title={isZh ? '临床备注' : 'Clinical Notes'}>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8e8e93]">{notes}</p>
        </Section>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-white/8 dark:bg-[#1c1c1e]">
        <p className="text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          {isZh
            ? '本信息仅供参考，不构成医疗建议。使用中药前请咨询执业中医师或药剂师。'
            : 'For educational purposes only. Consult a licensed TCM practitioner or pharmacist before use.'}
        </p>
      </div>
    </motion.div>
  );
}
