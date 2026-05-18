import { useState, useEffect } from "react";
import type { ApiDrugDetail } from "../types/api";
import { fetchDrugDetail } from "../services/drugSearch";

export interface UseApiDrugResult {
  drug: ApiDrugDetail | null;
  loading: boolean;
  error: string | null;
}

interface DrugState {
  drug: ApiDrugDetail | null;
  loading: boolean;
  error: string | null;
  fetchedFor: string;
}

export function useApiDrug(name: string): UseApiDrugResult {
  const [state, setState] = useState<DrugState>({
    drug: null, loading: false, error: null, fetchedFor: "",
  });

  useEffect(() => {
    if (!name) return;

    fetchDrugDetail(name)
      .then((detail) => {
        if (!detail) {
          setState({ drug: null, loading: false, error: "No verified medication information found.", fetchedFor: name });
        } else {
          setState({ drug: detail, loading: false, error: null, fetchedFor: name });
        }
      })
      .catch(() => {
        setState({ drug: null, loading: false, error: "Failed to load medication data. Please try again.", fetchedFor: name });
      });
  }, [name]);

  // While a new name is being fetched, show loading state
  if (state.fetchedFor !== name) return { drug: null, loading: true, error: null };
  return state;
}
