import VisitasProveedorPage from "@/features/proveedor/VisitasProveedorPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Mis visitas — OLGA" };

export default function Page() {
  return (
    <PagadorLayout>
      <VisitasProveedorPage />
    </PagadorLayout>
  );
}
