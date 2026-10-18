import { GameNode } from '@/content/tags';

export const prologoStory: GameNode[] = [
  // Cena inicial de abertura do Prólogo
  {
    id: 'prologo_intro',
    kind: 'scene',
    chapter: 0,
    clock: 'DOM · 22:00',
    bg: 'quarto_lia_noite',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Domingo à noite em Itaquera. O ventilador de teto gira devagar enquanto Lia organiza a mochila na cama.',
      },
      {
        speaker: 'narrador',
        text: 'Caderno pautado, estojo de canetas e garrafa d’água. Tudo conferido pela terceira vez seguida.',
      },
      {
        speaker: 'narrador',
        text: 'Na tela do celular, vibra uma mensagem da mãe: "Muito orgulho de você, minha filha. Vai dar tudo certo amanhã 💛".',
      },
      {
        speaker: 'lia',
        expression: 'sorrindo',
        text: 'A primeira da família a entrar numa faculdade pública. E agora, o primeiro estágio em uma grande empresa.',
      },
      {
        speaker: 'narrador',
        text: 'Chega também a notificação do e-mail de boas-vindas: "Importante: esta será uma semana decisiva para os rumos da Raiz Alimentos".',
      },
      {
        speaker: 'lia',
        expression: 'tenso',
        text: 'Semana decisiva? Tomara que não seja um incêndio logo no meu primeiro dia...',
      },
    ],
    next: 'P01',
  },

  // Decisão P01
  {
    id: 'P01',
    kind: 'decision',
    type: 'P',
    chapter: 0,
    clock: 'DOM · 22:15',
    bg: 'quarto_lia_noite',
    pov: 'lia',
    prompt: 'Véspera do primeiro dia. O que você faria no lugar da Lia?',
    next: 'prologo_segunda_chegada',
    options: [
      {
        id: 'a',
        text: 'Manda mensagem no grupo da faculdade combinando de trocar como foi o primeiro dia de cada um',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'O grupo responde rápido com mensagens carinhosas e figurinhas engraçadas. Saber que não está sozinha acalma o coração.',
          },
        ],
        reportSnippet: 'No domingo à noite, você buscou apoio no grupo da faculdade para compartilhar a expectativa do primeiro dia.',
      },
      {
        id: 'b',
        text: 'Desenha no caderno o trajeto de metrô e como imagina o escritório',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'O trajeto ganha forma na folha: Linha Vermelha, baldeação na Sé e a caminhada até a Vila Leopoldina.',
          },
        ],
        reportSnippet: 'Na véspera da estreia, você desenhou o mapa do trajeto e o layout mental do escritório.',
      },
      {
        id: 'c',
        text: 'Escreve três metas pessoais para a primeira semana',
        tags: { 'INTRA.MOT': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Aprender a rotina sem hesitar, escutar os veteranos com atenção e ter iniciativa. Metas registradas a caneta.',
          },
        ],
        reportSnippet: 'Antes de começar o estágio, você colocou no papel três metas pessoais para a primeira semana.',
      },
      {
        id: 'd',
        text: 'Sai para caminhar na praça do bairro e gastar a ansiedade',
        tags: { 'COR': 2, 'NAT': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'O ar fresco da praça arborizada e o ritmo constante dos passos soltam os ombros que estavam rígidos pela tensão.',
          },
        ],
        reportSnippet: 'Na noite anterior, você preferiu caminhar ao ar livre para descarregar a tensão no corpo.',
      },
    ],
  },

  // Transição para a manhã de Segunda
  {
    id: 'prologo_segunda_chegada',
    kind: 'scene',
    chapter: 0,
    clock: 'SEG · 08:00',
    bg: 'sala_reuniao',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Segunda-feira, 8h da manhã. A sala de reuniões da diretoria está lotada. O café esfria intocado nas xícaras.',
      },
      {
        speaker: 'narrador',
        text: 'Marta Ramos, diretora-geral, assume a cabeceira da mesa com uma pasta de capa preta.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'O Grupo Orbe deu até sexta-feira, às 15h, para cortarmos 18% no preço dos nossos produtos.',
      },
      {
        speaker: 'marta',
        expression: 'neutro',
        text: 'Se não atendermos, nossos produtos saem de todas as gôndolas da rede. Vamos iniciar um plano de ajuste imediato.',
      },
      {
        speaker: 'narrador',
        text: 'Marta troca de slide. O ambiente gela. Bruno e Rafa, sentados em cantos opostos, não tiram os olhos dos gráficos.',
      },
    ],
    next: 'P02',
  },

  // Decisão P02
  {
    id: 'P02',
    kind: 'decision',
    type: 'P',
    chapter: 0,
    clock: 'SEG · 08:15',
    bg: 'sala_reuniao',
    pov: 'lia',
    prompt: 'O que mais chama a sua atenção na reunião?',
    next: 'cap1_intro',
    options: [
      {
        id: 'a',
        text: 'As palavras da Marta: ela diz "ajuste", nunca "demissão"',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'tenso',
            text: 'O vocabulário polido esconde cortes duros. As palavras foram calculadas com precisão cirúrgica.',
          },
        ],
        reportSnippet: "Na reunião geral, você reparou no cuidado com as palavras e no uso do termo 'ajuste'.",
      },
      {
        id: 'b',
        text: 'O gráfico: 40% da receita depende de um único cliente',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'tenso',
            text: 'A proporção no gráfico de pizza é assustadora: quase metade da empresa num único comprador.',
          },
        ],
        reportSnippet: 'Logo no primeiro anúncio, você fixou a atenção no dado de que 40% da receita vinha de um só cliente.',
      },
      {
        id: 'c',
        text: 'Um senhor do galpão, no fundo da sala, girando o crachá sem parar',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'tenso',
            text: 'O olhar dele denuncia anos de dedicação e um receio genuíno pelo que vem pela frente.',
          },
        ],
        reportSnippet: 'Durante o comunicado da diretoria, você notou o nervosismo de um veterano girando o crachá.',
      },
      {
        id: 'd',
        text: 'A foto antiga na parede: a primeira colheita da cooperativa que deu origem à marca',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Na moldura de madeira, mãos calejadas colhendo aveia no Vale do Ribeira. A raiz de tudo.',
          },
        ],
        reportSnippet: 'No meio da tensão na sala, você reparou no quadro da colheita original da cooperativa.',
      },
    ],
  },
];
