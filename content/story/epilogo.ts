import { GameNode } from '@/content/tags';

export const epilogoStory: GameNode[] = [
  // Epílogo Intro
  {
    id: 'epilogo_intro',
    kind: 'scene',
    chapter: 6,
    clock: '3 MESES DEPOIS',
    bg: 'sala_reuniao',
    pov: 'narrador',
    lines: [
      {
        speaker: 'narrador',
        text: 'Três meses se passaram desde aquela semana decisiva na Raiz Alimentos na Vila Leopoldina.',
      },
      {
        speaker: 'narrador',
        text: 'As consequências das escolhas feitas sob pressão moldaram para sempre a vida e a carreira dos três protagonistas.',
      },
      // Epílogo da Lia (§7.3)
      {
        speaker: 'lia',
        if: { flag: 'F_VOZ', equals: true },
        text: 'Lia foi efetivada. Na primeira reunião como analista de marketing, falou antes que alguém pedisse.',
      },
      {
        speaker: 'lia',
        if: { flag: 'F_VOZ', equals: false },
        text: 'Lia terminou o estágio com um caderno cheio de ideias que ninguém viu.',
      },
      // Epílogo do Bruno (§7.3)
      {
        speaker: 'bruno',
        if: { flag: 'F_SOFIA', equals: true },
        text: 'Sofia ainda fala do pai na primeira fila da apresentação da escola.',
      },
      {
        speaker: 'bruno',
        if: { flag: 'F_SOFIA', equals: false },
        text: 'Bruno viu a apresentação da Sofia pelo celular. Três vezes.',
      },
      {
        speaker: 'bruno',
        if: { flag: 'F_SEGREDO', equals: true },
        text: 'Ele nunca contou à equipe sobre a lista de demissões assinada em segredo.',
      },
      // Epílogo do Rafa (§7.3)
      {
        speaker: 'rafa',
        if: { var: 'RL', gte: 2 },
        text: 'Rafa e Lia almoçam juntos toda terça-feira. Ele não admite em voz alta, mas é o melhor dia da semana.',
      },
      {
        speaker: 'rafa',
        if: { var: 'RL', lt: 2 },
        text: 'Rafa continua chegando cedo e saindo tarde da empresa. Sozinho com suas planilhas.',
      },
    ],
    next: 'E01',
  },

  // Decisão E01 · tela neutra, sem personagem, a pergunta é para o jogador
  {
    id: 'E01',
    kind: 'decision',
    type: 'P',
    chapter: 6,
    clock: 'EPÍLOGO',
    bg: 'quarto_lia_noite',
    pov: 'narrador',
    prompt: 'Olhando para trás, o que fica dessa semana para você?',
    next: 'game_complete',
    options: [
      {
        id: 'a',
        text: 'As pessoas, e o que cada uma estava sentindo',
        tags: { 'INTER.EMP': 2 },
        reaction: [
          {
            speaker: 'narrador',
            text: 'O que move as organizações são os laços humanos e a capacidade de sentir com o outro nos momentos difíceis.',
          },
        ],
        reportSnippet: 'Ao encerrar a jornada, você concluiu que o que mais importou foram as pessoas e suas emoções.',
      },
      {
        id: 'b',
        text: 'O que eu descobri sobre mim',
        tags: { 'INTRA.REF': 2 },
        reaction: [
          {
            speaker: 'narrador',
            text: 'Toda experiência profissional é também um espelho profundo para o próprio autoconhecimento e maturidade.',
          },
        ],
        reportSnippet: 'Ao olhar para trás, você valorizou as descobertas sobre quem você é diante da pressão.',
      },
      {
        id: 'c',
        text: 'A vontade de fazer melhor da próxima vez',
        tags: { 'INTRA.MOT': 2 },
        reaction: [
          {
            speaker: 'narrador',
            text: 'O aprendizado não termina na resposta: ele se transforma em energia de superação para os próximos desafios.',
          },
        ],
        reportSnippet: 'Sua reflexão final destacou a motivação de aperfeiçoar suas escolhas no futuro.',
      },
      {
        id: 'd',
        text: 'O time, e a vontade de comemorar junto',
        tags: { 'INTER.COL': 2, 'COR': 1 },
        reaction: [
          {
            speaker: 'narrador',
            text: 'Nenhuma conquista tem o mesmo sabor se não for compartilhada com quem esteve junto na trincheira do dia a dia.',
          },
        ],
        reportSnippet: 'Você encerrou valorizando a união da equipe e a celebração coletiva das conquistas.',
      },
    ],
  },

  // Nó final de conclusão
  {
    id: 'game_complete',
    kind: 'scene',
    chapter: 6,
    clock: 'FIM DE JOGO',
    bg: 'quarto_lia_noite',
    pov: 'narrador',
    lines: [
      {
        speaker: 'narrador',
        text: 'Fim da história na Raiz Alimentos.',
      },
      {
        speaker: 'narrador',
        text: 'Antes de ver seu mapa de preferências, uma pergunta rápida sobre como você se vê.',
      },
    ],
    next: 'game_finished_screen',
  },
];
