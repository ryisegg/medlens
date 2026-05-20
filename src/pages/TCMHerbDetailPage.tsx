import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTCMHerbById, TCM_CATEGORY_EN, TCM_NATURE_COLOR, TCM_NATURE_EN } from '../data/tcmHerbs';

const SEVERITY_STYLE = {
  mild: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
  moderate: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300',
  severe: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
};

const SEVERITY_LABEL: Record<string, string> = {
  mild: '轻度', moderate: '中度', severe: '严重',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-[#1c1c1e]">
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
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

  return (
    <div className="space-y-3 px-4 py-3 pb-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {isZh ? '中药库' : 'TCM Herbs'}
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 py-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{herb.nameZh}</h1>
            <p className="mt-0.5 text-sm text-white/80">{herb.namePinyin}</p>
            <p className="text-sm text-white/80">{herb.nameEn}</p>
            <p className="mt-0.5 text-xs text-white/60 italic">{herb.nameLatin}</p>
            {herb.aliases.length > 0 && (
              <p className="mt-1 text-xs text-white/70">
                {isZh ? '别名：' : 'Also known as: '}{herb.aliases.join('、')}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Properties */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${natureColor}`}>
            {isZh ? `性：${herb.properties.nature}` : `Nature: ${TCM_NATURE_EN[herb.properties.nature]}`}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            {isZh ? `味：${herb.properties.flavor.join('、')}` : `Flavor: ${herb.properties.flavor.join(', ')}`}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            {isZh ? `归经：${herb.properties.meridians.join('、')}` : `Meridians: ${herb.properties.meridians.join(', ')}`}
          </span>
        </div>
      </div>

      {/* Functions & Indications */}
      <Section title={isZh ? '功效' : 'Functions'}>
        <div className="flex flex-wrap gap-2">
          {herb.functions.map(f => (
            <span key={f} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              {f}
            </span>
          ))}
        </div>
      </Section>

      <Section title={isZh ? '主治' : 'Indications'}>
        <BulletList items={herb.indications} />
      </Section>

      {/* Dosage */}
      <Section title={isZh ? '用量用法' : 'Dosage'}>
        <p className="text-sm text-slate-700 dark:text-[#8e8e93]">{herb.dosage}</p>
      </Section>

      {/* Contraindications */}
      {herb.contraindications.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            {isZh ? '⚠ 禁忌 / 注意事项' : '⚠ Contraindications'}
          </p>
          <BulletList items={herb.contraindications} />
        </div>
      )}

      {/* Western Drug Interactions */}
      {herb.interactions.length > 0 && (
        <Section title={isZh ? '中西药相互作用' : 'Drug Interactions'}>
          <div className="space-y-2">
            {herb.interactions.map((ix, i) => (
              <div key={i} className={`rounded-xl border px-3 py-2.5 ${SEVERITY_STYLE[ix.severity]}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{ix.nameZh} <span className="font-normal opacity-70">({ix.name})</span></p>
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
      {herb.commonFormulas.length > 0 && (
        <Section title={isZh ? '常用方剂' : 'Common Formulas'}>
          <div className="flex flex-wrap gap-2">
            {herb.commonFormulas.map(f => (
              <span key={f} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
                {f}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Modern Research */}
      {herb.modernResearch && (
        <Section title={isZh ? '现代研究' : 'Modern Research'}>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8e8e93]">{herb.modernResearch}</p>
        </Section>
      )}

      {/* Notes */}
      {herb.notes && (
        <Section title={isZh ? '临床备注' : 'Clinical Notes'}>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8e8e93]">{herb.notes}</p>
        </Section>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <p className="text-xs text-slate-400 dark:text-[#636366]">
          {isZh
            ? '本信息仅供参考，不构成医疗建议。使用中药前请咨询执业中医师或药剂师。'
            : 'For educational purposes only. Consult a licensed TCM practitioner or pharmacist before use.'}
        </p>
      </div>
    </div>
  );
}
