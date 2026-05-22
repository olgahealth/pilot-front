const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    throw new Error("No autenticado");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error del servidor" }));
    throw new Error(err.message || "Error inesperado");
  }

  if (res.status === 204) return null as T;

  return res.json();
}

export const api = {
  get:    <T>(path: string)                 => request<T>(path),
  post:   <T>(path: string, body?: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(path: string)                 => request<T>(path, { method: "DELETE" }),
};

// ── Tipos compartidos ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  document_type: string;
  document_number: string;
  phone?: string;
  address?: string;
  eps?: string;
  diagnosis_primary?: string;
  status: string;
  tenant_id: number;
  active_plan?: ManagementPlan | null;
}

export interface ManagementPlan {
  id: number;
  title: string;
  diagnosis: string;
  status: string;
  progress?: number;
  start_date: string;
  end_date?: string | null;
  patient?: Patient;
  tasks?: PlanTask[];
  created_by?: { name: string };
}

export interface PlanTask {
  id: number;
  name: string;
  total_sessions: number;
  completed_sessions: number;
  completion_percentage?: number;
  status: string;
  frequency: number;
  frequency_unit: string;
  service_type?: { name: string; category: string };
}

export interface Visit {
  id: number;
  scheduled_date: string;
  window_start: string;
  window_end: string;
  status: string;
  pre_visit_notification_status?: string;
  is_verified?: boolean;
  notes?: string;
  patient?: Patient;
  provider?: {
    id: number;
    specialty?: string;
    user?: { name: string; email?: string };
  };
  evidence?: {
    status: string;
    geofencing_status?: string;
    arrival_timestamp?: string | null;
  } | null;
  confirmation?: {
    response: string;
    responded_at?: string | null;
  } | null;
}
