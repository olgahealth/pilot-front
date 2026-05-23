"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, CheckCircle, Copy } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface CreatedUser {
  name: string;
  email: string;
  role: string;
}

export default function CrearUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "Demo1234!", cellphone: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedUser | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API}/api/v1/admin/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, role: "proveedor" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear usuario");
      setCreated(data);
      setForm({ firstName: "", lastName: "", email: "", password: "Demo1234!", cellphone: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyCredentials() {
    if (!created) return;
    navigator.clipboard.writeText(`Email: ${created.email}\nContraseña: ${form.password || "Demo1234!"}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Crear profesional</h1>
        <p className="text-sm text-slate-500 mt-1">El profesional podrá iniciar sesión con estas credenciales.</p>
      </div>

      {created && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle className="w-5 h-5" />
            Profesional creado exitosamente
          </div>
          <div className="bg-white rounded-xl p-4 text-sm font-mono text-slate-700 space-y-1 border border-emerald-100">
            <p><span className="text-slate-400">Nombre:</span> {created.name}</p>
            <p><span className="text-slate-400">Email:</span> {created.email}</p>
            <p><span className="text-slate-400">Contraseña:</span> Demo1234!</p>
          </div>
          <button
            onClick={copyCredentials}
            className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "¡Copiado!" : "Copiar credenciales"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nombre</label>
            <input
              required value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              placeholder="Juan"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Apellido</label>
            <input
              required value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              placeholder="García"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Correo electrónico</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            placeholder="juan@clinica.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Teléfono</label>
          <input
            value={form.cellphone}
            onChange={(e) => setForm((p) => ({ ...p, cellphone: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Contraseña inicial</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 pr-10"
            />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            {loading ? "Creando..." : "Crear profesional"}
          </button>
        </div>
      </form>
    </div>
  );
}
