"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type OlgaRole } from "./AuthContext";

const ROLE_CONFIG: Record<OlgaRole, { label: string; color: string; description: string }> = {
  admin_olga: {
    label: "Administrador OLGA",
    color: "#0FB888",
    description: "Acceso total al sistema — gestión de tenants, usuarios y configuración global.",
  },
  hospital: {
    label: "Hospital / IPS",
    color: "#3B82F6",
    description: "Gestión de pacientes, planes de manejo y servicios hospitalarios.",
  },
  eps: {
    label: "EPS / Pagador",
    color: "#8B5CF6",
    description: "Verificaciones, facturación y auditoría de servicios autorizados.",
  },
  proveedor: {
    label: "Proveedor",
    color: "#F59E0B",
    description: "Órdenes de servicio, agenda y registro de evidencias.",
  },
  paciente: {
    label: "Paciente",
    color: "#EF4444",
    description: "Consulta de agenda, historial clínico y confirmación de servicios.",
  },
};

interface RoleDashboardProps {
  requiredRole: OlgaRole;
}

export default function RoleDashboard({ requiredRole }: RoleDashboardProps) {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== requiredRole && user.role !== "admin_olga") {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, authChecked, requiredRole, router]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFDFB" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const config = ROLE_CONFIG[requiredRole];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFDFB" }}>
      {/* Header */}
      <header
        style={{
          background: "rgba(250,253,251,.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(10,31,26,.10)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-1px", color: "#0A1F1A" }}>
          olga
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.85rem", color: "#4A6B62" }}>{user.name}</span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "999px",
              background: config.color + "22",
              color: config.color,
              border: `1px solid ${config.color}44`,
            }}
          >
            {config.label}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              router.push("/login");
            }}
            style={{
              fontSize: "0.8rem",
              color: "#7A9189",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
            padding: "48px",
            maxWidth: "560px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: config.color + "18",
              border: `2px solid ${config.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "2rem",
            }}
          >
            {requiredRole === "admin_olga" && "⚙️"}
            {requiredRole === "hospital"   && "🏥"}
            {requiredRole === "eps"        && "📋"}
            {requiredRole === "proveedor"  && "🚚"}
            {requiredRole === "paciente"   && "👤"}
          </div>

          <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#0A1F1A", marginBottom: "8px" }}>
            Dashboard — {config.label}
          </h1>

          <p style={{ color: "#4A6B62", fontSize: "0.95rem", marginBottom: "32px", lineHeight: 1.6 }}>
            {config.description}
          </p>

          {/* Info del token */}
          <div
            style={{
              background: "#F8FFFE",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px 20px",
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#7A9189", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Sesión activa
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.85rem", color: "#0A1F1A" }}>
                <b>Usuario:</b> {user.email}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#0A1F1A" }}>
                <b>Rol:</b> {user.role}
              </span>
              {user.tenant_id && (
                <span style={{ fontSize: "0.85rem", color: "#0A1F1A" }}>
                  <b>Tenant ID:</b> {user.tenant_id}
                </span>
              )}
            </div>
          </div>

          <p style={{ marginTop: "24px", fontSize: "0.8rem", color: "#9CA3AF" }}>
            Token JWT con ability <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>{user.role}</code> · expira en 8h
          </p>
        </div>
      </main>
    </div>
  );
}
