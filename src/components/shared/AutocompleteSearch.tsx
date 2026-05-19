import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchRxNorm, getSpellingSuggestions } from "../../services/rxnormApi";
import { searchDrugs } from "../../data/drugs";
import { useApp } from "../../context/AppContext";
import { DropdownSkeleton } from "./DrugCardSkeleton";
import type { ApiSearchResult } from "../../types/api";
import type { Drug } from "../../types";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

type LocalHit = { kind: "local"; drug: Drug };
type LiveHit = { kind: "live"; result: ApiSearchResult };
type Hit = LocalHit | LiveHit;

const TTY_LABEL_EN: Record<string, string> = {
  SBD: "Brand", SBN: "Brand", BN: "Brand",
  SCD: "Generic", GPCK: "Generic",
  IN: "Ingredient", MIN: "Ingredient",
};

const TTY_LABEL_ZH: Record<string, string> = {
  SBD: "品牌药", SBN: "品牌药", BN: "品牌药",
  SCD: "通用药", GPCK: "通用药",
  IN: "活性成分", MIN: "活性成分",
};

function hitPath(h: Hit): string {
  return h.kind === "local"
    ? `/drugs/${h.drug.id}`
    : `/drugs/api/${encodeURIComponent(h.result.rxcui)}`;
}

function hitLabel(h: Hit): string {
  return h.kind === "local" ? h.drug.name : h.result.name;
}

function hitSub(h: Hit, isZh: boolean): string {
  if (h.kind === "local") return h.drug.genericName;
  const label = isZh ? TTY_LABEL_ZH[h.result.tty] : TTY_LABEL_EN[h.result.tty];
  return label ?? h.result.tty;
}

function hitBadge(h: Hit, isZh: boolean): { text: string; color: string } {
  if (h.kind === "local") {
    const otcText = isZh ? "非处方" : "OTC";
    const rxText = isZh ? "处方药" : "Rx";
    return {
      text: h.drug.otcOrRx === "OTC" ? otcText : rxText,
      color: h.drug.otcOrRx === "OTC"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    };
  }
  return { text: "RxNorm", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
}

export function AutocompleteSearch({ value, onChange, placeholder, autoFocus, className = "" }: Props) {
  const navigate = useNavigate();
  const { language } = useApp();
  const isZh = language === "zh";
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [closedAtQuery, setClosedAtQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const trimmed = debouncedValue.trim();
  const inputTrimmed = value.trim();

  const { data: liveHits = [], isPending: liveLoading } = useQuery({
    queryKey: ["rxnorm", trimmed],
    queryFn: () => searchRxNorm(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const localMatches: Drug[] = inputTrimmed.length >= 2
    ? searchDrugs(value.trim()).slice(0, 3)
    : [];

  const localNames = new Set(localMatches.map((d) => d.name.toLowerCase()));
  const filteredLive = liveHits.filter((r) => !localNames.has(r.name.toLowerCase())).slice(0, 5);

  const hits: Hit[] = [
    ...localMatches.map((drug): LocalHit => ({ kind: "local", drug })),
    ...filteredLive.map((result): LiveHit => ({ kind: "live", result })),
  ];

  const noResults = !liveLoading && hits.length === 0 && trimmed.length >= 3 && trimmed === inputTrimmed;

  const { data: spellingSuggestions = [] } = useQuery({
    queryKey: ["spelling", trimmed],
    queryFn: () => getSpellingSuggestions(trimmed),
    enabled: noResults,
    staleTime: 60 * 60 * 1000,
  });

  const hasContent = hits.length > 0 || liveLoading || spellingSuggestions.length > 0;
  const isOpen = hasContent && inputTrimmed.length >= 2 && inputTrimmed !== closedAtQuery;

  const closeDropdown = useCallback(() => {
    setClosedAtQuery(value.trim());
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setClosedAtQuery(value.trim());
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  const selectHit = useCallback((path: string) => {
    setClosedAtQuery(value.trim());
    navigate(path);
  }, [navigate, value]);

  function handleChange(v: string) {
    setClosedAtQuery("");
    setActiveIndex(-1);
    onChange(v);
  }

  function submitFirstHit() {
    if (hits.length > 0) {
      const selected = activeIndex >= 0 && activeIndex < hits.length ? hits[activeIndex] : hits[0];
      selectHit(hitPath(selected));
      return;
    }
    closeDropdown();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        if (!isOpen) setClosedAtQuery("");
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
        break;
      case "ArrowUp":
        if (!isOpen) return;
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        submitFirstHit();
        break;
      case "Escape":
        closeDropdown();
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-[#636366] pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setClosedAtQuery("")}
          placeholder={placeholder ?? "Search medications…"}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-activedescendant={activeIndex >= 0 ? `hit-${activeIndex}` : undefined}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:border-[#0a84ff] dark:focus:bg-[#2c2c2e]"
        />

        {value && (
          <button
            type="button"
            onClick={() => { handleChange(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300 dark:bg-[#3a3a3c] dark:text-[#8e8e93]"
            aria-label="Clear search"
            title="Clear search"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[46vh] overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#1c1c1e] dark:ring-white/10"
        >
          {liveLoading && hits.length === 0 && <DropdownSkeleton />}

          {hits.map((hit, i) => {
            const badge = hitBadge(hit, isZh);
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                id={`hit-${i}`}
                role="option"
                type="button"
                aria-selected={isActive}
                onClick={() => selectHit(hitPath(hit))}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-blue-50 dark:bg-[#0a84ff]/10"
                    : "hover:bg-slate-50 dark:hover:bg-[#2c2c2e]"
                } ${i === 0 ? "" : "border-t border-slate-100 dark:border-[#2c2c2e]"}`}
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm dark:bg-blue-900/30">
                  💊
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{hitLabel(hit)}</p>
                  <p className="truncate text-xs text-slate-400 dark:text-[#636366]">{hitSub(hit, isZh)}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}>
                  {badge.text}
                </span>
              </button>
            );
          })}

          {!liveLoading && hits.length === 0 && spellingSuggestions.length > 0 && (
            <div className="px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-slate-400 dark:text-[#636366]">Did you mean?</p>
              <div className="flex flex-wrap gap-2">
                {spellingSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { handleChange(s); }}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-[#2c2c2e] dark:text-[#0a84ff]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!liveLoading && hits.length === 0 && spellingSuggestions.length === 0 && trimmed === inputTrimmed && trimmed.length >= 2 && (
            <div className="px-4 py-5 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-[#8e8e93]">No medications found</p>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-[#636366]">Try a different name or ingredient</p>
            </div>
          )}

          {liveLoading && hits.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2 dark:border-[#2c2c2e]">
              <p className="text-xs text-slate-400 dark:text-[#636366]">Loading more from RxNorm…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
