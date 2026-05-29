import { type EstadoSolicitud } from "@/data/mock/solicitudes";

export const COMPLEJIDAD_STYLES = {
  alta:  { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  media: { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  baja:  { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500"},
};

export const URGENCIA_STYLES = {
  urgente:    { bg: "bg-red-50",  text: "text-red-600",  label: "Urgente"    },
  programado: { bg: "bg-gray-50", text: "text-gray-600", label: "Programado" },
};

export const ESTADO_STYLES: Record<EstadoSolicitud, { bg: string; text: string; label: string }> = {
  pendiente:            { bg: "bg-gray-100",    text: "text-gray-600",   label: "Pendiente"           },
  aprobado:             { bg: "bg-emerald-100", text: "text-emerald-700",label: "Aprobado"            },
  aprobado_condiciones: { bg: "bg-amber-100",   text: "text-amber-700",  label: "Aprobado con cond." },
  negado:               { bg: "bg-red-100",     text: "text-red-700",    label: "Negado"              },
  mas_info:             { bg: "bg-blue-100",    text: "text-blue-700",   label: "ℹMás info solicitada"},
};

export const TIPOS_SERVICIO = [
  "Todos", "Enfermería domiciliaria", "Fisioterapia respiratoria",
  "Fisioterapia", "Curación herida", "Infusión IV", "Rehabilitación neurológica",
];

export function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}
