interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = "Search medications…", onSubmit, autoFocus }: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className="relative"
    >
      <svg
        className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-[#636366]"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:border-[#0a84ff] dark:focus:ring-blue-900/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#636366]"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}
