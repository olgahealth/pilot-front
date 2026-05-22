import useSWR from "swr";
import { api, type Patient, type ManagementPlan, type PaginatedResponse } from "@/lib/api";

export type { Patient, ManagementPlan };

export function usePatients(page = 1) {
  return useSWR<PaginatedResponse<Patient>>(
    `/api/v1/patients?page=${page}`,
    () => api.get(`/api/v1/patients?page=${page}`)
  );
}

export function usePatient(id: number | null) {
  return useSWR<Patient>(
    id ? `/api/v1/patients/${id}` : null,
    () => api.get(`/api/v1/patients/${id!}`)
  );
}
