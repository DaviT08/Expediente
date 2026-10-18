import { GameNode } from '@/content/tags';

export const cap2Story: GameNode[] = [
  // Abertura Cap 2
  {
    id: 'cap2_intro',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 08:50',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: 'Terça-feira, 9h da manhã. O sol entra pelas frestas da persiana sobre a mesa de trabalho de Rafa.',
      },
      {
        speaker: 'narrador',
        text: 'Duas canecas de café repousam ao lado do teclado. Rafa compara as planilhas do Plano Ajuste com as notas fiscais.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'Tem algo muito estranho nessa proposta da Graneleira Sul. O preço por quilo na tabela parece milagroso.',
      },
      {
        speaker: 'narrador',
        text: 'Ao abrir o anexo técnico confidencial, o analista descobre o ponto cego: a taxa de lotes rejeitados é três vezes maior.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'Ninguém colocou esse descarte na conta final da diretoria. Estão comparando maçãs com laranjas.',
      },
    ],
    next: 'R03',
  },

  // Decisão R03
  {
    id: 'R03',
    kind: 'decision',
    type: 'P',
    chapter: 2,
    clock: 'TER · 09:00',
    bg: 'mesa_rafa_dia',
    pov: 'rafa',
    prompt: 'Como você confirma a suspeita?',
    next: 'L03_intro',
    options: [
      {
        id: 'a',
        text: 'Roda uma simulação de custo total, com perdas e frete',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'A simulação computa as perdas por descarte e a rota rodoviária mais longa. O valor por quilo entregue dispara na ponta.',
          },
        ],
        reportSnippet: 'Ao desconfiar do fornecedor substituto, você rodou uma simulação de custo total com perdas e frete.',
      },
      {
        id: 'b',
        text: 'Monta um mapa das devoluções por região',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Círculos vermelhos no mapa de distribuição mostram onde os lotes estragam antes de chegar.',
          },
        ],
        reportSnippet: 'Para checar os dados do fornecedor, você mapeou as devoluções geograficamente na tela.',
      },
      {
        id: 'c',
        text: 'Liga para o Seu Antônio e escuta como a cooperativa cuida do frescor',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'seu_antonio',
            expression: 'sorrindo',
            text: '"Filho, a gente colhe e seca em 24 horas. O produto não dorme em armazém úmido."',
          },
        ],
        reportSnippet: 'Você procurou o fornecedor atual para escutar como a cooperativa garantia o frescor do produto.',
      },
      {
        id: 'd',
        text: 'Lê, um por um, os comentários escritos nas reclamações de clientes',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: '"Gosto amargo", "grãos quebrados". Os relatos literais dos consumidores confirmam a fragilidade.',
          },
        ],
        reportSnippet: 'Para investigar a qualidade, você leu um a um os relatos textuais no SAC dos clientes.',
      },
    ],
  },

  // Transição L03
  {
    id: 'L03_intro',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 10:20',
    bg: 'open_space_marketing',
    pov: 'lia',
    lines: [
      {
        speaker: 'narrador',
        text: 'Mezanino do marketing. Lia encara as anotações do dia anterior espalhadas ao redor do teclado.',
      },
      {
        speaker: 'narrador',
        text: 'O prazo de Patrícia se aproxima. Amanhã de manhã o novo conceito visual precisa estar pronto para apresentação.',
      },
      {
        speaker: 'lia',
        expression: 'neutro',
        text: 'Se a gente vai brigar por espaço na gôndola da Orbe, o conceito precisa ter uma identidade verdadeira.',
      },
    ],
    next: 'L03',
  },

  // Decisão L03
  {
    id: 'L03',
    kind: 'decision',
    type: 'P',
    chapter: 2,
    clock: 'TER · 10:30',
    bg: 'open_space_marketing',
    pov: 'lia',
    prompt: 'Qual caminho você escolhe?',
    next: 'M3_scene',
    options: [
      {
        id: 'a',
        text: 'Um texto curto e forte que conta a marca em uma frase',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: '"Alimento de verdade, do campo para quem vive a cidade". Frase enxuta e memorável.',
          },
        ],
        reportSnippet: 'Ao criar o conceito da embalagem, você apostou numa síntese verbal curta e marcante.',
      },
      {
        id: 'b',
        text: 'Um layout em que a embalagem "abre" como uma janela para a lavoura',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'O rascunho visual simula uma janela de celeiro que revela os grãos transparentes.',
          },
        ],
        reportSnippet: 'Na proposta da embalagem, você concebeu um layout visual que se abre como janela para o campo.',
      },
      {
        id: 'c',
        text: 'Um selo que explica a safra de cada ingrediente e por que o sabor muda',
        tags: { 'NAT': 2, 'LOG': 1 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'neutro',
            text: 'Um selo sazonal ligando chuva, colheita e notas naturais de castanha e cacau.',
          },
        ],
        reportSnippet: 'Você optou por valorizar a sazonalidade e o ciclo natural dos ingredientes na comunicação.',
      },
      {
        id: 'd',
        text: 'Ir ao mercado da esquina e conversar com três clientes sobre o que sentem pela marca',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'lia',
            expression: 'sorrindo',
            text: 'No corredor do mercadinho, ouvir uma mãe e dois jovens revelou o afeto real pela marca.',
          },
        ],
        reportSnippet: 'Você foi até o ponto de venda para ouvir diretamente o que os consumidores sentiam pela marca.',
      },
    ],
  },

  // Momento fixo M3
  {
    id: 'M3_scene',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 12:40',
    bg: 'elevador',
    pov: 'lia',
    effects: [{ op: 'add', var: 'RL', value: 1 }],
    lines: [
      {
        speaker: 'narrador',
        text: 'Ao meio-dia, o elevador de carga entre o mezanino e o galpão dá um solavanco brusco e para entre os andares.',
      },
      {
        speaker: 'lia',
        expression: 'tenso',
        text: 'Travou? É sério isso?! Justo hoje que eu tô cheia de entrega para fechar com a coordenação...',
      },
      {
        speaker: 'rafa',
        expression: 'sorrindo',
        text: 'Pelo menos aqui dentro ninguém pede relatório urgente. Para ser bem sincero, mal consegui pregar o olho esta noite.',
      },
      {
        speaker: 'narrador',
        text: 'A conversa constrangida se transforma em uma gargalhada sincera de desabafo. A luz pisca e o motor volta a funcionar.',
      },
      {
        speaker: 'lia',
        expression: 'sorrindo',
        text: 'Acho que tá todo mundo segurando a respiração nesta semana, Rafa.',
      },
    ],
    next: 'B03_intro',
  },

  // Transição B03
  {
    id: 'B03_intro',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 14:55',
    bg: 'galpao_dia',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Galpão, meio da tarde. O barulho mecânico das esteiras ecoa pelo telhado alto de zinco.',
      },
      {
        speaker: 'narrador',
        text: 'Seu Jorge se aproxima de Bruno no canto da fita de empacotamento, com o olhar cabisbaixo.',
      },
      {
        speaker: 'jorge',
        expression: 'tenso',
        text: 'Bruno... ouvi uma conversa no vestiário dizendo que vão cortar gente. Eu tenho 58 anos. Se me mandarem embora, não acho nada.',
      },
      {
        speaker: 'narrador',
        text: 'Bruno ainda não tem nenhuma confirmação oficial da diretoria, mas sabe do aperto financeiro.',
      },
    ],
    next: 'B03',
  },

  // Decisão B03
  {
    id: 'B03',
    kind: 'decision',
    type: 'P',
    chapter: 2,
    clock: 'TER · 15:00',
    bg: 'galpao_dia',
    pov: 'bruno',
    prompt: 'Jorge espera uma resposta.',
    next: 'B04_intro',
    options: [
      {
        id: 'a',
        text: 'Escuta sem prometer nada e pergunta como ele está lidando com isso',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno apoia a mão no ombro do veterano e escuta com calma o desabafo sobre sua família e seus planos.',
          },
        ],
        reportSnippet: 'Na terça, quando o Jorge falou do medo, você escolheu escutar antes de prometer.',
      },
      {
        id: 'b',
        text: 'Percebe a própria angústia e admite: "Eu também tô com medo"',
        tags: { 'INTRA.AUTO': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'tenso',
            text: '"Jorge, eu também tô com medo, de verdade. Mas tamo junto nessa, firmeza?".',
          },
        ],
        reportSnippet: 'Diante do desabafo sobre demissão, você admitiu com sinceridade o seu próprio medo.',
      },
      {
        id: 'c',
        text: 'Mostra no layout do galpão como vão reorganizar o turno para segurar o ritmo',
        tags: { 'ESP': 2, 'COR': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Bruno desenha na bancada: se alternarem as esteiras, ninguém fica sobrecarregado.',
          },
        ],
        reportSnippet: 'Para acalmar a incerteza no galpão, você mostrou no layout físico como reorganizar o turno.',
      },
      {
        id: 'd',
        text: 'Explica com clareza o que sabe e o que não sabe',
        tags: { 'INTER.COM': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: '"Jorge, a pressão da Orbe é real, mas não tem nada fechado. Assim que eu souber de algo oficial, te falo".',
          },
        ],
        reportSnippet: 'Diante dos boatos, você foi direto e transparente sobre o que sabia e o que não sabia.',
      },
    ],
  },

  // Transição B04
  {
    id: 'B04_intro',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 20:50',
    bg: 'casa_bruno_noite',
    pov: 'bruno',
    lines: [
      {
        speaker: 'narrador',
        text: 'Noite na casa de Bruno. A mesa de jantar está posta e na sala a pequena Sofia ensaia passos de dança.',
      },
      {
        speaker: 'sofia',
        expression: 'sorrindo',
        text: 'Pai, olha essa pirueta! A apresentação da escola é quinta-feira, às 19h30! Promete que vai estar na primeira fila?',
      },
      {
        speaker: 'narrador',
        text: 'Bruno sente o corpo inteiro pedir trégua após dez horas de correria na expedição da Raiz.',
      },
    ],
    next: 'B04',
  },

  // Decisão B04
  {
    id: 'B04',
    kind: 'decision',
    type: 'P',
    chapter: 2,
    clock: 'TER · 21:00',
    bg: 'casa_bruno_noite',
    pov: 'bruno',
    prompt: 'Como você recarrega?',
    next: 'R04_intro',
    options: [
      {
        id: 'a',
        text: 'Pega o cavaquinho e acompanha a Sofia no ensaio',
        tags: { 'MUS': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'sorrindo',
            text: 'O dedilhado do cavaquinho enche a sala. Sofia ri e dança no compasso alegre da música.',
          },
        ],
        reportSnippet: 'Para aliviar a exaustão da terça, você pegou o cavaquinho para tocar junto da sua filha.',
      },
      {
        id: 'b',
        text: 'Escreve no celular um rascunho do que vai dizer à equipe',
        tags: { 'LIN': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Palavra por palavra no bloco de notas: firmeza, respeito e transparência.',
          },
        ],
        reportSnippet: 'Na noite de terça, você estruturou por escrito o que pretendia falar para sua equipe.',
      },
      {
        id: 'c',
        text: 'Sai para correr no quarteirão e tirar a tensão do corpo',
        tags: { 'COR': 2, 'INTRA.REG': 1 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'Vinte minutos de corrida no asfalto fresco. A respiração acelerada lava a tensão acumulada.',
          },
        ],
        reportSnippet: 'Você buscou descarregar o estresse acumulado em uma corrida noturna no quarteirão.',
      },
      {
        id: 'd',
        text: 'Fica em silêncio na varanda pensando em que tipo de líder quer ser',
        tags: { 'INTRA.REF': 2 },
        reaction: [
          {
            speaker: 'bruno',
            expression: 'neutro',
            text: 'O vento frio da noite na varanda. Bruno reflete sobre proteger sua equipe sem carregar tudo sozinho.',
          },
        ],
        reportSnippet: 'Em silêncio na varanda, você refletiu profundamente sobre que tipo de líder deseja ser.',
      },
    ],
  },

  // Transição R04
  {
    id: 'R04_intro',
    kind: 'scene',
    chapter: 2,
    clock: 'TER · 23:05',
    bg: 'mesa_rafa_noite',
    pov: 'rafa',
    lines: [
      {
        speaker: 'narrador',
        text: '23h10. O prédio comercial está quase deserto. Apenas o mezanino financeiro tem uma lâmpada acesa.',
      },
      {
        speaker: 'rafa',
        expression: 'tenso',
        text: 'A conta fecha e o resultado é incontestável. Trocar a cooperativa pela Graneleira Sul vai gerar prejuízo.',
      },
      {
        speaker: 'narrador',
        text: 'Rafa olha para o relatório assinado por Marta. Desmentir a diretora-geral envolve um risco político imenso.',
      },
    ],
    next: 'R04',
  },

  // Decisão R04
  {
    id: 'R04',
    kind: 'decision',
    type: 'P',
    chapter: 2,
    clock: 'TER · 23:10',
    bg: 'mesa_rafa_noite',
    pov: 'rafa',
    prompt: 'Você não consegue ir embora.',
    next: 'K2',
    options: [
      {
        id: 'a',
        text: 'Revisa as fórmulas mais uma vez, para ter certeza',
        tags: { 'LOG': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Mais uma checagem minuciosa de cada célula e soma ponderada. O resultado é irrefutável.',
          },
        ],
        reportSnippet: 'Tarde da noite, você rechecou cada fórmula matemática para ter certeza absoluta dos dados.',
      },
      {
        id: 'b',
        text: 'Se pergunta por que contradizer a chefe dá tanto medo, e escreve sobre isso',
        tags: { 'INTRA.REF': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Anotar a própria insegurança no diário clareia a mente: o medo é de desagradar, não dos números.',
          },
        ],
        reportSnippet: 'Antes de apresentar o erro à diretoria, você registrou reflexões sobre seu próprio receio de discordar.',
      },
      {
        id: 'c',
        text: 'Manda mensagem a um colega de confiança pedindo uma segunda opinião',
        tags: { 'INTER.COL': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Um áudio rápido para um colega auditor confirma: a lógica de custo total está impecável.',
          },
        ],
        reportSnippet: 'Na madrugada, você compartilhou a dúvida com um colega de confiança para ter uma segunda opinião.',
      },
      {
        id: 'd',
        text: 'Imagina a reunião de amanhã cena por cena, e como vai mostrar os números',
        tags: { 'ESP': 2 },
        reaction: [
          {
            speaker: 'rafa',
            expression: 'neutro',
            text: 'Rafa visualiza a sala, a reação de Marta e a ordem exata de abertura dos slides.',
          },
        ],
        reportSnippet: 'Você ensaiou mentalmente a reunião do dia seguinte, visualizando cada reação aos números.',
      },
    ],
  },

  // Decisão-Chave K2
  {
    id: 'K2',
    kind: 'decision',
    type: 'K',
    chapter: 2,
    clock: 'TER · 23:40',
    bg: 'mesa_rafa_noite',
    pov: 'rafa',
    prompt: 'O que fazer com a descoberta?',
    next: 'cap2_end',
    options: [
      {
        id: 'a',
        text: 'Levar primeiro ao Bruno, porque os números mexem com a equipe dele',
        effects: [
          { op: 'add', var: 'BR', value: 1 },
          { op: 'set', flag: 'F_DADOS', value: true },
          { op: 'set', flag: 'K2_A', value: true },
        ],
        reaction: [
          {
            speaker: 'rafa',
            expression: 'sorrindo',
            text: 'Rafa decide falar com Bruno pela manhã. Construir a solução com as operações é o caminho mais sólido.',
          },
        ],
      },
      {
        id: 'b',
        text: 'Guardar por enquanto, até ter certeza absoluta',
        effects: [],
        reaction: [
          {
            speaker: 'rafa',
            expression: 'tenso',
            text: 'Rafa salva o arquivo no pen drive e desliga o computador. Vai esperar uma oportunidade melhor.',
          },
        ],
      },
      {
        id: 'c',
        text: 'Mandar agora um e-mail à diretoria, com cópia geral, apontando o erro',
        effects: [{ op: 'add', var: 'BR', value: -1 }],
        reaction: [
          {
            speaker: 'rafa',
            expression: 'tenso',
            text: 'O e-mail é enviado na madrugada citando "falhas no apontamento logístico". Bruno se sentirá exposto.',
          },
        ],
      },
    ],
  },

  // Fim do Cap 2
  {
    id: 'cap2_end',
    kind: 'chapterEnd',
    chapter: 2,
    next: 'cap3_intro',
  },
];
