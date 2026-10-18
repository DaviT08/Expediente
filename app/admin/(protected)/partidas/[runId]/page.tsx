export default async function PartidaPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <div>Expediente · Detalhes da Partida {runId} (Fase F5)</div>;
}
