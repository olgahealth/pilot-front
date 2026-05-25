import ProveedorOperacionesPage from "@/features/proveedor/ProveedorOperacionesPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Centro de Operaciones — OLGA" };

export default function Page() {
  return <PagadorLayout><ProveedorOperacionesPage /></PagadorLayout>;
}
