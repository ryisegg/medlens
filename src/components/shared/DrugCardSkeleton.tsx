export function DrugCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-[#2c2c2e]" />
          <div className="h-3 w-1/2 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          <div className="h-3 w-4/5 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
        </div>
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-12 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
        <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
      </div>
    </div>
  );
}

export function DrugDetailSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4 animate-pulse">
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-[#2c2c2e]" />
          <div className="h-5 w-28 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
        </div>
        <div className="h-7 w-2/3 rounded-full bg-slate-200 dark:bg-[#2c2c2e]" />
        <div className="mt-2 h-4 w-1/2 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          <div className="h-3 w-4/5 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          <div className="h-3 w-3/4 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-[#2c2c2e] mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
            <div className="h-3 w-5/6 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DropdownSkeleton() {
  return (
    <div className="px-3 py-2 space-y-1 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-2/3 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
            <div className="h-2.5 w-1/2 rounded-full bg-slate-100 dark:bg-[#2c2c2e]" />
          </div>
        </div>
      ))}
    </div>
  );
}
