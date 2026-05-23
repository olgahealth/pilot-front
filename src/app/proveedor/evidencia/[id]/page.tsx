import EvidenciaUploadPage from "@/features/proveedor/EvidenciaUploadPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Cargar evidencia — OLGA" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagadorLayout>
      <EvidenciaUploadPage timelineId={Number(id)} />
    </PagadorLayout>
  );
}
