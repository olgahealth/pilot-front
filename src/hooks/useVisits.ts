import useSWR from "swr";
import { api, type Visit, type PaginatedResponse } from "@/lib/api";

export type { Visit };

export function useVisits(filters?: { date?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.date)   params.set("date",   filters.date);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();

  return useSWR<PaginatedResponse<Visit>>(
    `/api/v1/visits?${query}`,
    () => api.get(`/api/v1/visits?${query}`)
  );
}

export function useMyVisits() {
  return useSWR<Visit[]>(
    "/api/v1/proveedor/my-visits",
    () => api.get("/api/v1/proveedor/my-visits")
  );
}

export function useMyPatientVisits() {
  return useSWR<PaginatedResponse<Visit>>(
    "/api/v1/paciente/my-visits",
    () => api.get("/api/v1/paciente/my-visits")
  );
}

export function useVerifiedVisits(filters?: { from?: string; to?: string }) {
  const params = new URLSearchParams();
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to)   params.set("to",   filters.to);
  const query = params.toString();

  return useSWR<PaginatedResponse<Visit>>(
    `/api/v1/eps/visits/verified?${query}`,
    () => api.get(`/api/v1/eps/visits/verified?${query}`)
  );
}
