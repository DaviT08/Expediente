export default async function RelatorioPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <div>Expediente · Relatório {runId} (Fase F4)</div>;
}
