import { GameNode } from '@/content/tags';

export const cap5Story: GameNode[] = [
  // Abertura Cap 5
  {
    id: 'cap5_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 06:50',
    bg: 'quarto_lia_manha',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Sexta-feira, 7h da manhã. O dia da reunião decisiva com o Grupo Orbe chegou.',
      },
      {
        speaker: 'lia',
        expression: 'tenso',
        text: 'Dormi menos de quatro horas. O estômago tá dando voltas, mas hoje é o dia.',
      },
    ],
    next: 'L08',
  },

  // Decisão L08
  {
    id: 'L08',
    kind: 'decision',
    type: 'P',
    chapter: 5,
    clock: 'SEX · 07:00',
    bg: 'quarto_lia_manha',
    pov: 'lia',
    prompt: 'A ansiedade aperta antes do pitch. O que você faz?',
    next: 'B08_intro',
    options: [
      {
        id: 'a',
        text: 'Ensaia a fala andando e gesticulando pelo quarto',
        tags: { 'COR': 2, 'LIN': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Gesticular e caminhar pelo quarto solta a voz e traz naturalidade para as frases.',
          },
        ],
        reportSnippet: 'Na manhã da reunião decisiva, você ensaiou a apresentação caminhando e gesticulando pelo quarto.',
      },
      {
        id: 'b',
        text: 'Lista o que pode dar errado e o que fará em cada caso',
        tags: { 'INTRA.REG': 2, 'LOG': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Mapear os cenários de risco no papel devolve o controle emocional: para cada dúvida, uma resposta.',
          },
        ],
        reportSnippet: 'Você mapeou os possíveis riscos da apresentação e planejou respostas objetivas para cada um.',
      },
      {
        id: 'c',
        text: 'Lembra por que escolheu Administração e o que quer construir',
        tags: { 'INTRA.MOT': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia recorda a trajetória de Itaquera até aqui. O propósito de fazer a diferença reacende a coragem.',
          },
        ],
        reportSnippet: 'Antes do pitch decisivo, você se conectou ao seu propósito pessoal e à escolha pela carreira.',
      },
      {
        id: 'd',
        text: 'Vai a pé até o metrô pelo parque, para chegar mais calma',
        tags: { 'NAT': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Vinte minutos sob as copas das árvores no parque do bairro diminuem a pulsação antes do trem.',
          },
        ],
        reportSnippet: 'Você optou por caminhar em meio à natureza no caminho do metrô para acalmar a mente.',
      },
    ],
  },

  // Transição B08
  {
    id: 'B08_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 12:50',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '13h no galpão. Os operadores estão reunidos em torno da bancada de expedição.',
      },
      {
        speaker: 'bruno',
        expression: 'tenso',
        text: 'A reunião na sede da Orbe começa às 15h. O nervosismo no olhar da equipe é palpável.',
      },
    ],
    next: 'B08',
  },

  // Decisão B08
  {
    id: 'B08',
    kind: 'decision',
    type: 'P',
    chapter: 5,
    clock: 'SEX · 13:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'A equipe está reunida e ansiosa no galpão.',
    next: 'R08_intro',
    options: [
      {
        id: 'a',
        text: 'Fala: "Aconteça o que acontecer, vocês vão saber por mim, primeiro"',
        tags: { 'INTER.COM': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: '"Ninguém aqui vai ficar sabendo de nada por fofoca. Eu tô com vocês até o fim".',
          },
        ],
        reportSnippet: 'Diante da ansiedade coletiva, você garantiu transparência absoluta e compromisso com o time.',
      },
      {
        id: 'b',
        text: 'Organiza todo mundo para preparar juntos as amostras do pitch',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Kaio, Dani e Jorge preparam fardos impecáveis de amostra com laços de palha para a reunião.',
          },
        ],
        reportSnippet: 'Você envolveu toda a equipe na preparação colaborativa das amostras do produto para o pitch.',
      },
      {
        id: 'c',
        text: 'Puxa um parabéns para o Jorge, que faz aniversário hoje',
        tags: { 'MUS': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Palmas e cantoria ecoam pela doca. O sorriso tímido do Jorge quebra a armadura de tensão.',
          },
        ],
        reportSnippet: 'Você quebrou o clima pesado celebrando o aniversário do operador veterano com cantoria na doca.',
      },
      {
        id: 'd',
        text: 'Lembra a si mesmo por que vale a pena lutar por esse time',
        tags: { 'INTRA.MOT': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno observa as mãos calejadas trabalhando juntas. Liderar com humanidade é o que dá sentido a tudo.',
          },
        ],
        reportSnippet: 'Ao ver o time reunido, você reafirmou internamente seus valores de liderança e compromisso humano.',
      },
    ],
  },

  // Transição R08
  {
    id: 'R08_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 14:45',
    bg: 'sala_orbe',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '14h50. Antessala do Grupo Orbe. Prédio espelhado na Faria Lima.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'Notificação do comprador da Orbe: "Tragam apenas os números finais de redução. Não temos tempo para discurso".',
      },
    ],
    next: 'R08',
  },

  // Decisão R08
  {
    id: 'R08',
    kind: 'decision',
    type: 'P',
    chapter: 5,
    clock: 'SEX · 14:50',
    bg: 'sala_orbe',
    pov: 'rafa',
    prompt: 'Chega a mensagem do comprador da Orbe antes de entrar na sala.',
    next: 'K6_intro',
    options: [
      {
        id: 'a',
        text: 'Revisa a planilha final mais uma vez',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Rafa abre o notebook no colo e confere mais uma vez os percentuais de desconto e custo de frete.',
          },
        ],
        reportSnippet: 'Na antessala do cliente, você revisou rigorosamente os números finais da planilha.',
      },
      {
        id: 'b',
        text: 'Prepara um slide visual da cadeia, da roça à gôndola',
        tags: { 'ESP': 2, 'NAT': 1 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Um infográfico em três etapas sintetiza o valor agregado da cooperativa em um segundo de tela.',
          },
        ],
        reportSnippet: 'Você preparou um slide visual esquematizando a cadeia produtiva da lavoura até o supermercado.',
      },
      {
        id: 'c',
        text: 'Respira e aceita que fez o que estava ao seu alcance',
        tags: { 'INTRA.REG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Rafa fecha os olhos por dez segundos. O trabalho foi rigoroso; agora é manter a serenidade.',
          },
        ],
        reportSnippet: 'Antes de entrar na sala do cliente, você respirou fundo e aceitou que havia dado o seu melhor.',
      },
      {
        id: 'd',
        text: 'Combina com Lia e Bruno quem responde que tipo de pergunta',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: '"Lia cuida da campanha e da imagem, Bruno fala de prazo e rota, eu seguro margem e custo".',
          },
        ],
        reportSnippet: 'Na antessala, você alinhou a divisão de papéis e respostas entre o trio para a reunião.',
      },
    ],
  },

  // Transição K6
  {
    id: 'K6_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 15:15',
    bg: 'sala_orbe',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '15h20. Sala de reunião do Grupo Orbe. A mesa de mogno reflete as luzes frias do teto.',
      },
      {
        speaker: 'patricia',
        expression: 'tenso',
        text: '...e apresentamos nossa nova linha com proposta visual moderna para as gôndolas da Orbe...',
      },
      {
        speaker: 'henrique',
        expression: 'tenso',
        text: 'Patrícia, corta o floreio. Por que eu pagaria mais por essa granola se os concorrentes cobram 18% a menos?',
      },
      {
        speaker: 'narrador',
        text: 'Silêncio total. Patrícia congela e olha fixamente para Lia.',
      },
    ],
    next: 'K6',
  },

  // Decisão-Chave K6 (com timer de 15s)
  {
    id: 'K6',
    kind: 'decision',
    type: 'K',
    chapter: 5,
    clock: 'SEX · 15:20',
    bg: 'sala_orbe',
    pov: 'lia',
    timerSec: 15,
    timeoutOption: 'c',
    prompt: 'Henrique questiona o valor da marca no silêncio da sala. O que Lia faz?',
    next: 'K6_pos',
    options: [
      {
        id: 'a',
        text: 'Lia apresenta a campanha "Origem" e dá crédito à equipe e à cooperativa',
        effects: [{ op: 'set', flag: 'F_VOZ', value: true }],
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: '"Porque nenhuma concorrente entrega a história da Cooperativa Vale Verde e o frescor rastreado que o seu cliente valoriza!".',
          },
        ],
      },
      {
        id: 'b',
        text: 'Lia passa à Patrícia a página do caderno, e as duas apresentam juntas',
        effects: [{ op: 'set', flag: 'F_VOZ', value: true }],
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia desliza o layout para Patrícia e as duas dividem a apresentação de forma sincronizada e firme.',
          },
        ],
      },
      {
        id: 'c',
        text: 'Lia fica em silêncio',
        effects: [{ op: 'set', flag: 'F_VOZ', value: false }],
        reaction: [
          {
            speaker: 'lia',
            expression: 'tenso',
            text: 'Lia hesita e o silêncio se prolonga. Patrícia tenta gaguejar uma resposta genérica sobre mercado.',
          },
        ],
      },
    ],
  },

  // Pós K6
  {
    id: 'K6_pos',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 15:45',
    bg: 'sala_orbe',
    pov: 'lia',
    lines: [
      {
        speaker: 'henrique',
        expression: 'neutro',
        text: 'O comprador fecha o tablet e apoia as mãos na mesa.',
      },
      {
        speaker: 'henrique',
        expression: 'neutro',
        text: 'Entendi o ponto de vocês. Levo para o comitê de compras e envio a resposta oficial até as 18h.',
      },
    ],
    next: 'L09_intro',
  },

  // Transição L09
  {
    id: 'L09_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 16:25',
    bg: 'corredor_vidro',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '16h30. De volta à Raiz Alimentos. O ar condicionado sussurra no corredor envidraçado.',
      },
      {
        speaker: 'lia',
        expression: 'neutro',
        text: 'O pitch passou. Agora é esperar até as 18h pelo veredito.',
      },
    ],
    next: 'L09',
  },

  // Decisão L09
  {
    id: 'L09',
    kind: 'decision',
    type: 'P',
    chapter: 5,
    clock: 'SEX · 16:30',
    bg: 'corredor_vidro',
    pov: 'lia',
    prompt: 'Na espera da resposta da Orbe, o que você faz no corredor?',
    next: 'B09_intro',
    options: [
      {
        id: 'a',
        text: 'Põe uma música e deixa o corpo desacelerar, pensando em quem estava com ela',
        tags: { 'MUS': 2, 'INTER.EMP': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Uma canção tranquila nos fones. Lia recorda os rostos de Bruno, Rafa e Seu Jorge ao longo da semana.',
          },
        ],
        reportSnippet: 'Após a reunião tensa, você usou a música para desacelerar lembrando de quem esteve ao seu lado.',
      },
      {
        id: 'b',
        text: 'Agradece pessoalmente a cada pessoa que ajudou',
        tags: { 'INTER.COM': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'Lia passa na mesa de Rafa, na copa e na expedição agradecendo pelo apoio e confiança mútua.',
          },
        ],
        reportSnippet: 'Você fez questão de percorrer a empresa agradecendo pessoalmente a cada pessoa envolvida.',
      },
      {
        id: 'c',
        text: 'Desenha no caderno a cena da reunião, para nunca esquecer',
        tags: { 'COR': 2, 'ESP': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'O traço a carvão registra a mesa de vidro, a expressão de Henrique e o caderno aberto.',
          },
        ],
        reportSnippet: 'Você registrou no papel um desenho da cena da reunião para eternizar o aprendizado.',
      },
      {
        id: 'd',
        text: 'Pensa no que aprendeu sobre si mesma nesta semana',
        tags: { 'INTRA.REF': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Da insegurança do domingo à voz firme na sala da Orbe. O crescimento em cinco dias foi imenso.',
          },
        ],
        reportSnippet: 'Em silêncio no corredor, você refletiu profundamente sobre sua evolução pessoal ao longo da semana.',
      },
    ],
  },

  // Transição B09
  {
    id: 'B09_intro',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 16:55',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: '17h no galpão. A tensão da espera consome a paciência de todos.',
      },
      {
        speaker: 'kaio',
        expression: 'tenso',
        text: 'Chega de conversa mole! Se a Orbe sair, eu já tô fora também! Esse lugar não tem futuro!',
      },
      {
        speaker: 'jorge',
        expression: 'tenso',
        text: 'Cala a boca, Kaio! Respeita a casa que bota comida na tua mesa!',
      },
    ],
    next: 'B09',
  },

  // Decisão B09
  {
    id: 'B09',
    kind: 'decision',
    type: 'P',
    chapter: 5,
    clock: 'SEX · 17:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'Na espera da resposta, Kaio e Jorge explodem novamente de nervoso.',
    next: 'veredicto_18h',
    options: [
      {
        id: 'a',
        text: 'Junta os dois e define uma regra clara para o resto do dia',
        tags: { 'INTER.CONF': 2, 'LOG': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: '"Parou os dois. Ninguém grita no meu galpão. Cada um no seu posto até as 18h".',
          },
        ],
        reportSnippet: 'Diante do novo atrito, você interveio e estabeleceu regras objetivas de convivência para o galpão.',
      },
      {
        id: 'b',
        text: 'Escreve no grupo da equipe uma mensagem cuidadosa sobre a tarde',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno envia um texto maduro no WhatsApp da equipe acolhendo o cansaço e pedindo serenidade.',
          },
        ],
        reportSnippet: 'Você redigiu uma mensagem cuidadosa no canal da equipe para reestabelecer a harmonia.',
      },
      {
        id: 'c',
        text: 'Monta duplas para o resto do turno e põe Kaio e Jorge juntos, um apoiando o outro',
        tags: { 'INTER.COL': 2, 'INTER.EMP': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'Trabalhando juntos na mesma paleteira, a agilidade do jovem e a técnica do idoso se complementam.',
          },
        ],
        reportSnippet: 'Você formou duplas de trabalho unindo veterano e novato para transformar atrito em colaboração.',
      },
      {
        id: 'd',
        text: 'Puxa o Kaio de lado: "Eu sei que é medo. O meu também"',
        tags: { 'INTER.EMP': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno acolhe a agressividade de Kaio com compreensão. O jovem desmonta e pede desculpas.',
          },
        ],
        reportSnippet: 'Você desarmou a agressividade do novato acolhendo o medo que estava por trás daquela reação.',
      },
    ],
  },

  // 18h · Resposta da Orbe -> Resolução do Final
  {
    id: 'veredicto_18h',
    kind: 'scene',
    chapter: 5,
    clock: 'SEX · 18:00',
    bg: 'sala_reuniao',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: '18h em ponto. O relógio da parede bate a hora final. O e-mail do Grupo Orbe chega à caixa de Marta.',
      },
      {
        speaker: 'marta',
        expression: 'tenso',
        text: 'O comitê da Orbe enviou a resposta.',
      },
    ],
    next: 'resolve_ending',
  },

  // Nó para resolver o final oficial (§7.1)
  {
    id: 'resolve_ending',
    kind: 'resolveEnding',
  },
];
