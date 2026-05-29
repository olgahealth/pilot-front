export type Fallo = {
  tipo: "hardware" | "fraude";
  codigo: string;
  descripcion: string;
  motivo: string;
  resolucion: string;
};

export type Prestador = {
  nombre: string;
  servicios: number;
  gps: number;
  firma: number;
  cap_aprobado: number;
  cap_cuarentena: number;
  cap_rechazado: number;
  fallos_hardware: number;
  fallos_fraude: number;
  fallos: Fallo[];
};

export const PRESTADORES: Prestador[] = [
  { nombre: "IPS Norte",        servicios: 42, gps: 42, firma: 42, cap_aprobado: 7_200_000, cap_cuarentena: 0, cap_rechazado: 0, fallos_hardware: 0, fallos_fraude: 0, fallos: [] },
  { nombre: "IPS SurOccidente", servicios: 38, gps: 38, firma: 37, cap_aprobado: 5_650_000, cap_cuarentena: 150_000, cap_rechazado: 0, fallos_hardware: 1, fallos_fraude: 0,
    fallos: [{ tipo: "hardware", codigo: "SIGN-TIMEOUT-003", descripcion: "Firma digital — timeout de dispositivo", motivo: "Batería del tablet agotada durante la sesión de firma", resolucion: "Pendiente recaptura en próxima visita" }] },
  { nombre: "IPS Chapinero",    servicios: 28, gps: 25, firma: 28, cap_aprobado: 3_540_000, cap_cuarentena: 360_000, cap_rechazado: 200_000, fallos_hardware: 2, fallos_fraude: 1,
    fallos: [
      { tipo: "hardware", codigo: "GPS-TIMEOUT-011", descripcion: "GPS — timeout de red móvil", motivo: "Sin cobertura 4G en zona residencial Fontibón durante 42 min", resolucion: "Pendiente conciliación con operador de red" },
      { tipo: "hardware", codigo: "GPS-OS-DENIED-014", descripcion: "GPS — permiso denegado por SO", motivo: "Permisos de ubicación revocados tras actualización de Android 14", resolucion: "Requiere reinstalación y re-aceptación de permisos" },
      { tipo: "fraude",   codigo: "GPS-SPOOF-007",    descripcion: "GPS spoofing detectado", motivo: "Coordenadas reportadas a 23 km del domicilio registrado del paciente", resolucion: "Caso derivado a fiscalía interna · Capital bloqueado" },
    ] },
  { nombre: "IPS Oncología",  servicios: 22, gps: 22, firma: 22, cap_aprobado: 3_400_000, cap_cuarentena: 0, cap_rechazado: 0, fallos_hardware: 0, fallos_fraude: 0, fallos: [] },
  { nombre: "IPS Neurología", servicios: 12, gps: 12, firma: 12, cap_aprobado: 1_900_000, cap_cuarentena: 0, cap_rechazado: 0, fallos_hardware: 0, fallos_fraude: 0, fallos: [] },
];

export const REINGRESO: Record<string, number> = {
  "IPS Norte": 4, "IPS Oncología": 5, "IPS Neurología": 7,
  "IPS SurOccidente": 12, "IPS Chapinero": 19,
};

export const SCORING = [
  { nombre: "IPS Norte",        score: 4.8, razon: "GPS 100%, satisfacción alta"               },
  { nombre: "IPS Oncología",    score: 4.7, razon: "Sin irregularidades"                        },
  { nombre: "IPS Neurología",   score: 4.5, razon: "Cumplimiento total"                         },
  { nombre: "IPS SurOccidente", score: 3.9, razon: "1 firma pendiente de conciliación"          },
  { nombre: "IPS Chapinero",    score: 2.8, razon: "2 fallos hardware + 1 fraude detectado"     },
];

export const CUPS_MEDICOS = [
  { medico: "Sandra Muñoz",          ips: "IPS Norte",        cups: "890201 — Enfermería domiciliaria",   atenciones: 42, monto: "$3.8M" },
  { medico: "Diana Roa",             ips: "IPS SurOccidente", cups: "930101 — Fisioterapia respiratoria", atenciones: 38, monto: "$2.9M" },
  { medico: "Jorge Leal",            ips: "IPS Chapinero",    cups: "890301 — Curación pie diabético",    atenciones: 28, monto: "$1.6M" },
  { medico: "Dr. Andrés Ospina",     ips: "IPS Norte",        cups: "890101 — Cardiología domiciliaria",  atenciones: 22, monto: "$4.1M" },
  { medico: "Dra. Claudia Restrepo", ips: "IPS SurOccidente", cups: "890102 — Neumología domiciliaria",   atenciones: 12, monto: "$2.3M" },
];

export const EXPORTES = [
  { id: "supersalud", label: "Indicadores Supersalud" },
  { id: "adres",      label: "Reporte ADRES"          },
  { id: "json",       label: "Exportar JSON"          },
];

export const TOTAL_OPS        = PRESTADORES.reduce((s, p) => s + p.servicios, 0);
export const TOTAL_FALLOS_HW  = PRESTADORES.reduce((s, p) => s + p.fallos_hardware, 0);
export const TOTAL_FRAUDE     = PRESTADORES.reduce((s, p) => s + p.fallos_fraude, 0);
export const TOTAL_FALLOS     = TOTAL_FALLOS_HW + TOTAL_FRAUDE;
export const TOTAL_APROBADO   = PRESTADORES.reduce((s, p) => s + p.cap_aprobado, 0);
export const TOTAL_CUARENTENA = PRESTADORES.reduce((s, p) => s + p.cap_cuarentena, 0);
export const TOTAL_RECHAZADO  = PRESTADORES.reduce((s, p) => s + p.cap_rechazado, 0);

export function fmtM(n: number) {
  return n === 0 ? "—" : `$${(n / 1_000_000).toFixed(1)}M`;
}
