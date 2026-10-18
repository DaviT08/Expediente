import { GameNode } from '@/content/tags';

export const finaisStory: GameNode[] = [
  // Final A: Mesa Cheia
  {
    id: 'final_A',
    kind: 'ending',
    ending: 'A',
    next: 'final_A_scene',
  },
  {
    id: 'final_A_scene',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 18:15',
    bg: 'galpao_festa',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Sexta-feira, 18h15. O som de passos apressados ecoa pela passarela de metal que liga o mezanino ao galpão.',
      },
      {
        speaker: 'marta',
        expression: 'sorrindo',
        text: 'A diretoria da Orbe aprovou a nossa proposta conjunta! Contrato de 12 meses assinado com a Cooperativa Vale Verde!',
      },
      {
        speaker: 'marta',
        expression: 'sorrindo',
        text: 'A campanha "Origem" vai para as lojas e a rota compartilhada garantiu a margem. A lista de demissões está oficialmente cancelada!',
      },
      {
        speaker: 'narrador',
        text: 'O galpão explode em gritos e aplausos. Bruno corre até o armário e puxa o cavaquinho com um samba vibrante.',
      },
      {
        speaker: 'narrador',
        text: 'O cartaz desenhado por Lia decora a parede principal e Seu Jorge serve fatias de bolo. Rafa sorri e decide ficar até o fim da festa.',
      },
    ],
    next: 'epilogo_intro',
  },

  // Final B: Contrato fechado, cadeiras vazias
  {
    id: 'final_B',
    kind: 'ending',
    ending: 'B',
    next: 'final_B_scene',
  },
  {
    id: 'final_B_scene',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 18:15',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Sexta-feira, 18h15. O e-mail da Orbe foi respondido com aprovação, mas o clima no mezanino é frio.',
      },
      {
        speaker: 'marta',
        expression: 'neutro',
        text: 'A Orbe renovou nosso contrato, convencida pelos dados do Rafa e pela nova embalagem da Lia.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'Porém, como não conseguimos fechar um acordo de operações conjuntas a tempo, precisamos segurar a margem financeira.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'Dois cortes no galpão foram mantidos para fechar a conta. Jorge e Dani não continuam conosco.',
      },
      {
        speaker: 'narrador',
        text: 'O faturamento foi salvo, mas o silêncio dói na expedição. Um armário vazio no vestiário guarda caixas de papelão e lembranças.',
      },
    ],
    next: 'epilogo_intro',
  },

  // Final C: Recomeço
  {
    id: 'final_C',
    kind: 'ending',
    ending: 'C',
    next: 'final_C_scene',
  },
  {
    id: 'final_C_scene',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 18:15',
    bg: 'galpao_dia',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Sexta-feira, 18h15. A resposta oficial do Grupo Orbe chega curta: recusa da renovação do contrato.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'Eles não aceitaram negociar. Perdemos 40% da nossa receita de uma vez só a partir da semana que vem.',
      },
      {
        speaker: 'lia',
        expression: 'sorrindo',
        text: 'Marta, nós construímos a campanha "Origem" e o time do galpão tá mais unido do que nunca!',
      },
      {
        speaker: 'bruno',
        expression: 'sorrindo',
        text: 'A gente tem a aveia pura da cooperativa. Vamos vender direto online e abastecer os empórios de bairro!',
      },
      {
        speaker: 'narrador',
        text: 'A união dos protagonistas convence a diretoria a apostar em um recomeço independente. Ninguém sabe o futuro, mas ninguém ficou para trás.',
      },
    ],
    next: 'epilogo_intro',
  },

  // Final D: Fim de expediente
  {
    id: 'final_D',
    kind: 'ending',
    ending: 'D',
    next: 'final_D_scene',
  },
  {
    id: 'final_D_scene',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 22:00',
    bg: 'galpao_escuro',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Sexta-feira, noite fechada. A Orbe retirou todos os produtos das lojas e o plano de cortes foi executado sem piedade.',
      },
      {
        speaker: 'narrador',
        text: 'Rafa enviou sua carta de demissão logo após as 19h. O estágio de Lia não será renovado ao fim do mês vigente.',
      },
      {
        speaker: 'narrador',
        text: 'São 22h passadas na Vila Leopoldina. Bruno caminha lentamente entre as esteiras desligadas, escutando o próprio eco.',
      },
      {
        speaker: 'narrador',
        text: 'Com um suspiro pesado, o coordenador desce o disjuntor principal e apaga para sempre as luzes do galpão da Raiz Alimentos.',
      },
    ],
    next: 'epilogo_intro',
  },
];
