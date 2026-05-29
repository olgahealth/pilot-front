"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  savedCalificacion: number | null;
  savedComentario: string | null;
  onSave: (calificacion: number, comentario: string) => Promise<void>;
  onReset: () => void;
}

export function PatientRating({ savedCalificacion, savedComentario, onSave, onReset }: Props) {
  const [hover, setHover]       = useState(0);
  const [selected, setSelected] = useState(savedCalificacion ?? 0);
  const [comentario, setComentario] = useState(savedComentario ?? "");
  const [saving, setSaving]     = useState(false);

  const isReadOnly = savedCalificacion !== null && selected === savedCalificacion;

  async function handleSave() {
    if (selected === 0) return;
    setSaving(true);
    await onSave(selected, comentario);
    setSaving(false);
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-amber-500" />
        <h2 className="text-sm font-bold text-gray-900">Calificación del paciente</h2>
      </div>

      {isReadOnly ? (
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((n) => (
              <Star key={n} className={`w-6 h-6 ${n <= savedCalificacion! ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="ml-2 text-sm font-bold text-amber-600">{savedCalificacion}/5</span>
          </div>
          {savedComentario && (
            <p className="text-sm text-gray-600 italic border-l-2 border-amber-200 pl-3">"{savedComentario}"</p>
          )}
          <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
            Modificar calificación
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-2">Seleccioná la calificación del paciente</p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button"
                  onClick={() => setSelected(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 transition-colors ${n <= (hover || selected) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
            rows={2} placeholder="Comentario del paciente (opcional)..."
            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
          />
          <button type="button" onClick={handleSave} disabled={selected === 0 || saving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors">
            <Star className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar calificación"}
          </button>
        </div>
      )}
    </section>
  );
}
