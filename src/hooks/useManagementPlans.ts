import useSWR from "swr";
import { api, type ManagementPlan, type PaginatedResponse } from "@/lib/api";

export type { ManagementPlan };

export function useManagementPlans() {
  return useSWR<PaginatedResponse<ManagementPlan>>(
    "/api/v1/management-plans",
    () => api.get("/api/v1/management-plans")
  );
}

export function useManagementPlan(id: number | null) {
  return useSWR<ManagementPlan>(
    id ? `/api/v1/management-plans/${id}` : null,
    () => api.get(`/api/v1/management-plans/${id!}`)
  );
}

export function useMyPlan() {
  return useSWR<ManagementPlan | null>(
    "/api/v1/paciente/my-plan",
    () => api.get("/api/v1/paciente/my-plan").catch(() => null)
  );
}
