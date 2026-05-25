import { redirect } from "next/navigation";

export const metadata = { title: "Proveedor — Mis Visitas" };

export default function Page() {
  redirect("/proveedor/operaciones");
}
