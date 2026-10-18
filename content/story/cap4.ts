import { GameNode } from '@/content/tags';

export const cap4Story: GameNode[] = [
  // Abertura Cap 4
  {
    id: 'cap4_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 08:50',
    bg: 'banheiro',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Quinta-feira, 9h da manhã. Lia entra no banheiro feminino do mezanino e ouve um choro contido no fundo.',
      },
      {
        speaker: 'narrador',
        text: 'Dani Rocha, da operação do galpão, está apoiada na bancada da pia, tentando secar as lágrimas no uniforme.',
      },
      {
        speaker: 'dani',
        expression: 'tenso',
        text: 'Lia... ouvi falar que meu nome tá numa lista que a diretoria preparou. Eu sou mãe sozinha, tenho duas crianças pequenas.',
      },
      {
        speaker: 'narrador',
        text: 'O desespero da colega de trabalho aperta o peito de Lia. As decisões do mezanino têm rostos e vidas em jogo.',
      },
    ],
    next: 'L06',
  },

  // Decisão L06
  {
    id: 'L06',
    kind: 'decision',
    type: 'P',
    chapter: 4,
    clock: 'QUI · 09:00',
    bg: 'banheiro',
    pov: 'lia',
    prompt: 'Dani está chorando com medo da demissão. O que você faz?',
    next: 'R06_intro',
    options: [
      {
        id: 'a',
        text: 'Senta perto, em silêncio, e pergunta se ela quer conversar',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia senta ao lado de Dani no banco. Sem pressa e sem cobrança, apenas oferecendo presença.',
          },
        ],
        reportSnippet: 'Ao encontrar uma colega abalada no banheiro, você sentou ao lado e ofereceu escuta acolhedora.',
      },
      {
        id: 'b',
        text: 'Diz com sinceridade o que sabe e se oferece para ir junto falar com o Bruno',
        tags: { 'INTER.COM': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: '"Dani, eu sei que tem uma proposta alternativa sendo montada. Vem comigo, vamos falar com o Bruno".',
          },
        ],
        reportSnippet: 'Você foi sincera sobre o cenário e se ofereceu para acompanhar a colega até a coordenação.',
      },
      {
        id: 'c',
        text: 'Oferece um lado do fone, com a música que sempre acalma você; às vezes é o que dá para fazer',
        tags: { 'MUS': 2, 'INTER.EMP': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia divide o fone com uma melodia suave de violão. Aos poucos, a respiração de Dani se acalma.',
          },
        ],
        reportSnippet: 'Para acolher a colega em prantos, você compartilhou um fone de ouvido com música suave.',
      },
      {
        id: 'd',
        text: 'Chama duas colegas para levarem a Dani para almoçar',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia chama duas operadoras de confiança. Uma rede de apoio rápido se forma em volta de Dani.',
          },
        ],
        reportSnippet: 'Você mobilizou colegas próximas para criar uma rede de apoio acolhedor para a operadora.',
      },
    ],
  },

  // Transição R06
  {
    id: 'R06_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 09:55',
    bg: 'sala_reuniao',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '10h. Rafa bate na porta da diretoria com seu caderno de cálculos e um pen drive com as simulações.',
      },
      {
        speaker: 'narrador',
        text: 'Marta atende ao telefone com um conselheiro financeiro, desliga bruscamente e olha para o relógio de pulso.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'Rafa, a reunião com a Orbe é amanhã cedo. Eu não tenho espaço para nuance. Dois minutos.',
      },
    ],
    next: 'R06',
  },

  // Decisão R06
  {
    id: 'R06',
    kind: 'decision',
    type: 'P',
    chapter: 4,
    clock: 'QUI · 10:00',
    bg: 'sala_reuniao',
    pov: 'rafa',
    prompt: 'Marta te dá apenas dois minutos. Como você expõe o problema?',
    next: 'L07_intro',
    options: [
      {
        id: 'a',
        text: 'Mostra um único número: o custo total real do Plano Ajuste',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: '"R$ 1,42 a mais por quilo entregue na gôndola. O fornecedor barato é mais caro na ponta."',
          },
        ],
        reportSnippet: 'Diante do ultimato de tempo da diretoria, você focou no dado síntese do custo total real.',
      },
      {
        id: 'b',
        text: 'Desenha na lousa os dois fluxos, lado a lado',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Com giz na lousa verde, dois diagramas simples mostram onde o novo plano vaza dinheiro.',
          },
        ],
        reportSnippet: 'Você esquematizou na lousa o diagrama comparativo dos dois fluxos de fornecimento.',
      },
      {
        id: 'c',
        text: 'Conta a história do lote devolvido em Campinas como exemplo concreto',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'A narrativa rápida sobre as 400 caixas mofadas em Campinas faz Marta parar e escutar com atenção.',
          },
        ],
        reportSnippet: 'Para sensibilizar a diretoria, você narrou o caso real de um lote devolvido por perda de qualidade.',
      },
      {
        id: 'd',
        text: 'Propõe um meio-termo: testar o fornecedor novo em uma linha só',
        tags: { 'INTER.CONF': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: '"Se a diretoria insiste na troca, testamos num piloto de 10% sem romper com a cooperativa."',
          },
        ],
        reportSnippet: 'Você propôs uma negociação equilibrada: rodar um lote piloto antes de qualquer ruptura drástica.',
      },
    ],
  },

  // Transição L07
  {
    id: 'L07_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 12:50',
    bg: 'open_space_marketing',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '13h. O material conceitual da campanha "Origem" está quase finalizado na estação de trabalho de Lia.',
      },
      {
        speaker: 'narrador',
        text: 'Amanhã à tarde acontece o pitch decisivo na sede do Grupo Orbe. Lia tem mais uma hora livre para refinar a entrega.',
      },
      {
        speaker: 'lia',
        expression: 'neutro',
        text: 'É a última oportunidade para colocar o diferencial que vai chamar a atenção do comprador na mesa.',
      },
    ],
    next: 'L07',
  },

  // Decisão L07
  {
    id: 'L07',
    kind: 'decision',
    type: 'P',
    chapter: 4,
    clock: 'QUI · 13:00',
    bg: 'open_space_marketing',
    pov: 'lia',
    prompt: 'No que você investe a última hora?',
    next: 'B07_intro',
    options: [
      {
        id: 'a',
        text: 'Num jingle curto para o vídeo',
        tags: { 'MUS': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Uma batida acústica curta e cativante que dá ritmo aos cinco segundos finais do vídeo institucional.',
          },
        ],
        reportSnippet: 'Na reta final de criação, você investiu no ritmo sonoro com um jingle envolvente para o vídeo.',
      },
      {
        id: 'b',
        text: 'Nas fotos dos ingredientes na terra, com a luz do fim da tarde',
        tags: { 'NAT': 2, 'ESP': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Imagens de alta resolução da lavoura de aveia dourada ao pôr do sol saltam aos olhos no slide.',
          },
        ],
        reportSnippet: 'Você escolheu destacar a beleza visual e autêntica da colheita dos grãos na terra.',
      },
      {
        id: 'c',
        text: 'No roteiro do vídeo, com a voz do Jorge contando a história',
        tags: { 'LIN': 2, 'INTER.EMP': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'A locução do Seu Jorge com sua voz acolhedora do interior traz humanidade imediata à marca.',
          },
        ],
        reportSnippet: 'Você estruturou a narrativa em torno do depoimento humano e emocionado do operador veterano.',
      },
      {
        id: 'd',
        text: 'Num protótipo físico da embalagem, montado à mão em papel',
        tags: { 'COR': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Tesoura, cola e papel craft. Segurar a embalagem física na mão transmite solidez e tangibilidade.',
          },
        ],
        reportSnippet: 'Você confeccionou à mão um protótipo físico da nova embalagem para a mesa de reunião.',
      },
    ],
  },

  // Transição B07
  {
    id: 'B07_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 14:50',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '15h no galpão. Marta desce as escadas e autoriza Bruno a falar com o time sobre as negociações em curso.',
      },
      {
        speaker: 'narrador',
        text: 'Os operadores desligam as esteiras e se reúnem em semicírculo diante da bancada de conferência.',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'Olhares tensos e cheios de expectativa encaram o coordenador. A hora da verdade chegou para o galpão.',
      },
    ],
    next: 'B07',
  },

  // Decisão B07
  {
    id: 'B07',
    kind: 'decision',
    type: 'P',
    chapter: 4,
    clock: 'QUI · 15:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'A equipe inteira espera a sua palavra sobre os cortes.',
    next: 'R07_intro',
    options: [
      {
        id: 'a',
        text: 'Faz uma fala honesta e preparada, olhando cada um nos olhos',
        tags: { 'INTER.COM': 2, 'LIN': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno fala com calma e firmeza. A verdade transparente gera respeito imediato na equipe.',
          },
        ],
        reportSnippet: 'Ao falar sobre possíveis cortes, você fez um discurso direto e sincero olhando nos olhos do time.',
      },
      {
        id: 'b',
        text: 'Trabalha lado a lado com a equipe a tarde toda antes de falar, para estar presente',
        tags: { 'COR': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno carrega fardos e confere paletes ombro a ombro com o time. Sua presença física acalma o chão.',
          },
        ],
        reportSnippet: 'Você escolheu suar junto na operação a tarde inteira para estar fisicamente presente com a equipe.',
      },
      {
        id: 'c',
        text: 'Mostra num quadro o plano alternativo e onde cada um entra',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Bruno desenha no quadro de recados a rota conjunta e como a eficiência do galpão salva postos.',
          },
        ],
        reportSnippet: 'Você desenhou no quadro operacional o plano alternativo demonstrando a contribuição de cada um.',
      },
      {
        id: 'd',
        text: 'Conversa um a um, começando por quem está mais abalado',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno chama primeiro Dani e Jorge em reservado, ouvindo com empatia as angústias de cada um.',
          },
        ],
        reportSnippet: 'Você preferiu conversar individualmente com as pessoas mais vulneráveis antes do comunicado geral.',
      },
    ],
  },

  // Transição R07
  {
    id: 'R07_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 17:50',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '18h. Rafa encara o modelo financeiro final na tela. A complexidade dos números travou o raciocínio.',
      },
      {
        speaker: 'narrador',
        text: 'Ele precisa conectar o desconto de 6% oferecido pela cooperativa com a economia na rota compartilhada.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'Falta amarrar essa correlação para o relatório ficar inquestionável na mesa de compras.',
      },
    ],
    next: 'R07',
  },

  // Decisão R07
  {
    id: 'R07',
    kind: 'decision',
    type: 'P',
    chapter: 4,
    clock: 'QUI · 18:00',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    prompt: 'Rafa trava na análise final da proposta. O que você faz?',
    next: 'N1_intro',
    options: [
      {
        id: 'a',
        text: 'Reestrutura o modelo em três cenários',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Cenário conservador, moderado e agressivo. A matriz fica clara e à prova de contestações.',
          },
        ],
        reportSnippet: 'Diante do bloqueio nos números, você reorganizou a análise em três cenários probabilísticos.',
      },
      {
        id: 'b',
        text: 'Volta aos dados de safra da cooperativa: clima, colheita, sazonalidade',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'A sazonalidade da colheita de inverno mostra economia adicional de estocagem.',
          },
        ],
        reportSnippet: 'Você recorreu aos dados naturais de safra e clima para encontrar ganhos de estocagem.',
      },
      {
        id: 'c',
        text: 'Levanta e trabalha de pé, andando pela sala e falando sozinho',
        tags: { 'COR': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Caminhar de um lado para o outro articulando os argumentos destrava a lógica financeira.',
          },
        ],
        reportSnippet: 'Você se levantou para andar pela sala e pensar em movimento para destravar o raciocínio.',
      },
      {
        id: 'd',
        text: 'Chama Lia e Bruno para revisarem juntos',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Lia traz o olhar do consumidor e Bruno valida a viabilidade do frete. A proposta ganha corpo.',
          },
        ],
        reportSnippet: 'Você chamou Lia e Bruno para cruzar a visão financeira com o marketing e as operações.',
      },
    ],
  },

  // Transição N1 (Narrativa - Apresentação da Sofia)
  {
    id: 'N1_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 18:55',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '19h. O galpão começa a esvaziar. No bolso de Bruno, o alarme toca: "Apresentação da Sofia - 19h30".',
      },
      {
        speaker: 'narrador',
        text: 'A apresentação de dança da filha começa em meia hora na escola do bairro.',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'Se eu sair agora, chego a tempo na escola. Mas os dados do frete ainda precisam de conferência.',
      },
    ],
    next: 'N1',
  },

  // Decisão N1 (Narrativa - Sem pontuação, afeta flag F_SOFIA)
  {
    id: 'N1',
    kind: 'decision',
    type: 'N',
    chapter: 4,
    clock: 'QUI · 19:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'A apresentação da Sofia começa às 19h30. Qual a sua escolha?',
    next: 'K5_intro',
    options: [
      {
        id: 'a',
        text: 'Vai à apresentação e volta para o galpão depois',
        effects: [{ op: 'set', flag: 'F_SOFIA', value: true }],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Bruno senta na primeira fila da escola. O sorriso de Sofia ao avistar o pai vale cada esforço.',
          },
        ],
      },
      {
        id: 'b',
        text: 'Fica no galpão e pede à mãe da Sofia para filmar',
        effects: [{ op: 'set', flag: 'F_SOFIA', value: false }],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: 'Bruno fecha a porta do galpão com o peito apertado e liga para a mãe da Sofia pedindo os vídeos.',
          },
        ],
      },
    ],
  },

  // Transição K5
  {
    id: 'K5_intro',
    kind: 'scene',
    chapter: 4,
    clock: 'QUI · 20:55',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '21h. O telefone de Bruno toca no galpão. É o Seu Antônio, da Cooperativa Vale Verde.',
      },
      {
        speaker: 'seu_antonio',
        expression: 'sorrindo',
        text: 'Bruno, reunimos a cooperativa. Aceitamos baixar 6% se a Raiz fechar por 12 meses e dividirmos o frete!',
      },
    ],
    next: 'K5',
  },

  // Decisão-Chave K5
  {
    id: 'K5',
    kind: 'decision',
    type: 'K',
    chapter: 4,
    clock: 'QUI · 21:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'A cooperativa oferece 6% de desconto com contrato de 12 meses e frete compartilhado. O que você faz?',
    next: 'cap4_end',
    options: [
      {
        id: 'a',
        text: 'Faz uma chamada com Lia, Rafa e Seu Antônio, e os quatro constroem a proposta juntos',
        effects: [
          { op: 'add', var: 'LB', value: 1 },
          { op: 'add', var: 'RL', value: 1 },
          { op: 'add', var: 'COOP', value: 1 },
        ],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Em uma chamada de vídeo de 30 minutos, o quarteto alinha números, rotas e storytelling.',
          },
        ],
      },
      {
        id: 'b',
        text: 'Negocia sozinho com Seu Antônio, rápido, e fecha os termos',
        effects: [{ op: 'add', var: 'COOP', value: 1 }],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno fecha o acordo diretamente com Seu Antônio, garantindo os 6% antes do pitch de amanhã.',
          },
        ],
      },
      {
        id: 'c',
        text: 'Agradece, mas recusa: não há tempo, e o Plano Ajuste já está aprovado',
        effects: [{ op: 'add', var: 'BR', value: -1 }],
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: 'Bruno agradece, mas desiste da cooperativa por achar que a diretoria não aceitará.',
          },
        ],
      },
    ],
  },

  // Fim do Cap 4
  {
    id: 'cap4_end',
    kind: 'chapterEnd',
    chapter: 4,
    next: 'cap5_intro',
  },
];
