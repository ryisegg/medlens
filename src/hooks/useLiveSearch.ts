import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRxNorm } from "../services/rxnormApi";
import type { ApiSearchResult } from "../types/api";

export interface UseLiveSearchResult {
  results: ApiSearchResult[];
  loading: boolean;
  error: string | null;
}

export function useLiveSearch(query: string): UseLiveSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const trimmed = debouncedQuery.trim();

  const { data, isPending, isError } = useQuery({
    queryKey: ["drugSearch", trimmed],
    queryFn: () => searchRxNorm(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 6 * 60 * 60 * 1000,
  });

  if (trimmed.length < 2) return { results: [], loading: false, error: null };

  return {
    results: data ?? [],
    loading: isPending,
    error: isError ? "Search failed. Please try again." : null,
  };
}
