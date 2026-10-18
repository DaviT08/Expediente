export default async function TurmaDecisoesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Expediente · Decisões da Turma {id} (Fase F5)</div>;
}
