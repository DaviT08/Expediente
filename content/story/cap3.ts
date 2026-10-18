import { GameNode } from '@/content/tags';

export const cap3Story: GameNode[] = [
  // Abertura Cap 3
  {
    id: 'cap3_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 08:20',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Quarta-feira, 8h30. Bruno entra no galpão com o telefone vibrando no bolso do uniforme de trabalho.',
      },
      {
        speaker: 'narrador',
        text: 'É uma mensagem direta de Marta: "Reunião de emergência às 10h. Preciso de propostas para cortar 10% do custo até o meio-dia".',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'Cortar 10% em menos de quatro horas? Isso é empurrar a operação para o limite do abismo.',
      },
      {
        speaker: 'narrador',
        text: 'Ao redor, a equipe opera as máquinas com dedicação. O coordenador sabe que o tempo está correndo contra eles.',
      },
    ],
    next: 'B05',
  },

  // Decisão B05
  {
    id: 'B05',
    kind: 'decision',
    type: 'P',
    chapter: 3,
    clock: 'QUA · 08:30',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'Por onde você começa a busca pelo corte de 10%?',
    next: 'B06_intro',
    options: [
      {
        id: 'a',
        text: 'Faz uma rodada rápida de ideias com a equipe do galpão',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Em dez minutos de conversa aberta, a equipe aponta três gargalos simples de empacotamento.',
          },
        ],
        reportSnippet: 'Ao buscar eficiência operacional, você reuniu a equipe do galpão para coletar ideias de melhoria.',
      },
      {
        id: 'b',
        text: 'Analisa os dados de hora extra e desperdício dos últimos meses',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno cruza planilhas de turnos e descobre picos desnecessários de horas extras nas sextas.',
          },
        ],
        reportSnippet: 'Para mapear custos, você analisou minuciosamente os dados de horas extras e desperdício.',
      },
      {
        id: 'c',
        text: 'Percorre o galpão a pé, cronometrando cada etapa do processo',
        tags: { 'COR': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Passo a passo com o cronômetro na mão. Ver o movimento físico dos operadores expõe percursos longos.',
          },
        ],
        reportSnippet: 'Você percorreu o galpão a pé com cronômetro para medir fisicamente o tempo das operações.',
      },
      {
        id: 'd',
        text: 'Verifica as perdas de matéria-prima por temperatura e validade',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Checagem dos termômetros nos silos: o ajuste fino na umidade pode evitar descarte de aveia.',
          },
        ],
        reportSnippet: 'Você inspecionou as perdas de matéria-prima ligadas à temperatura, umidade e validade.',
      },
    ],
  },

  // Transição B06
  {
    id: 'B06_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 09:55',
    bg: 'sala_reuniao',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '10h em ponto. Bruno sobe para a sala da diretoria. Marta fecha a persiana e desliza um envelope pardo sobre a mesa.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'Bruno, nós tentamos todos os cenários possíveis. Esta é a lista dos 4 desligamentos necessários no galpão.',
      },
      {
        speaker: 'narrador',
        text: 'Bruno abre a folha com as mãos trêmulas. Os dois primeiros nomes saltam aos olhos: Jorge Silva e Dani Rocha.',
      },
      {
        speaker: 'marta',
        expression: 'neutro',
        text: 'Essa lista é estritamente confidencial até sexta-feira às 18h. Ninguém pode saber antes do fechamento.',
      },
    ],
    next: 'B06',
  },

  // Decisão B06
  {
    id: 'B06',
    kind: 'decision',
    type: 'P',
    chapter: 3,
    clock: 'QUA · 10:00',
    bg: 'sala_reuniao',
    pov: 'bruno',
    prompt: 'O ar some da sala.',
    next: 'K3',
    options: [
      {
        id: 'a',
        text: 'Questiona os critérios da lista e propõe discutir alternativas',
        tags: { 'INTER.CONF': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: '"Marta, quais foram os critérios? Cortar quem tem mais experiência vai desestabilizar a entrega".',
          },
        ],
        reportSnippet: 'Ao receber a lista de cortes, você questionou os critérios e propôs alternativas.',
      },
      {
        id: 'b',
        text: 'Pergunta à Marta como ela está lidando com isso, porque ela também parece abalada',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'marta',
            expression: 'tenso',
            text: 'Marta desvia o olhar e respira fundo. "Eu também não durmo há três dias, Bruno. É a sobrevivência da Raiz".',
          },
        ],
        reportSnippet: 'Diante da lista de demissões, você percebeu o abalo da diretora e perguntou como ela estava lidando.',
      },
      {
        id: 'c',
        text: 'Pede dez minutos antes de responder, para não falar no impulso',
        tags: { 'INTRA.REG': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno bebe um copo d’água e silencia por instantes para não responder movido pela revolta.',
          },
        ],
        reportSnippet: 'Sob o choque dos nomes na lista, você pediu alguns minutos de pausa antes de responder no calor da raiva.',
      },
      {
        id: 'd',
        text: 'Pede os números que justificam cada nome',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: '"Marta, me mostra o cálculo de produtividade de cada um desses quatro postos".',
          },
        ],
        reportSnippet: 'Você solicitou os cálculos e indicadores quantitativos que justificavam cada nome.',
      },
    ],
  },

  // Decisão-Chave K3 (com timer de 20s)
  {
    id: 'K3',
    kind: 'decision',
    type: 'K',
    chapter: 3,
    clock: 'QUA · 10:05',
    bg: 'sala_reuniao',
    pov: 'bruno',
    timerSec: 20,
    timeoutOption: 'a',
    prompt: 'Marta estende a caneta: "Preciso da sua assinatura e do seu silêncio até sexta-feira".',
    next: 'L04_intro',
    options: [
      {
        id: 'a',
        text: 'Assina e guarda segredo',
        effects: [
          { op: 'add', var: 'LB', value: -1 },
          { op: 'add', var: 'BR', value: -1 },
          { op: 'set', flag: 'F_SEGREDO', value: true },
        ],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: 'Bruno assina a contragosto. O silêncio vai pesar como chumbo ao olhar nos olhos da equipe.',
          },
        ],
      },
      {
        id: 'b',
        text: 'Assina, mas conta à Lia e pede que ela pause o vídeo com a equipe, para não expor ninguém',
        effects: [{ op: 'add', var: 'LB', value: 1 }],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno assina, mas avisa Lia para não gravar Jorge e Dani na campanha para não gerar falsas esperanças.',
          },
        ],
      },
      {
        id: 'c',
        text: 'Pede 48 horas para apresentar uma alternativa junto com Lia e Rafa',
        effects: [
          { op: 'add', var: 'LB', value: 1 },
          { op: 'add', var: 'BR', value: 1 },
        ],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: '"Me dá até sexta às 10h, Marta! A gente vai colocar uma alternativa viável na sua mesa."',
          },
        ],
      },
    ],
  },

  // Transição L04
  {
    id: 'L04_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 10:55',
    bg: 'corredor_vidro',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '11h. Pela porta de vidro da sala de reunião, Lia para com uma pilha de folhas na mão.',
      },
      {
        speaker: 'narrador',
        text: 'Patrícia está projetando na lousa digital exatamente o conceito visual criado por Lia no dia anterior.',
      },
      {
        speaker: 'patricia',
        expression: 'sorrindo',
        text: '...como vocês podem ver nesta proposta que eu elaborei, a janela transparente conecta o cliente ao campo!',
      },
      {
        speaker: 'lia',
        expression: 'tenso',
        text: 'O meu layout... ela tá recebendo todos os elogios da diretoria sem citar meu nome.',
      },
    ],
    next: 'L04',
  },

  // Decisão L04
  {
    id: 'L04',
    kind: 'decision',
    type: 'P',
    chapter: 3,
    clock: 'QUA · 11:00',
    bg: 'corredor_vidro',
    pov: 'lia',
    prompt: 'Pela porta de vidro, Patrícia assume a autoria do seu trabalho. O que você faz?',
    next: 'R05_intro',
    options: [
      {
        id: 'a',
        text: 'Respira e espera a raiva passar antes de decidir qualquer coisa',
        tags: { 'INTRA.REG': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Lia recua do corredor e respira fundo. Agir tomada pela mágoa imediata só a prejudicaria.',
          },
        ],
        reportSnippet: 'Ao ver seu trabalho ser apresentado por outra pessoa, você escolheu esperar a raiva esfriar antes de agir.',
      },
      {
        id: 'b',
        text: 'Procura a Patrícia no fim do dia e fala, com cuidado, sobre o crédito',
        tags: { 'INTER.CONF': 2, 'LIN': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Lia anota palavras cuidadosas para ter uma conversa franca e respeitosa ao fim da tarde.',
          },
        ],
        reportSnippet: 'Você decidiu procurar a gestora reservadamente para conversar sobre o reconhecimento da autoria.',
      },
      {
        id: 'c',
        text: 'Tenta entender que pressão a Patrícia está sofrendo para agir assim',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Patrícia também é nova no cargo de coordenação e está sob fogo cruzado da diretoria.',
          },
        ],
        reportSnippet: 'Diante do crédito tomado, você procurou entender a pressão que a outra pessoa enfrentava.',
      },
    ],
  },

  // Transição R05
  {
    id: 'R05_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 13:50',
    bg: 'open_space_marketing',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '14h. Faltam cinco minutos para a reunião de revisão de custos com toda a diretoria.',
      },
      {
        speaker: 'narrador',
        text: 'Rafa encara os dados finais no notebook. Se ele apresentar a divergência agora, contrariará Marta em público.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'O coração dispara no peito. As palmas das mãos começam a suar frio sobre a mesa de madeira.',
      },
    ],
    next: 'R05',
  },

  // Decisão R05
  {
    id: 'R05',
    kind: 'decision',
    type: 'P',
    chapter: 3,
    clock: 'QUA · 14:00',
    bg: 'open_space_marketing',
    pov: 'rafa',
    prompt: 'O coração dispara e as mãos suam antes da reunião.',
    next: 'L05_intro',
    options: [
      {
        id: 'a',
        text: 'Põe uma música lenta no fone e respira no ritmo dela',
        tags: { 'MUS': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'O compasso calmo nos fones cadencia a respiração e faz a frequência cardíaca voltar ao normal.',
          },
        ],
        reportSnippet: 'Antes da reunião decisiva, você usou música e respiração rítmica para acalmar o corpo.',
      },
      {
        id: 'b',
        text: 'Nomeia para si mesmo: "É medo de ser julgado, não é perigo de verdade"',
        tags: { 'INTRA.AUTO': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Nomear o medo desarma a resposta de estresse. É apenas uma apresentação de trabalho.',
          },
        ],
        reportSnippet: 'Você reconheceu e rotulou a própria emoção: medo de julgamento, e não uma ameaça real.',
      },
      {
        id: 'c',
        text: 'Desce e dá uma volta no jardim do prédio, reparando nas plantas',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Cinco minutos no canteiro verde do mezanino, sentindo o sol nas folhas. O foco se reestabelece.',
          },
        ],
        reportSnippet: 'Você desceu para uma caminhada rápida pelo jardim do prédio para arejar a mente entre as plantas.',
      },
      {
        id: 'd',
        text: 'Escreve num papel as três frases que precisa dizer',
        tags: { 'LIN': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Três pontos essenciais anotados no cartão de bolso. A segurança das palavras afasta a hesitação.',
          },
        ],
        reportSnippet: 'Para conter a ansiedade, você sintetizou no papel as três frases exatas que precisava falar.',
      },
    ],
  },

  // Transição L05
  {
    id: 'L05_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 15:50',
    bg: 'copa',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '16h, na copa do mezanino. Patrícia puxa conversa com Lia com uma caneca fumegante de café na mão.',
      },
      {
        speaker: 'patricia',
        expression: 'sorrindo',
        text: 'Lia, a Marta adorou a ideia da janela no pacote! A gente é time, viu? Parabéns para nós.',
      },
      {
        speaker: 'narrador',
        text: 'Lia segura a caneca com calma. É o momento de definir como posicionar sua postura profissional.',
      },
    ],
    next: 'L05',
  },

  // Decisão L05
  {
    id: 'L05',
    kind: 'decision',
    type: 'P',
    chapter: 3,
    clock: 'QUA · 16:00',
    bg: 'copa',
    pov: 'lia',
    prompt: 'Patrícia comemora dizendo "a gente é time". Como você reage?',
    next: 'branch_K4',
    options: [
      {
        id: 'a',
        text: 'Propõe um combinado claro: daqui para frente, cada ideia é apresentada com o nome de quem criou',
        tags: { 'INTER.CONF': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: '"Fico feliz, Patrícia. Podemos combinar que nos próximos alinhamentos o nome do autor vá no slide?".',
          },
        ],
        reportSnippet: 'Você estabeleceu um acordo transparente com a coordenação sobre a autoria das criações.',
      },
      {
        id: 'b',
        text: 'Manda um e-mail educado registrando a ideia, com data e arquivos',
        tags: { 'LIN': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Lia envia um e-mail formal anexando os arquivos fonte e registrando o histórico da criação.',
          },
        ],
        reportSnippet: 'Você formalizou por e-mail a autoria e os arquivos conceituais de forma documental e cortês.',
      },
      {
        id: 'c',
        text: 'Chama outras pessoas para cocriar a campanha e não ficar sozinha nisso',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia sugere envolver o time do galpão e o financeiro na criação coletiva da narrativa.',
          },
        ],
        reportSnippet: 'Para fortalecer o projeto, você ampliou a campanha convidando outros colegas para cocriar.',
      },
      {
        id: 'd',
        text: 'Pensa no que esse episódio mostra sobre o que ela valoriza e o que aceita no trabalho',
        tags: { 'INTRA.REF': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Lia reflete sobre integridade e limites profissionais: o que ela está disposta a tolerar em sua carreira.',
          },
        ],
        reportSnippet: 'Você usou o atrito de crédito profissional para refletir sobre seus valores e limites de carreira.',
      },
    ],
  },

  // Ramificação: se K2_A for true, K4 é pulada
  {
    id: 'branch_K4',
    kind: 'branch',
    when: [
      {
        if: { flag: 'K2_A', equals: true },
        next: 'cap3_end',
      },
    ],
    else: 'K4_intro',
  },

  // Transição K4 (só ocorre se K2 != a)
  {
    id: 'K4_intro',
    kind: 'scene',
    chapter: 3,
    clock: 'QUA · 17:25',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '17h30. O expediente caminha para o fim. Lia vai até a mesa de Rafa com um caderno na mão.',
      },
      {
        speaker: 'lia',
        expression: 'neutro',
        text: 'Rafa, você tem números de custo da cooperativa? Eu queria embasar a campanha "Origem" para o pitch de sexta.',
      },
      {
        speaker: 'narrador',
        text: 'Rafa olha para a planilha com a verdade escondida do Plano Ajuste. Ele tem a opção de colaborar ou se resguardar.',
      },
    ],
    next: 'K4',
  },

  // Decisão-Chave K4 (condicional)
  {
    id: 'K4',
    kind: 'decision',
    type: 'K',
    chapter: 3,
    clock: 'QUA · 17:30',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    prompt: 'Lia pede dados da cooperativa. Você compartilha a descoberta do erro na planilha?',
    next: 'cap3_end',
    options: [
      {
        id: 'a',
        text: 'Mostra o que descobriu, e os dois montam a análise juntos',
        effects: [
          { op: 'add', var: 'RL', value: 1 },
          { op: 'set', flag: 'F_DADOS', value: true },
        ],
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Rafa vira o monitor para Lia. Os dois unem os dados financeiros com a narrativa de marketing.',
          },
        ],
      },
      {
        id: 'b',
        text: 'Diz que não é a área dele e que está sem tempo',
        effects: [{ op: 'add', var: 'RL', value: -1 }],
        reaction: [
          {
            speaker: 'rafa',
            expression: 'tenso',
            text: '"Agora não dá, Lia. Tô fechando a conciliação". Lia sai frustrada.',
          },
        ],
      },
    ],
  },

  // Fim do Cap 3
  {
    id: 'cap3_end',
    kind: 'chapterEnd',
    chapter: 3,
    next: 'cap4_intro',
  },
];
