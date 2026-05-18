import { useQuery } from "@tanstack/react-query";
import { fetchDrugDetail } from "../services/drugSearch";
import type { ApiDrugDetail } from "../types/api";

export interface UseApiDrugResult {
  drug: ApiDrugDetail | null;
  loading: boolean;
  error: string | null;
}

export function useApiDrug(name: string): UseApiDrugResult {
  const { data, isPending, isError } = useQuery({
    queryKey: ["drugDetail", name],
    queryFn: async () => {
      const detail = await fetchDrugDetail(name);
      if (!detail) throw new Error("No verified medication information found.");
      return detail;
    },
    enabled: !!name,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });

  return {
    drug: data ?? null,
    loading: isPending,
    error: isError ? "No verified medication information found for this drug." : null,
  };
}
