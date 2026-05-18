import { useState, useEffect, useRef } from "react";
import type { ApiSearchResult } from "../types/api";
import { searchDrugsLive } from "../services/drugSearch";

export interface UseLiveSearchResult {
  results: ApiSearchResult[];
  loading: boolean;
  error: string | null;
}

interface SearchState {
  results: ApiSearchResult[];
  loading: boolean;
  error: string | null;
}

const IDLE: SearchState = { results: [], loading: false, error: null };

export function useLiveSearch(query: string, debounceMs = 500): UseLiveSearchResult {
  const [state, setState] = useState<SearchState>(IDLE);
  const abortRef = useRef<AbortController | null>(null);
  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) return;

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setState({ results: [], loading: true, error: null });
      try {
        const data = await searchDrugsLive(trimmed);
        setState({ results: data, loading: false, error: null });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setState({ results: [], loading: false, error: "Search failed. Please try again." });
        }
      }
    }, debounceMs);

    return () => { clearTimeout(timer); };
  }, [trimmed, debounceMs]);

  // Return IDLE directly when query is too short — avoids stale state from prior searches
  if (trimmed.length < 2) return IDLE;
  return state;
}
