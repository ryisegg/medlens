import type { TCMHerb } from '../../types/tcm';
import { TCM_CATEGORY_EN, TCM_NATURE_COLOR, TCM_NATURE_EN } from '../../data/tcmHerbs';

interface Props {
  herb: TCMHerb;
  language: 'en' | 'zh';
  onClick: () => void;
}

export function TCMHerbCard({ herb, language, onClick }: Props) {
  const isZh = language === 'zh';
  const categoryLabel = isZh ? herb.category : TCM_CATEGORY_EN[herb.category];
  const natureColor = TCM_NATURE_COLOR[herb.properties.nature] ?? TCM_NATURE_COLOR['平'];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-white px-4 py-3.5 text-left shadow-sm transition active:scale-[0.98] dark:bg-[#1c1c1e]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">{herb.nameZh}</span>
            <span className="text-xs text-slate-400 dark:text-[#636366]">{herb.namePinyin}</span>
          </div>
          {!isZh && (
            <p className="text-xs text-slate-500 dark:text-[#8e8e93]">{herb.nameEn}</p>
          )}
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed dark:text-[#8e8e93] line-clamp-2">
            {herb.functions.slice(0, 3).join('、')}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            {categoryLabel}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${natureColor}`}>
            {isZh ? herb.properties.nature : TCM_NATURE_EN[herb.properties.nature]}
          </span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {herb.properties.flavor.map(f => (
          <span key={f} className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-[#2c2c2e] dark:text-[#8e8e93]">
            {isZh ? f : f}
          </span>
        ))}
        {herb.properties.meridians.slice(0, 3).map(m => (
          <span key={m} className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
            {m}经
          </span>
        ))}
      </div>
    </button>
  );
}
