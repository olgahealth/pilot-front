export type Riesgo    = "alto" | "medio" | "bajo";
export type Tendencia = "mejorando" | "estable" | "deteriorando";
export type Estado    = "cumplido" | "pendiente" | "no_cumplido";

export interface Plan {
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  medico_solicitante: string;
  hospital: string;
  costo_estimado: number;
  urgencia: string;
  estado_solicitud: string;
  fecha_solicitud: string;
  cie_codigo?: string | null;
  cie_version?: string | null;
}

export interface TimelineItem {
  id: number;
  fecha: string;
  servicio: string;
  profesional: string;
  entidad: string;
  estado: Estado;
  nota?: string | null;
}

export interface VitalItem {
  fecha: string;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  fc: number | null;
  spo2?: number | null;
  glucemia?: number | null;
}

export interface PatientDetail {
  id: number;
  nombre: string;
  cedula: string;
  diagnostico: string;
  dias_post_alta: number;
  riesgo: Riesgo;
  riesgo_pct: number;
  adherencia: number;
  tendencia: Tendencia;
  eps: string;
  medico: string;
  address: string;
  phone: string;
  timeline: TimelineItem[];
  vitales: VitalItem[];
  plan: Plan | null;
}
