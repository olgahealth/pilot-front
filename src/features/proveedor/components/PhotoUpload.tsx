"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

interface Props { onChange: (base64: string) => void; }

export function PhotoUpload({ onChange }: Props) {
  const [preview, setPreview] = useState("");

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  }

  function remove() { setPreview(""); onChange(""); }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-800">Foto de evidencia</h3>
        <span className="text-xs text-slate-400">(opcional)</span>
      </div>
      {preview ? (
        <div className="space-y-2">
          <img src={preview} alt="Evidencia" className="w-full rounded-xl object-cover max-h-48" />
          <button type="button" onClick={remove} className="text-xs text-rose-500 font-semibold hover:text-rose-600">Eliminar foto</button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
          <Camera className="w-7 h-7 text-slate-300 mb-1" />
          <span className="text-xs text-slate-400 font-medium">Tomar foto o seleccionar</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} />
        </label>
      )}
    </div>
  );
}
