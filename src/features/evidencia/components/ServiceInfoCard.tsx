"use client";

import { User, FileText, Clock, MapPin } from "lucide-react";

interface Visita { fecha: string; servicio: string; profesional: string; entidad: string; }

interface Props {
  visita: Visita;
  gpsLat: number | null;
  gpsLng: number | null;
  hora_llegada: string | null;
  hora_salida: string | null;
  tiempo_atencion: number | null;
}

export function ServiceInfoCard({ visita, gpsLat, gpsLng, hora_llegada, hora_salida, tiempo_atencion }: Props) {
  const tieneGps = gpsLat !== null && gpsLng !== null;

  const infoData = [
    { icon: User,     label: "Paciente",    value: "" }, // filled from parent — kept as visita
    { icon: User,     label: "Profesional", value: visita.profesional },
    { icon: FileText, label: "Servicio",    value: visita.servicio },
    { icon: Clock,    label: "Fecha",       value: visita.fecha },
    { icon: MapPin,   label: "Entidad",     value: visita.entidad ?? "OLGA Servicios" },
  ].filter(i => i.value); // paciente is shown in header, skip empty

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Información del servicio</h2>
        {infoData.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}

        {/* Horario inline */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Horario de atención</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-800">{hora_llegada ?? "—"}</span>
              <span className="text-gray-300 text-sm">→</span>
              <span className="text-sm font-semibold text-gray-800">{hora_salida ?? "—"}</span>
              {tiempo_atencion != null && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{tiempo_atencion} min</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GPS badge */}
      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${tieneGps ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tieneGps ? "bg-emerald-100" : "bg-slate-100"}`}>
          <MapPin className={`w-5 h-5 ${tieneGps ? "text-emerald-600" : "text-slate-400"}`} />
        </div>
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${tieneGps ? "text-emerald-700" : "text-slate-500"}`}>
            {tieneGps ? "GPS Registrado" : "GPS Pendiente"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {tieneGps ? `${gpsLat!.toFixed(5)}, ${gpsLng!.toFixed(5)}` : "El profesional aún no cargó su ubicación"}
          </p>
        </div>
      </div>
    </div>
  );
}
