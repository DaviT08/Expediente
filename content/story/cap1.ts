import { GameNode } from '@/content/tags';

export const cap1Story: GameNode[] = [
  // Abertura do Capítulo 1
  {
    id: 'cap1_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 09:30',
    bg: 'open_space_marketing',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Mezanino da Raiz Alimentos. O som de teclados e impressoras enche o open space do marketing.',
      },
      {
        speaker: 'patricia',
        expression: 'tenso',
        text: 'Lia! Preciso de uma proposta de texto para a embalagem nova até amanhã de manhã. Tranquilo, né?',
      },
      {
        speaker: 'lia',
        expression: 'tenso',
        text: 'Amanhã de manhã...? Eu cheguei hoje, Patrícia. Mas claro, vou dar um jeito.',
      },
      {
        speaker: 'narrador',
        text: 'Patrícia sai apressada para outra reunião. Lia encara o documento em branco na tela.',
      },
    ],
    next: 'L01',
  },

  // Decisão L01
  {
    id: 'L01',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 09:40',
    bg: 'open_space_marketing',
    pov: 'lia',
    prompt: 'O peito aperta. O que você faz nos próximos cinco minutos?',
    next: 'B01_intro',
    options: [
      {
        id: 'a',
        text: 'Anota em palavras o que está sentindo e o que exatamente assusta',
        tags: { 'INTRA.AUTO': 2, 'LIN': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: '"Medo de parecer despreparada". Escrever o nome do receio tira o peso imediato do peito.',
          },
        ],
        reportSnippet: 'Quando a cobrança veio no primeiro dia, você escreveu exatamente o que sentia para clarear o medo.',
      },
      {
        id: 'b',
        text: 'Respira fundo e quebra a tarefa em partes pequenas',
        tags: { 'INTRA.REG': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Três respirações lentas. Depois, divide a tarefa: introdução, apelo da marca e chamada.',
          },
        ],
        reportSnippet: 'Diante do prazo apertado, você respirou fundo e dividiu a tarefa em etapas menores.',
      },
      {
        id: 'c',
        text: 'Levanta, pega água, se alonga e põe a playlist de foco',
        tags: { 'COR': 2, 'MUS': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Um copo d’água gelada, ombros destravados e uma trilha rítmica nos fones para isolar o ruído.',
          },
        ],
        reportSnippet: 'Ao travar na mesa, você levantou para se alongar, beber água e colocar fones com música.',
      },
      {
        id: 'd',
        text: 'Rabisca um esboço rápido da embalagem, só para ter por onde começar',
        tags: { 'ESP': 2, 'INTRA.MOT': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Um retângulo rápido na folha de rascunho com o espaço do título e da foto. O caminho clareou.',
          },
        ],
        reportSnippet: 'Para sair do bloqueio inicial, você rabiscou visualmente a embalagem antes de escrever.',
      },
    ],
  },

  // Transição B01
  {
    id: 'B01_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 10:25',
    bg: 'doca',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Doca de carregamento do galpão. O cheiro forte de café e óleo diesel paira no ar.',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'Cadê a carga do Vale Verde? O caminhão da Orbe encosta em menos de meia hora, meu!',
      },
      {
        speaker: 'kaio',
        expression: 'tenso',
        text: 'O caminhão da cooperativa atrasou duas horas na serra, Bruno. A Marta tá ligando sem parar.',
      },
    ],
    next: 'B01',
  },

  // Decisão B01
  {
    id: 'B01',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 10:30',
    bg: 'doca',
    pov: 'bruno',
    prompt: 'Você tem dez minutos antes de tudo travar. Qual o primeiro movimento?',
    next: 'M1_scene',
    options: [
      {
        id: 'a',
        text: 'Para, respira e decide não responder à Marta no calor do momento',
        tags: { 'INTRA.REG': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno guarda o celular no bolso. Responder irritado para a diretoria agora só pioraria.',
          },
        ],
        reportSnippet: 'Com a pressão na doca, você optou por respirar e não responder à diretoria no calor da emoção.',
      },
      {
        id: 'b',
        text: 'Vai direto para a doca ajudar a descarregar junto com a equipe',
        tags: { 'COR': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno calça as luvas e assume a ponta da esteira. O suor e o peso das caixas puxam o ritmo.',
          },
        ],
        reportSnippet: 'Com os caminhões parados, você colocou a mão na massa para descarregar caixas junto da equipe.',
      },
      {
        id: 'c',
        text: 'Abre a planilha de rotas e recalcula as janelas de entrega',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Três minutos no tablet: remaneja duas entregas da tarde e ganha quarenta minutos de folga.',
          },
        ],
        reportSnippet: 'No aperto dos horários, você sentou para recalcular as janelas de entrega com lógica fria.',
      },
      {
        id: 'd',
        text: 'Junta a equipe em roda e divide quem faz o quê',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: '"Gente, atenção aqui!". Trinta segundos de roda, tarefas divididas e todo mundo focado.',
          },
        ],
        reportSnippet: 'Diante do atraso coletivo, você reuniu o time em roda para redistribuir as tarefas.',
      },
    ],
  },

  // Momento fixo M1 + Introdução L02
  {
    id: 'M1_scene',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 11:15',
    bg: 'galpao_dia',
    pov: 'lia',
    effects: [{ op: 'add', var: 'LB', value: 1 }],
    lines: [
      {
        speaker: 'bruno',
        expression: 'sorrindo',
        text: 'Seja bem-vinda ao galpão, Lia! Aqui é o coração da Raiz. Deixa eu te apresentar o Seu Jorge.',
      },
      {
        speaker: 'jorge',
        expression: 'sorrindo',
        text: 'Muito prazer, menina! Sabia que a primeira granola da empresa foi assada numa cozinha pequena?',
      },
      {
        speaker: 'jorge',
        expression: 'neutro',
        text: 'Com aveia que o Seu Antônio trazia numa caminhonete velha lá do Vale do Ribeira. História pura.',
      },
    ],
    next: 'L02',
  },

  // Decisão L02
  {
    id: 'L02',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 11:25',
    bg: 'galpao_dia',
    pov: 'lia',
    prompt: 'Como você registra essa história?',
    next: 'B02_intro',
    options: [
      {
        id: 'a',
        text: 'Anota as frases dele exatamente do jeito que ele fala',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: '"Caminhonete velha, cheiro de canela". Lia transcreve cada expressão autêntica do veterano.',
          },
        ],
        reportSnippet: 'Ao ouvir a memória do galpão, você transcreveu a fala do Seu Jorge exatamente como ele falou.',
      },
      {
        id: 'b',
        text: 'Repara no tom de voz dele ao falar da cooperativa e pergunta como ele se sentiu naquele dia',
        tags: { 'INTER.EMP': 2, 'MUS': 1 },
        reaction: [
          {
            speaker: 'jorge',
            expression: 'sorrindo',
            text: 'O tom do Jorge amolece. Ele sorri com os olhos ao lembrar do cheiro da primeira fornada.',
          },
        ],
        reportSnippet: 'Ao ouvir o veterano, você prestou atenção na entonação e perguntou o que ele sentiu.',
      },
      {
        id: 'c',
        text: 'Pede para ver os ingredientes crus e anota de onde vem cada um',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Jorge abre um saco de juta. Aveia clara, castanha fresca, sem nenhum conservante químico.',
          },
        ],
        reportSnippet: 'Ao registrar a história da granola, você fez questão de tocar os grãos e mapear sua origem.',
      },
    ],
  },

  // Transição B02
  {
    id: 'B02_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 13:05',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Após o almoço, um barulho de freio ríspido chama atenção na linha de esteiras.',
      },
      {
        speaker: 'kaio',
        expression: 'tenso',
        text: 'Esse jeito antigo do Jorge atrasa tudo! A gente precisa acelerar essa triagem logo!',
      },
      {
        speaker: 'jorge',
        expression: 'tenso',
        text: 'Jeito antigo é zelar pelo grão, moleque! Respeita vinte anos de chão de fábrica!',
      },
      {
        speaker: 'narrador',
        text: 'Jorge solta a empilhadeira de braços cruzados, ofendido. O galpão inteiro silencia olhando para Bruno.',
      },
    ],
    next: 'B02',
  },

  // Decisão B02
  {
    id: 'B02',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 13:10',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'A equipe inteira olha para você.',
    next: 'R01_intro',
    options: [
      {
        id: 'a',
        text: 'Senta com os dois e conduz a conversa para cada um dizer o que precisa',
        tags: { 'INTER.CONF': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno senta os dois no banco da doca. Ouvir cada lado desarma a agressividade imediata.',
          },
        ],
        reportSnippet: 'No atrito da empilhadeira, você chamou os dois para conversar e mediar as necessidades de cada um.',
      },
      {
        id: 'b',
        text: 'Deixa a poeira baixar e procura o Jorge depois, porque viu que ele ficou magoado',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno pede foco para a linha voltar a andar, mas anota mentalmente de conversar com o Jorge em particular.',
          },
        ],
        reportSnippet: 'Após a discussão, você percebeu a mágoa do Jorge e preferiu acolhê-lo com calma depois.',
      },
      {
        id: 'c',
        text: 'Conta para a equipe o que você mesmo está sentindo com a pressão desta semana',
        tags: { 'INTRA.AUTO': 2, 'INTER.COM': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: '"Gente, tá todo mundo com o nervo à flor da pele, inclusive eu. Vamos segurar a onda juntos."',
          },
        ],
        reportSnippet: 'Diante da tensão no galpão, você foi transparente sobre a própria angústia e a pressão do momento.',
      },
      {
        id: 'd',
        text: 'Põe um samba no rádio do galpão e espera o clima esfriar antes de falar',
        tags: { 'MUS': 2, 'INTER.COM': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Um cavaquinho suave quebra o silêncio pesado. Os ombros relaxam aos poucos antes da conversa.',
          },
        ],
        reportSnippet: 'Para desarmar os ânimos exaltados, você ligou o rádio com um samba e deixou o ambiente esfriar.',
      },
    ],
  },

  // Transição R01
  {
    id: 'R01_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 13:55',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: 'Mesa do planejamento financeiro. Marta deposita uma pasta grossa ao lado do teclado de Rafa.',
      },
      {
        speaker: 'marta',
        expression: 'neutro',
        text: 'Rafa, aqui está a projeção do Plano Ajuste. Valida os números até quarta-feira. É só conferir.',
      },
      {
        speaker: 'rafa',
        expression: 'neutro',
        text: 'Vou analisar premissa por premissa, Marta. Número não mente quando a conta tá certa.',
      },
    ],
    next: 'R01',
  },

  // Decisão R01
  {
    id: 'R01',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 14:00',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    prompt: 'Por onde você começa?',
    next: 'K1_intro',
    options: [
      {
        id: 'a',
        text: 'Refaz as contas do zero, linha por linha',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Fórmulas reabertas, célula por célula. Cada premissa precisa de sustentação matemática.',
          },
        ],
        reportSnippet: 'Ao receber o plano da diretoria, você começou recalculando cada número do zero com rigor.',
      },
      {
        id: 'b',
        text: 'Desenha no quadro branco o caminho do produto, da roça até a gôndola',
        tags: { 'ESP': 2, 'NAT': 1 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Caixas, fretes e pontos de entrega mapeados no quadro. O fluxo físico fica evidente aos olhos.',
          },
        ],
        reportSnippet: 'Antes de olhar os totais, você desenhou o mapa do produto da lavoura até o consumidor final.',
      },
      {
        id: 'c',
        text: 'Pede vinte minutos com quem opera a logística para entender o processo real',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Entender o gargalo com quem lida com os caminhões traz a realidade que o Excel não mostra.',
          },
        ],
        reportSnippet: 'Para validar as contas, você foi atrás da visão de quem opera a rotina real da logística.',
      },
      {
        id: 'd',
        text: 'Põe o álbum instrumental de sempre e mergulha no arquivo',
        tags: { 'MUS': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Fones acústicos ligados, piano instrumental em loop. O foco se fecha completamente nas colunas.',
          },
        ],
        reportSnippet: 'Para analisar a planilha sem distrações, você colocou seu álbum instrumental de concentração.',
      },
    ],
  },

  // Transição K1
  {
    id: 'K1_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 15:25',
    bg: 'open_space_marketing',
    pov: 'lia',
    lines: [
      {
        speaker: 'patricia',
        expression: 'tenso',
        text: 'Lia, dei uma olhada no seu texto. Tira essa história de cooperativa. Ninguém lê verso de embalagem.',
      },
      {
        speaker: 'patricia',
        expression: 'neutro',
        text: 'O consumidor só quer saber de preço e caloria. Simplifica tudo.',
      },
    ],
    next: 'K1',
  },

  // Decisão-Chave K1
  {
    id: 'K1',
    kind: 'decision',
    type: 'K',
    chapter: 1,
    clock: 'SEG · 15:30',
    bg: 'open_space_marketing',
    pov: 'lia',
    prompt: 'Patrícia quer apagar a cooperativa da embalagem. O que você faz?',
    next: 'M2_scene',
    options: [
      {
        id: 'a',
        text: 'Tira da embalagem, mas guarda o material numa pasta "plano B" e manda mensagem ao Seu Antônio pedindo uma conversa',
        effects: [
          { op: 'add', var: 'COOP', value: 1 },
          { op: 'set', flag: 'F_LIA_GUARDOU', value: true },
        ],
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Lia obedece na versão oficial, mas salva os arquivos da cooperativa em uma pasta segura.',
          },
          {
            speaker: 'seu_antonio',
            expression: 'sorrindo',
            text: 'Mensagem do Seu Antônio: "Filha, quando quiser prosear sobre o plantio, tô à disposição!"',
          },
        ],
      },
      {
        id: 'b',
        text: 'Tira e apaga a versão antiga, para não confundir os arquivos',
        effects: [],
        reaction: [
          {
            speaker: 'lia',
            expression: 'tenso',
            text: 'Lia limpa a pasta de trabalho e foca apenas na nova versão enxuta pedida pela coordenação.',
          },
        ],
      },
    ],
  },

  // Momento fixo M2
  {
    id: 'M2_scene',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 16:30',
    bg: 'copa',
    pov: 'rafa',
    effects: [{ op: 'add', var: 'BR', value: 1 }],
    lines: [
      {
        speaker: 'narrador',
        text: 'Copa do mezanino. O filtro de café chia enquanto Bruno e Rafa se encontram no balcão.',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'Vou te falar, Rafa... esse custo de frete fracionado tá me matando lá embaixo. Não fecha a conta.',
      },
      {
        speaker: 'rafa',
        expression: 'neutro',
        text: 'Rafa anota mentalmente o detalhe. Uma rota de frete ineficiente pode ser a chave de tudo.',
      },
    ],
    next: 'R02_intro',
  },

  // Transição R02
  {
    id: 'R02_intro',
    kind: 'scene',
    chapter: 1,
    clock: 'SEG · 16:55',
    bg: 'sala_reuniao',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: 'Reunião de alinhamento com marketing e financeiro. Patrícia projeta slides cheios de gráficos.',
      },
      {
        speaker: 'rafa',
        expression: 'neutro',
        text: 'Se olharmos a margem bruta dessa linha considerando o retorno...',
      },
      {
        speaker: 'patricia',
        expression: 'tenso',
        text: 'Rafa, depois a gente vê detalhe de planilha, o foco agora é a entrega do pitch para a diretoria!',
      },
    ],
    next: 'R02',
  },

  // Decisão R02
  {
    id: 'R02',
    kind: 'decision',
    type: 'P',
    chapter: 1,
    clock: 'SEG · 17:00',
    bg: 'sala_reuniao',
    pov: 'rafa',
    prompt: 'Você sente o rosto esquentar.',
    next: 'cap1_end',
    options: [
      {
        id: 'a',
        text: 'Diz com calma: "Posso terminar o raciocínio?"',
        tags: { 'INTER.COM': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Voz firme, sem alteração de tom. A sala silencia e Patrícia concede o espaço para a conclusão.',
          },
        ],
        reportSnippet: 'Ao ser interrompido na reunião, você pediu espaço com assertividade e tom calmo.',
      },
      {
        id: 'b',
        text: 'Percebe que está irritado e por quê, e decide falar com ela depois',
        tags: { 'INTRA.AUTO': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Rafa reconhece a irritação no estômago. Conclui que discutir na frente de todos seria desgastante.',
          },
        ],
        reportSnippet: 'Ao sentir o rosto esquentar, você identificou a raiva e preferiu aguardar para conversar a sós.',
      },
      {
        id: 'c',
        text: 'Mostra o ponto num gráfico na tela, em vez de discutir',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Rafa projeta um comparativo visual claro. As barras vermelhas encerram o debate imediatamente.',
          },
        ],
        reportSnippet: 'Diante da divergência na mesa, você projetou os dados em gráfico para deixar o visual falar.',
      },
      {
        id: 'd',
        text: 'Batuca baixinho um ritmo na perna até a irritação passar',
        tags: { 'MUS': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Um ritmo constante sob a mesa ajuda os batimentos cardíacos a desacelerarem.',
          },
        ],
        reportSnippet: 'Sob estresse na reunião, você marcou um ritmo discreto na perna até o pulso desacelerar.',
      },
    ],
  },

  // Fim do Capítulo 1
  {
    id: 'cap1_end',
    kind: 'chapterEnd',
    chapter: 1,
    next: 'cap2_intro',
  },
];
