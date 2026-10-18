import type { TopLevelTag, SubdimensionTag } from '@/lib/scoring';

// Práticas de desenvolvimento (§8.5). O relatório mostra 2.
export const PRACTICES: Record<Exclude<TopLevelTag, 'INTER' | 'INTRA'> | SubdimensionTag, { items: [string, string]; base: string }> = {
  'INTER.EMP': { items: ['Parafrasear o que a pessoa disse antes de responder.', 'Perguntar "o que você precisa agora?".'], base: 'escuta ativa' },
  'INTER.COM': { items: ['Dar feedback no formato Situação-Comportamento-Impacto.', 'Dizer a conclusão primeiro.'], base: 'modelo SCI (Center for Creative Leadership)' },
  'INTER.CONF': { items: ['Separar a pessoa do problema e focar em interesses, não em posições.', 'Propor critérios objetivos para decidir.'], base: 'Fisher, Ury & Patton, Como chegar ao sim' },
  'INTER.COL': { items: ['Dividir papéis explicitamente no próximo trabalho em grupo.', 'Fazer uma rodada de ideias antes de decidir.'], base: 'dinâmica de equipes' },
  'INTRA.AUTO': { items: ['Nomear a emoção em palavras ("estou com medo de…").', 'Registrar o que disparou essa emoção.'], base: 'rotulação afetiva (Lieberman et al., 2007)' },
  'INTRA.REG': { items: ['Fazer uma pausa de 10 respirações antes de responder sob pressão.', 'Reinterpretar a situação: "o que mais isso pode significar?".'], base: 'reavaliação cognitiva (Gross, 1998)' },
  'INTRA.MOT': { items: ['Definir 1 meta específica e desafiadora para a semana.', 'Ligar a tarefa a um propósito pessoal.'], base: 'estabelecimento de metas (Locke & Latham, 2002)' },
  'INTRA.REF': { items: ['Manter um diário semanal: o que aconteceu, o que senti, o que faria diferente.', 'Reservar 10 minutos depois de uma situação difícil para pensar nela.'], base: 'aprendizagem experiencial (Kolb, 1984)' },
  LIN: { items: ['Escrever o e-mail importante com a conclusão na primeira linha.', 'Resumir uma reunião em 3 frases.'], base: 'princípio da pirâmide (Minto)' },
  LOG: { items: ['Decompor o problema numa árvore de causas.', 'Conferir as premissas de uma planilha antes de usá-la.'], base: 'análise de causa e custo total' },
  ESP: { items: ['Esboçar um fluxograma antes de explicar um processo.', 'Montar um storyboard da próxima apresentação.'], base: 'mapeamento de processos' },
  COR: { items: ['Ir ao lugar onde o trabalho acontece antes de opinar.', 'Ensaiar apresentações em pé e em voz alta.'], base: 'gemba walk (lean)' },
  MUS: { items: ['Treinar ritmo, pausa e entonação na fala em público.', 'Reparar no tom de voz das pessoas, não só nas palavras.'], base: 'comunicação oral' },
  NAT: { items: ['Mapear de onde vêm os insumos de um produto que você usa.', 'Procurar padrões sazonais em dados de demanda.'], base: 'cadeia de suprimentos e sustentabilidade' },
};
