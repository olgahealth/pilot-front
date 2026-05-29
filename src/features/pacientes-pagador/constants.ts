import { CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const PLAN_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  PHD:                  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
  PAD:                  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
  PARD:                 { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200"  },
  "Curaciones en Casa": { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200"    },
};

export const ESTADO_SOL_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  aprobado:             { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Aprobado"            },
  aprobado_condiciones: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Aprobado con cond." },
  pendiente:            { bg: "bg-gray-100",     text: "text-gray-600",    dot: "bg-gray-400",    label: "Pendiente"          },
  negado:               { bg: "bg-red-100",      text: "text-red-700",     dot: "bg-red-500",     label: "Negado"             },
};

export const TENDENCIA_ICON = {
  mejorando:    { Icon: TrendingUp,   color: "text-emerald-600", label: "Mejorando"    },
  estable:      { Icon: Minus,        color: "text-gray-500",    label: "Estable"      },
  deteriorando: { Icon: TrendingDown, color: "text-red-600",     label: "Deteriorando" },
};

export const ESTADO_ICON = {
  cumplido:    { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", line: "bg-emerald-500" },
  pendiente:   { icon: Clock,       color: "text-gray-400",    bg: "bg-gray-100",    line: "bg-gray-300"   },
  no_cumplido: { icon: XCircle,     color: "text-red-600",     bg: "bg-red-100",     line: "bg-red-400"    },
};

export function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}
