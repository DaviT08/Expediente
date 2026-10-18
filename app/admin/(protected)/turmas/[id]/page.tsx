export default async function TurmaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Expediente · Detalhes da Turma {id} (Fase F5)</div>;
}
