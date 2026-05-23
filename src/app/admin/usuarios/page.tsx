import CrearUsuarioPage from "@/features/admin/CrearUsuarioPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Crear profesional — OLGA" };

export default function Page() {
  return (
    <PagadorLayout>
      <CrearUsuarioPage />
    </PagadorLayout>
  );
}
