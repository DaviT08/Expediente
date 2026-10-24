# EXPEDIENTE — Game Design Document + PRD

**Versão:** 1.1 · 18/10/2026
**Autores:** Carlos Simeão, Yasmin Paiva e Marcelo Augusto Filho
**Produto:** atividade gamificada (visual novel em pixel art, ~30 min) sobre as 8 inteligências de Gardner, com ênfase em interpessoal e intrapessoal
**Stack:** Next.js + TypeScript (Antigravity) · GitHub Desktop · Vercel · Supabase

---

## 0. Como usar este documento (para o agente do Antigravity)

1. Este arquivo é a **fonte de verdade**. Salve-o em `docs/GDD.md`. A regra curta do Apêndice A vai em `.agents/rules/expediente.md` e só aponta para cá (cada arquivo de regras do Antigravity tem limite de 12.000 caracteres, por isso o GDD não é uma regra).
2. Construa **por fases** (§14). Uma fase por vez. Ao fim de cada fase, rode os critérios de aceite, faça commit e **pare para revisão humana**.
3. **Não invente** regras de pontuação, lógica de finais, textos obrigatórios ou campos de banco fora do que está aqui. Se algo estiver ambíguo, pergunte antes de implementar.
4. O roteiro (§5) traz todas as cenas, todas as decisões, todas as opções e suas tags. Você escreve os **diálogos** a partir dos beats, seguindo o guia de estilo (§5.6) e o orçamento de palavras (§5.7). **Não altere** o texto das opções nem as tags sem autorização.
5. Todo texto de interface em **português do Brasil**.

### 0.2 Arquitetura v1.2 (24/10/2026) — atualiza a 0.1
- **Supabase e painel do professor voltaram.** O painel fica em `/professor`, protegido pela senha da variável `PROFESSOR_PASSWORD`. Tem as abas Partidas, Visão da turma e Decisões (com o aviso de opção óbvia) e exporta CSV de partidas e de escolhas.
- **Envio de dados:** 1 envio no início, 1 por decisão (com tempo de resposta) e 1 ao concluir o Espelho. Pontuação e final são recalculados no servidor.
- **Texto de ciência (substitui o da 0.1):** *"Esta é uma atividade educacional sobre as inteligências múltiplas. Vamos registrar seu nome e as escolhas que você fizer no jogo. Só o professor responsável vê seus resultados. Os dados serão excluídos ao fim do semestre, e você pode pedir a exclusão antes disso. No final, você também pode salvar seu relatório em PDF."*
- **Sem código de turma:** todas as partidas entram na turma `GERAL`.
- **Sons curtos** gerados no navegador (escolha, confiança ▲/▼, cronômetro), com volume nas Opções. O cronômetro para quando o jogo está pausado.

### 0.1 Arquitetura v1.1 (18/10/2026) — substituída em parte pela 0.2
O projeto **não tem banco de dados nem painel admin**. Tudo roda no navegador do aluno.
- **Removidos:** Supabase (§11.5–11.8), rotas `/api` (§11.6), painel admin (§9), código de turma, cron, `attempt`, % da turma no fluxograma (§5.8) e as métricas de turma da §1.5.
- **Entrada:** só o nome. Texto de ciência (substitui C.1): *"Esta é uma atividade educacional sobre as inteligências múltiplas. Suas escolhas ficam salvas só neste navegador. No final, você pode salvar seu relatório em PDF."*
- **Cálculo:** perfil (§6.2) e final (§7.1) são calculados no cliente, com as funções puras de `lib/scoring`, `lib/endings` e `lib/report`.
- **Persistência:** só `localStorage` (em `try/catch`). Quem vê o resultado é o aluno; o professor recebe o PDF, se o aluno enviar.
- **Rotas:** `/` (entrada) → `/jogar` → `/espelho` → `/relatorio` (com "Salvar em PDF" pela impressão do navegador).
- **Visual:** foco em PC. Sem áudio. Pixel art gerada em código (sem assets externos): `components/pixel/Scenes.tsx` (16 cenários 320x180 feitos de retângulos, com pequenas animações) e `components/pixel/sprites.ts` (bustos chibi 24x28 dos 11 personagens, com 3 expressões, piscar e boca animada enquanto o texto aparece). Layout de visual novel: cenário 16:9, personagem do POV à esquerda, interlocutor à direita (quem não fala fica escurecido), caixa de diálogo sobreposta com aba do nome na cor do personagem, escolhas num painel à direita. O fluxograma de fim de capítulo (§5.8) está implementado, sem as porcentagens.
- **Novas fases:** F0 base ✔ · F1 motor ✔ · F2 conteúdo ✔ · **F3 Espelho + relatório ✔** · **F4 fluxograma ✔ (arte opcional, sem áudio)** · **F5 playtest e calibração**.

---

## 1. Visão geral

### 1.1 Pitch
Uma semana decisiva na **Raiz Alimentos**, empresa paulistana de granolas e snacks que compra ingredientes de uma cooperativa familiar. O maior cliente ameaça sair na sexta-feira se a empresa não cortar preço. O jogador alterna entre três protagonistas, como em *Detroit: Become Human* (Quantic Dream, 2018):

- **Lia**, estagiária de marketing no primeiro dia de trabalho;
- **Bruno**, coordenador do galpão que recebe uma lista de demissões;
- **Rafa**, analista de dados que descobre que o plano da diretoria está errado.

Cada escolha registra uma **preferência de ação** associada a uma das 8 inteligências. Algumas escolhas-chave mudam relações e o destino da empresa, levando a **4 finais**. Ao terminar, o aluno recebe um **relatório reflexivo** com seu mapa de preferências, o que usou menos e como desenvolver. O professor vê tudo num **painel admin**.

### 1.2 Objetivos pedagógicos
- **O1.** Reconhecer as 8 inteligências em situações concretas de trabalho.
- **O2.** Refletir sobre as próprias preferências de ação, sobretudo interpessoais e intrapessoais.
- **O3.** Identificar formas de agir pouco usadas e práticas concretas para desenvolvê-las.
- **O4.** Conectar a experiência a tópicos de Comportamento Organizacional: percepção, emoções e estresse, conflito e negociação, poder e política, liderança, comunicação e mudança.

### 1.3 Público e contexto
Graduandos de Administração/negócios (adultos). Jogam sozinhos, no celular ou no computador, em sala ou em casa. O professor cria um código de turma e acompanha os resultados.

### 1.4 O que o produto NÃO é (requisito)
- **Não é teste psicológico nem diagnóstico.** No Brasil, diagnóstico psicológico e uso de testes psicológicos são privativos de psicólogos (Lei 4.119/1962; sistema SATEPSI do Conselho Federal de Psicologia). A interface **nunca** chama a atividade de "teste", "diagnóstico", "laudo" ou "avaliação psicológica". A única menção permitida é a negação no texto de limites (Apêndice C). Use "mapa de preferências" e "perfil reflexivo".
- **Não dá nota.** Nas escolhas de perfil não existe certo ou errado.
- **Não classifica estilos de aprendizagem.** Frases como "você aprende melhor visualmente" são proibidas: a hipótese de estilos de aprendizagem não tem sustentação empírica (Pashler et al., 2008), e o próprio Gardner rejeita equiparar inteligências a estilos.

### 1.5 Métricas de sucesso
| Métrica | Meta | Onde medir |
|---|---|---|
| Duração mediana da partida | 25–35 min | Admin › Turma |
| Taxa de conclusão | ≥ 85% dos que iniciam | Admin › Turma |
| Opção "óbvia" | nenhuma opção de perfil escolhida por > 70% | Admin › Decisões |
| Variedade de finais | cada final alcançado por ≥ 8% numa turma de 20+ | Admin › Turma |
| Clareza | aluno entende o relatório sem explicação extra | conversa em sala |

---

## 2. Fundamentação e limites

### 2.1 As 8 inteligências e sua definição operacional no jogo
Gardner (1983) propôs sete inteligências. A naturalista foi acrescentada nos anos 1990 e consolidada em Gardner (1999). No jogo, cada uma é operacionalizada como uma **forma de resolver** a situação:

| Código | Inteligência | O que conta como evidência no jogo | Exemplo de ação |
|---|---|---|---|
| `LIN` | Linguística | resolver pela palavra: escrever, nomear, narrar, argumentar | registrar a fala de alguém; escrever um e-mail cuidadoso |
| `LOG` | Lógico-matemática | números, causa e efeito, sequência, hipóteses | refazer a conta; pedir os critérios de uma decisão |
| `ESP` | Espacial | imagens, mapas, layouts, visualizar cenários | desenhar o fluxo no quadro; montar um layout |
| `COR` | Corporal-cinestésica | corpo, mãos, movimento, presença física, protótipo | ajudar a descarregar; ensaiar andando |
| `MUS` | Musical | ritmo, som, tom de voz; música para regular ou conectar | notar o tom de voz; puxar um samba no galpão |
| `NAT` | Naturalista | observar e classificar padrões da natureza e do ambiente; origem, sazonalidade | checar perdas por temperatura; olhar a safra |
| `INTER` | Interpessoal | entender e agir sobre emoções, intenções e relações dos outros | escutar; mediar; mobilizar a equipe |
| `INTRA` | Intrapessoal | entender e manejar a si mesmo | nomear a emoção; pausar antes de responder |

### 2.2 Subdimensões de INTER e INTRA
Gardner não subdivide formalmente as inteligências pessoais. As subdimensões abaixo são uma **operacionalização deste projeto**, compatível com os quatro domínios de inteligência emocional de Goleman (autoconsciência, autogestão, consciência social, gestão de relacionamentos), que partem das inteligências pessoais de Gardner, e com a linguagem das ementas de CO.

| Tag | Subdimensão | Comportamento |
|---|---|---|
| `INTER.EMP` | Empatia / leitura do outro | perceber o que o outro sente e precisa |
| `INTER.COM` | Comunicação clara e assertiva | dizer o que precisa ser dito, com clareza e respeito |
| `INTER.CONF` | Manejo de conflito e negociação | enfrentar a divergência e buscar acordo |
| `INTER.COL` | Colaboração e mobilização | juntar pessoas, dividir trabalho, cocriar |
| `INTRA.AUTO` | Autoconsciência | nomear a própria emoção e a causa dela |
| `INTRA.REG` | Autorregulação | pausar, respirar, não reagir no impulso |
| `INTRA.MOT` | Automotivação / propósito | conectar a ação a metas e valores próprios |
| `INTRA.REF` | Reflexão | pensar sobre valores, aprendizados, quem quer ser |

### 2.3 Limites que o produto precisa respeitar
1. **A evidência para inteligências independentes é fraca.** Waterhouse (2006) não encontrou estudos que validassem a teoria. Visser, Ashton & Vernon (2006) mostraram que medidas de desempenho da maioria das inteligências se concentram num fator geral (*g*). Gardner & Moran (2006) contestam essa leitura. Consequência: o jogo usa a teoria como **linguagem para reflexão**, não como medida de capacidade.
2. **Mede preferência declarada numa ficção, não capacidade.** Escolher "desenhar o fluxo" não prova inteligência espacial.
3. **A escala é ipsativa** (escolha forçada entre opções). As pontuações são relativas **dentro da mesma pessoa** e não servem para comparar alunos (Hicks, 1970). O admin **não exibe ranking** de alunos.
4. **Personagem × pessoa.** O jogador pode escolher "o que a Lia faria". Mitigação: instrução explícita "escolha o que **você** faria no lugar dela" e a etapa **Espelho** no final (§8.3).
5. **Desejabilidade social.** Em situações inter/intra, uma opção "boazinha" óbvia distorce o perfil. Mitigação: todas as opções são competentes e simpáticas (§5.6), a ordem é embaralhada, e o admin monitora opções escolhidas por mais de 70% (§6.6).
6. **Viés de oportunidade.** Como INTER e INTRA aparecem em mais opções, um jogador que escolhe ao acaso já pontua mais nelas (linha de base ≈ 40% e 34%, contra ≈ 25% nas demais). O relatório compara cada pontuação com sua **linha de base ao acaso** (§6.4).

O texto de limites do Apêndice C é **obrigatório** no relatório.

---

## 3. Ementa de referência

Ementas de Comportamento Organizacional e Comportamento Humano em cursos de Administração (UFES ADM02158, UDESC/ESAG 12CHGP, IFMT, UFPB 8108082) seguem uma estrutura comum em três níveis:

- **Individual:** percepção, personalidade e valores, emoções, atitudes, motivação, estresse. Algumas citam explicitamente "inteligências múltiplas e inteligência emocional".
- **Grupal:** comunicação, conflito e negociação, poder e política, liderança, equipes.
- **Organizacional:** clima, cultura, mudança.

Bibliografia recorrente: Robbins, Judge & Sobral; Chiavenato; Goleman; Bergamini.

**Mapa capítulo → tópico da ementa** (usado no relatório, seção "Conexão com a disciplina"):

| Capítulo | Tópicos de CO trabalhados | Decisões |
|---|---|---|
| Prólogo | Percepção (o que cada um nota numa mesma reunião) | P01, P02 |
| 1 · Segunda | Socialização organizacional; emoções e estresse; conflito intergeracional; comunicação | L01, L02, B01, B02, R01, R02, K1 |
| 2 · Terça | Tomada de decisão e ética; personalidade e valores; equilíbrio trabalho-vida | R03, R04, L03, B03, B04, K2 |
| 3 · Quarta | Poder e política; justiça organizacional; conflito e negociação | B05, B06, L04, L05, R05, K3, K4 |
| 4 · Quinta | Comunicação na mudança; liderança; empatia; negociação com fornecedor | R06, R07, L06, L07, B07, N1, K5 |
| 5 · Sexta | Gestão do estresse; liderança em crise; cultura organizacional | L08, B08, R08, K6, L09, B09 |
| Epílogo | Aprendizagem e autodesenvolvimento | E01 |

---

## 4. Experiência do jogador

### 4.1 Fluxo de telas
1. **Entrada.** Logo, campo "Seu nome", campo "Código da turma", caixa de ciência (texto no Apêndice C) e botão **Começar**. Se houver partida em andamento salva neste navegador, mostrar antes **Continuar de onde parei**.
2. **Como jogar** (30 s, pulável). Tocar ou clicar avança o texto. Teclas 1–4 escolhem. Aparece em destaque: **"Não existe resposta certa. Escolha o que você faria no lugar do personagem."** Explica os avisos de relação e que dois momentos têm tempo limitado (desativável em Opções).
3. **Prólogo → Capítulos 1 a 5.** Cada capítulo abre com um card de título ("SEGUNDA · Primeiro dia") e fecha com o **fluxograma** (§5.8).
4. **Final** + epílogos dos três protagonistas.
5. **Espelho** (autoavaliação, §8.3).
6. **Relatório** (§8).
7. **Jogar de novo** (para explorar outros finais). Partidas repetidas são marcadas como `attempt > 1` e não substituem o perfil oficial.

### 4.2 Orçamento de tempo
| Etapa | Tempo alvo |
|---|---|
| Entrada + como jogar | 1 min |
| Prólogo | 2 min |
| Capítulos 1–5 | 4,5 min cada (≈ 22 min) |
| Final + epílogos | 2 min |
| Espelho | 1,5 min |
| Relatório | 3 min |
| **Total** | **≈ 31 min** |

O cálculo assume cerca de 4.000 palavras de narrativa por caminho, leitura em tela de ~190 palavras/min e ~10 s por decisão. É uma estimativa: calibre com a duração real registrada no admin.

---

## 5. Narrativa

### 5.1 Premissa e tema
**Tema:** o que a gente faz quando a pressão aperta, e quem a gente leva junto.

**Cenário.** A Raiz Alimentos tem galpão e escritório (no mezanino) na Vila Leopoldina, em São Paulo, e cerca de 85 funcionários. Há 15 anos ela compra aveia, castanhas e frutas secas da **Cooperativa Vale Verde**, no Vale do Ribeira.

**Conflito.** O **Grupo Orbe**, rede de supermercados que responde por 40% da receita, exige 18% de redução de preço até **sexta-feira às 15h**. Se não houver redução, retira os produtos das gôndolas. A diretoria responde com o **Plano Ajuste**: trocar a cooperativa por um fornecedor industrial (**Graneleira Sul**) e cortar 4 vagas no galpão.

**Verdade escondida.** O Plano Ajuste ignora três custos do fornecedor novo: lotes rejeitados três vezes mais, frete mais longo e mais perda por validade. No custo total, o plano sai **mais caro**.

**Alternativa possível** (se os protagonistas cooperarem):
- contrato de 12 meses com a cooperativa, com 6% de desconto;
- rota de frete compartilhada (ideia do Bruno);
- campanha "Origem" em parceria com a Orbe (ideia da Lia);
- análise de custo total (do Rafa).

### 5.2 Personagens
| Personagem | Idade | Papel | Quer | Precisa (arco) | Voz | Cor |
|---|---|---|---|---|---|---|
| **Lia Moura** | 21 | Estagiária de marketing, primeiro dia; primeira da família na faculdade; mora em Itaquera, 1h20 de metrô | ser efetivada | confiar na própria voz | frases curtas, se corrige, humor nervoso | mostarda `#E0A526` |
| **Bruno Ferraz** | 36 | Coordenador do galpão; começou como operador; pai da Sofia; toca cavaquinho | proteger a equipe | liderar sem carregar tudo sozinho | direto, caloroso, gíria paulistana leve ("meu", "firmeza") | azul-petróleo `#2B7A8C` |
| **Rafa Duarte** | 27 | Analista de planejamento financeiro; brilhante com números, reservado | que os números sejam ouvidos | aprender a levar pessoas junto | preciso, seco, ironia leve | lilás `#8E6CC4` |
| Marta Ramos | 49 | Diretora-geral, pressionada por investidores; não é vilã | salvar a empresa | — | executiva, eufemismos ("ajuste", "readequação") | — |
| Patrícia Leme | 33 | Coordenadora de marketing; brilhante, insegura no cargo; toma crédito da Lia | provar seu valor | — | rápida, "a gente", termos de marketing em inglês | — |
| Jorge Silva | 58 | Operador sênior, 22 anos de casa; contador de histórias | não ser descartado | — | interior paulista, "na minha época" | — |
| Kaio Santos | 24 | Operador, rápido e impaciente | modernizar tudo | — | acelerado, gírias | — |
| Dani Rocha | 31 | Operadora, mãe de dois | estabilidade | — | fala pouco | — |
| Seu Antônio | 62 | Presidente da Cooperativa Vale Verde (só por telefone/vídeo) | manter o contrato | — | calmo, fala da roça | — |
| Sofia | 8 | Filha do Bruno | o pai na plateia | — | — | — |
| Henrique Paes | 45 | Comprador do Grupo Orbe | margem | — | seco, comercial | — |

**Retratos:** os protagonistas têm 3 expressões (neutro, tenso, sorrindo). Os secundários têm 2 (neutro, tenso).

### 5.3 Estrutura
| Bloco | Dia | POVs | Decisões de perfil (P) | Decisões-chave (K/N) |
|---|---|---|---|---|
| Prólogo | Dom. 22h → Seg. 8h | Lia | P01, P02 | — |
| Cap. 1 · Primeiro dia | Segunda | Lia, Bruno, Rafa | L01, B01, L02, B02, R01, R02 | K1 |
| Cap. 2 · A planilha | Terça | Rafa, Lia, Bruno | R03, L03, B03, B04, R04 | K2 |
| Cap. 3 · A lista | Quarta | Bruno, Lia, Rafa | B05, B06, L04, R05, L05 | K3 (com tempo), K4 (condicional) |
| Cap. 4 · Véspera | Quinta | Lia, Rafa, Bruno | L06, R06, L07, B07, R07 | N1, K5 |
| Cap. 5 · O pitch | Sexta | Lia, Bruno, Rafa | L08, B08, R08, L09, B09 | K6 (com tempo) |
| Final + Epílogo | 3 meses depois | jogador | E01 | — |

São **29 decisões de perfil** e **6 a 7 decisões-chave**, cerca de 36 decisões por partida.

**Regra de ouro:** decisões **P** só alimentam o perfil e geram uma reação local de 1 a 3 falas. Elas **nunca** mudam relações nem finais. Decisões **K** mudam relações e flags e **nunca** pontuam no perfil. Assim, o jogador não consegue "jogar para o final bom" escolhendo inteligências, e o perfil não é contaminado pela vontade de salvar a empresa.

### 5.4 Variáveis de estado
| Variável | Tipo | Início | Uso |
|---|---|---|---|
| `LB` (Lia ↔ Bruno), `BR` (Bruno ↔ Rafa), `RL` (Rafa ↔ Lia) | inteiro, limitado a [−3, +3] | 0 | coesão do time |
| `COOP` | inteiro | 0 | engajamento da cooperativa |
| `F_DADOS` | booleano | false | a análise do Rafa chegou a quem decide do jeito certo |
| `F_VOZ` | booleano | false | a Lia falou no pitch |
| `F_SOFIA` | booleano | false | Bruno foi à apresentação da filha (só epílogo) |
| `F_SEGREDO` | booleano | false | Bruno assinou a lista em segredo (só epílogo) |
| `F_LIA_GUARDOU` | booleano | false | a Lia guardou o material da cooperativa (variação de texto no pitch) |

Toda mudança de `LB`, `BR` ou `RL` mostra um aviso no canto, no estilo Detroit: **"Lia ↔ Bruno · confiança ▲"** (ou ▼).

### 5.5 Roteiro de cenas e decisões
Formato: **ID · hora · local · POV** → beat (o que acontece) → pergunta → opções.
As tags ficam **ocultas** do jogador. O peso 2 é a tag principal da opção, e o peso 1 é a secundária.
A ordem das opções é **embaralhada por jogador** (semente = `runId`). Os IDs das opções são fixos.

#### PRÓLOGO

**P01 · Dom. 22h · quarto da Lia · POV Lia**
Beat: Lia arruma a mochila para o primeiro dia. Chega mensagem da mãe: "Orgulho de você 💛". O e-mail de boas-vindas fala em "uma semana importante para a empresa".
Pergunta: *Véspera do primeiro dia. O que você faria no lugar da Lia?*
- a) Manda mensagem no grupo da faculdade combinando de trocar como foi o primeiro dia de cada um → `INTER.COL 2`
- b) Desenha no caderno o trajeto de metrô e como imagina o escritório → `ESP 2`
- c) Escreve três metas pessoais para a primeira semana → `INTRA.MOT 2`
- d) Sai para caminhar na praça do bairro e gastar a ansiedade → `COR 2 · NAT 1`

**P02 · Seg. 8h · sala de reunião · POV Lia (montagem com Bruno e Rafa na mesma sala)**
Beat: Marta anuncia o ultimato da Orbe e um "plano de ajuste", sem detalhes. O clima pesa.
Pergunta: *O que mais chama a sua atenção na reunião?*
- a) As palavras da Marta: ela diz "ajuste", nunca "demissão" → `LIN 2`
- b) O gráfico: 40% da receita depende de um único cliente → `LOG 2`
- c) Um senhor do galpão, no fundo da sala, girando o crachá sem parar → `INTER.EMP 2`
- d) A foto antiga na parede: a primeira colheita da cooperativa que deu origem à marca → `NAT 2`

#### CAPÍTULO 1 · SEGUNDA · Primeiro dia

**L01 · 9h40 · open space do marketing · Lia**
Beat: Patrícia, apressada: "Preciso de uma proposta de texto para a embalagem nova até amanhã. Tranquilo, né?" Lia trava.
Pergunta: *O peito aperta. O que você faz nos próximos cinco minutos?*
- a) Anota em palavras o que está sentindo e o que exatamente assusta → `INTRA.AUTO 2 · LIN 1`
- b) Respira fundo e quebra a tarefa em partes pequenas → `INTRA.REG 2`
- c) Levanta, pega água, se alonga e põe a playlist de foco → `COR 2 · MUS 1`
- d) Rabisca um esboço rápido da embalagem, só para ter por onde começar → `ESP 2 · INTRA.MOT 1`

**B01 · 10h30 · doca · Bruno**
Beat: O caminhão da cooperativa atrasou duas horas, com pedidos da Orbe saindo. Marta liga pedindo um relatório de custos "pra ontem".
Pergunta: *Você tem dez minutos antes de tudo travar. Qual o primeiro movimento?*
- a) Para, respira e decide não responder à Marta no calor do momento → `INTRA.REG 2`
- b) Vai direto para a doca ajudar a descarregar junto com a equipe → `COR 2`
- c) Abre a planilha de rotas e recalcula as janelas de entrega → `LOG 2`
- d) Junta a equipe em roda e divide quem faz o quê → `INTER.COL 2`

**L02 · 11h15 · galpão · Lia** — inclui o **momento fixo M1**: Bruno recebe Lia e apresenta a equipe → `LB +1`.
Beat: Jorge conta, empolgado, como a primeira granola foi feita numa cozinha, com aveia da cooperativa.
Pergunta: *Como você registra essa história?*
- a) Anota as frases dele exatamente do jeito que ele fala → `LIN 2`
- b) Repara no tom de voz dele ao falar da cooperativa e pergunta como ele se sentiu naquele dia → `INTER.EMP 2 · MUS 1`
- c) Pede para ver os ingredientes crus e anota de onde vem cada um → `NAT 2`

**B02 · 13h10 · galpão · Bruno**
Beat: Kaio, alto: "Esse jeito antigo do Jorge atrasa tudo." Jorge larga a empilhadeira, ofendido.
Pergunta: *A equipe inteira olha para você.*
- a) Senta com os dois e conduz a conversa para cada um dizer o que precisa → `INTER.CONF 2`
- b) Deixa a poeira baixar e procura o Jorge depois, porque viu que ele ficou magoado → `INTER.EMP 2`
- c) Conta para a equipe o que você mesmo está sentindo com a pressão desta semana → `INTRA.AUTO 2 · INTER.COM 1`
- d) Põe um samba no rádio do galpão e espera o clima esfriar antes de falar → `MUS 2 · INTER.COM 1`

**R01 · 14h · mesa do Rafa · Rafa**
Beat: Marta deixa o arquivo do Plano Ajuste: "Valida até quarta. É só conferir."
Pergunta: *Por onde você começa?*
- a) Refaz as contas do zero, linha por linha → `LOG 2`
- b) Desenha no quadro branco o caminho do produto, da roça até a gôndola → `ESP 2 · NAT 1`
- c) Pede vinte minutos com quem opera a logística para entender o processo real → `INTER.COL 2`
- d) Põe o álbum instrumental de sempre e mergulha no arquivo → `MUS 2`

**K1 · 15h30 · open space · Lia** (decisão-chave)
Beat: Patrícia lê o rascunho: "Tira essa história de cooperativa. Ninguém lê verso de embalagem."
- a) Tira da embalagem, mas guarda o material numa pasta "plano B" e manda mensagem ao Seu Antônio pedindo uma conversa → `COOP +1`, `F_LIA_GUARDOU = true`
- b) Tira e apaga a versão antiga, para não confundir os arquivos → sem efeito

**M2 · 16h30 · copa · Bruno e Rafa** (momento fixo, sem decisão) → `BR +1`
Bruno reclama: "O frete tá me matando." Rafa anota mentalmente: é a semente da descoberta.

**R02 · 17h · reunião de alinhamento · Rafa**
Beat: Patrícia interrompe Rafa duas vezes no meio da explicação.
Pergunta: *Você sente o rosto esquentar.*
- a) Diz com calma: "Posso terminar o raciocínio?" → `INTER.COM 2`
- b) Percebe que está irritado e por quê, e decide falar com ela depois → `INTRA.AUTO 2`
- c) Mostra o ponto num gráfico na tela, em vez de discutir → `ESP 2`
- d) Batuca baixinho um ritmo na perna até a irritação passar → `MUS 2 · INTRA.REG 1`

#### CAPÍTULO 2 · TERÇA · A planilha

**R03 · 9h · mesa do Rafa · Rafa**
Beat: No relatório da Graneleira Sul, a taxa de lotes rejeitados é três vezes maior que a da cooperativa. Ninguém colocou isso no plano.
Pergunta: *Como você confirma a suspeita?*
- a) Roda uma simulação de custo total, com perdas e frete → `LOG 2`
- b) Monta um mapa das devoluções por região → `ESP 2`
- c) Liga para o Seu Antônio e escuta como a cooperativa cuida do frescor → `INTER.EMP 2`
- d) Lê, um por um, os comentários escritos nas reclamações de clientes → `LIN 2`

**L03 · 10h30 · open space · Lia**
Beat: Amanhã ela apresenta o conceito da embalagem para Patrícia.
Pergunta: *Qual caminho você escolhe?*
- a) Um texto curto e forte que conta a marca em uma frase → `LIN 2`
- b) Um layout em que a embalagem "abre" como uma janela para a lavoura → `ESP 2`
- c) Um selo que explica a safra de cada ingrediente e por que o sabor muda → `NAT 2 · LOG 1`
- d) Ir ao mercado da esquina e conversar com três clientes sobre o que sentem pela marca → `INTER.EMP 2`

**M3 · 12h40 · elevador · Lia e Rafa** (momento fixo) → `RL +1`
O elevador trava por cinco minutos. A conversa sem graça vira risada. Rafa confessa que também não tem dormido direito.

**B03 · 15h · galpão · Bruno**
Beat: Jorge, baixinho: "Tô ouvindo que vão cortar gente. Eu tenho 58 anos, Bruno." Bruno não sabe de nada oficial.
Pergunta: *Jorge espera uma resposta.*
- a) Escuta sem prometer nada e pergunta como ele está lidando com isso → `INTER.EMP 2`
- b) Percebe a própria angústia e admite: "Eu também tô com medo" → `INTRA.AUTO 2`
- c) Mostra no layout do galpão como vão reorganizar o turno para segurar o ritmo → `ESP 2 · COR 1`
- d) Explica com clareza o que sabe e o que não sabe → `INTER.COM 2`

**B04 · 21h · casa do Bruno · Bruno**
Beat: Sofia ensaia para a apresentação da escola, quinta às 19h30. Bruno está exausto.
Pergunta: *Como você recarrega?*
- a) Pega o cavaquinho e acompanha a Sofia no ensaio → `MUS 2`
- b) Escreve no celular um rascunho do que vai dizer à equipe → `LIN 2`
- c) Sai para correr no quarteirão e tirar a tensão do corpo → `COR 2 · INTRA.REG 1`
- d) Fica em silêncio na varanda pensando em que tipo de líder quer ser → `INTRA.REF 2`

**R04 · 23h10 · escritório vazio · Rafa**
Beat: A conta fecha: o plano é mais caro. Ele vai ter que contradizer a Marta.
Pergunta: *Você não consegue ir embora.*
- a) Revisa as fórmulas mais uma vez, para ter certeza → `LOG 2`
- b) Se pergunta por que contradizer a chefe dá tanto medo, e escreve sobre isso → `INTRA.REF 2`
- c) Manda mensagem a um colega de confiança pedindo uma segunda opinião → `INTER.COL 2`
- d) Imagina a reunião de amanhã cena por cena, e como vai mostrar os números → `ESP 2`

**K2 · 23h40 · Rafa** (decisão-chave)
Pergunta: *O que fazer com a descoberta?*
- a) Levar primeiro ao Bruno, porque os números mexem com a equipe dele → `BR +1`, `F_DADOS = true`
- b) Guardar por enquanto, até ter certeza absoluta → libera K4
- c) Mandar agora um e-mail à diretoria, com cópia geral, apontando o erro → `BR −1`, libera K4. O e-mail cita "falha no apontamento logístico do galpão", Bruno se sente exposto, e Marta, irritada com a exposição pública, descarta a análise.

#### CAPÍTULO 3 · QUARTA · A lista

**B05 · 8h30 · galpão · Bruno**
Beat: Marta pede sugestões para cortar 10% do custo operacional até o meio-dia.
- a) Faz uma rodada rápida de ideias com a equipe do galpão → `INTER.COL 2`
- b) Analisa os dados de hora extra e desperdício dos últimos meses → `LOG 2`
- c) Percorre o galpão a pé, cronometrando cada etapa do processo → `COR 2`
- d) Verifica as perdas de matéria-prima por temperatura e validade → `NAT 2`

**B06 · 10h · sala da Marta · Bruno**
Beat: Marta entrega a lista com 4 nomes, entre eles Jorge e Dani. "Confidencial até sexta."
Pergunta: *O ar some da sala.*
- a) Questiona os critérios da lista e propõe discutir alternativas → `INTER.CONF 2`
- b) Pergunta à Marta como ela está lidando com isso, porque ela também parece abalada → `INTER.EMP 2`
- c) Pede dez minutos antes de responder, para não falar no impulso → `INTRA.REG 2`
- d) Pede os números que justificam cada nome → `LOG 2`

**K3 · 10h05 · sala da Marta · Bruno** (decisão-chave · **tempo: 20 s**; se o tempo acabar, vale a opção a)
Beat: "Preciso da sua assinatura e do seu silêncio."
- a) Assina e guarda segredo → `LB −1`, `BR −1`, `F_SEGREDO = true`. Mais tarde, Lia descobre que estava filmando a equipe para a campanha sem saber da lista, e Rafa sente que Bruno escondeu o jogo.
- b) Assina, mas conta à Lia e pede que ela pause o vídeo com a equipe, para não expor ninguém → `LB +1`
- c) Pede 48 horas para apresentar uma alternativa junto com Lia e Rafa → `LB +1`, `BR +1`

**L04 · 11h · corredor de vidro · Lia**
Beat: Pela porta de vidro, Lia vê Patrícia apresentando o layout dela à Marta como se fosse dela.
- a) Respira e espera a raiva passar antes de decidir qualquer coisa → `INTRA.REG 2`
- b) Procura a Patrícia no fim do dia e fala, com cuidado, sobre o crédito → `INTER.CONF 2 · LIN 1`
- c) Tenta entender que pressão a Patrícia está sofrendo para agir assim → `INTER.EMP 2`

**R05 · 14h · antes da reunião · Rafa**
Beat: O coração dispara e as mãos suam.
- a) Põe uma música lenta no fone e respira no ritmo dela → `MUS 2 · INTRA.REG 1`
- b) Nomeia para si mesmo: "É medo de ser julgado, não é perigo de verdade" → `INTRA.AUTO 2`
- c) Desce e dá uma volta no jardim do prédio, reparando nas plantas → `NAT 2`
- d) Escreve num papel as três frases que precisa dizer → `LIN 2 · INTRA.REG 1`

**L05 · 16h · copa · Lia**
Beat: Patrícia, sorrindo: "Gostei da sua ideia, viu? A gente é time."
- a) Propõe um combinado claro: daqui para frente, cada ideia é apresentada com o nome de quem criou → `INTER.CONF 2`
- b) Manda um e-mail educado registrando a ideia, com data e arquivos → `LIN 2 · INTRA.REG 1`
- c) Chama outras pessoas para cocriar a campanha e não ficar sozinha nisso → `INTER.COL 2`
- d) Pensa no que esse episódio mostra sobre o que ela valoriza e o que aceita no trabalho → `INTRA.REF 2`

**K4 · 17h30 · mesa do Rafa · POV Rafa** (decisão-chave · **só existe se K2 ≠ a**)
Beat: Lia pede números para a campanha "Origem". Rafa hesita.
- a) Mostra o que descobriu, e os dois montam a análise juntos → `RL +1`, `F_DADOS = true`
- b) Diz que não é a área dele e que está sem tempo → `RL −1`

#### CAPÍTULO 4 · QUINTA · Véspera

**L06 · 9h · banheiro · Lia**
Beat: Lia encontra Dani chorando. Ela ouviu boatos sobre a lista.
- a) Senta perto, em silêncio, e pergunta se ela quer conversar → `INTER.EMP 2`
- b) Diz com sinceridade o que sabe e se oferece para ir junto falar com o Bruno → `INTER.COM 2`
- c) Oferece um lado do fone, com a música que sempre acalma você; às vezes é o que dá para fazer → `MUS 2 · INTER.EMP 1`
- d) Chama duas colegas para levarem a Dani para almoçar → `INTER.COL 2`

**R06 · 10h · sala da Marta · Rafa**
Beat: Marta, sem tempo: "Rafa, eu não tenho espaço para nuance. Dois minutos." (Se `F_DADOS = false`, ela ouve com impaciência. Se `true`, já ouviu falar e presta atenção.)
- a) Mostra um único número: o custo total real do Plano Ajuste → `LOG 2`
- b) Desenha na lousa os dois fluxos, lado a lado → `ESP 2`
- c) Conta a história do lote devolvido em Campinas como exemplo concreto → `LIN 2`
- d) Propõe um meio-termo: testar o fornecedor novo em uma linha só → `INTER.CONF 2`

**L07 · 13h · open space · Lia**
Beat: Lia finaliza a peça da campanha "Origem" para amanhã.
Pergunta: *No que você investe a última hora?*
- a) Num jingle curto para o vídeo → `MUS 2`
- b) Nas fotos dos ingredientes na terra, com a luz do fim da tarde → `NAT 2 · ESP 1`
- c) No roteiro do vídeo, com a voz do Jorge contando a história → `LIN 2 · INTER.EMP 1`
- d) Num protótipo físico da embalagem, montado à mão em papel → `COR 2`

**B07 · 15h · galpão · Bruno**
Beat: Marta libera Bruno para falar com a equipe: há uma negociação em curso e cortes são possíveis.
- a) Faz uma fala honesta e preparada, olhando cada um nos olhos → `INTER.COM 2 · LIN 1`
- b) Trabalha lado a lado com a equipe a tarde toda antes de falar, para estar presente → `COR 2`
- c) Mostra num quadro o plano alternativo e onde cada um entra → `ESP 2`
- d) Conversa um a um, começando por quem está mais abalado → `INTER.EMP 2`

**R07 · 18h · mesa do Rafa · Rafa**
Beat: Rafa trava na análise final.
- a) Reestrutura o modelo em três cenários → `LOG 2`
- b) Volta aos dados de safra da cooperativa: clima, colheita, sazonalidade → `NAT 2`
- c) Levanta e trabalha de pé, andando pela sala e falando sozinho → `COR 2`
- d) Chama Lia e Bruno para revisarem juntos → `INTER.COL 2`

**N1 · 19h · galpão · Bruno** (narrativa, sem pontuação e sem efeito no final)
Beat: A apresentação da Sofia começa às 19h30.
- a) Vai à apresentação e volta para o galpão depois → `F_SOFIA = true`
- b) Fica no galpão e pede à mãe da Sofia para filmar → `F_SOFIA = false`

**K5 · 21h · galpão · Bruno** (decisão-chave)
Beat: Seu Antônio liga: a cooperativa aceita reduzir 6% se a Raiz assinar 12 meses e dividir a rota de frete.
- a) Faz uma chamada com Lia, Rafa e Seu Antônio, e os quatro constroem a proposta juntos → `LB +1`, `RL +1`, `COOP +1`
- b) Negocia sozinho com Seu Antônio, rápido, e fecha os termos → `COOP +1`
- c) Agradece, mas recusa: não há tempo, e o Plano Ajuste já está aprovado → `BR −1`

#### CAPÍTULO 5 · SEXTA · O pitch

**L08 · 7h · quarto da Lia · Lia**
Beat: Lia mal dormiu.
- a) Ensaia a fala andando e gesticulando pelo quarto → `COR 2 · LIN 1`
- b) Lista o que pode dar errado e o que fará em cada caso → `INTRA.REG 2 · LOG 1`
- c) Lembra por que escolheu Administração e o que quer construir → `INTRA.MOT 2`
- d) Vai a pé até o metrô pelo parque, para chegar mais calma → `NAT 2`

**B08 · 13h · galpão · Bruno**
Beat: A equipe está reunida e ansiosa.
- a) Fala: "Aconteça o que acontecer, vocês vão saber por mim, primeiro" → `INTER.COM 2`
- b) Organiza todo mundo para preparar juntos as amostras do pitch → `INTER.COL 2`
- c) Puxa um parabéns para o Jorge, que faz aniversário hoje → `MUS 2`
- d) Lembra a si mesmo por que vale a pena lutar por esse time → `INTRA.MOT 2`

**R08 · 14h50 · antessala da Orbe · Rafa**
Beat: Chega um e-mail do Henrique pedindo os números.
- a) Revisa a planilha final mais uma vez → `LOG 2`
- b) Prepara um slide visual da cadeia, da roça à gôndola → `ESP 2 · NAT 1`
- c) Respira e aceita que fez o que estava ao seu alcance → `INTRA.REG 2`
- d) Combina com Lia e Bruno quem responde que tipo de pergunta → `INTER.COL 2`

**K6 · 15h20 · sala da Orbe · Lia** (decisão-chave · **tempo: 15 s**; se o tempo acabar, vale a opção c)
Beat: Patrícia apresenta. Henrique corta: "Por que eu pagaria mais por isso?" Silêncio. Patrícia olha para Lia. (Se `F_LIA_GUARDOU = true`, Lia tem no caderno a foto do Seu Antônio na lavoura.)
- a) Lia apresenta a campanha "Origem" e dá crédito à equipe e à cooperativa → `F_VOZ = true`
- b) Lia passa à Patrícia a página do caderno, e as duas apresentam juntas → `F_VOZ = true`
- c) Lia fica em silêncio → `F_VOZ = false`

Henrique encerra: "Respondo até as 18h."

**L09 · 16h30 · corredor · Lia**
- a) Põe uma música e deixa o corpo desacelerar, pensando em quem estava com ela → `MUS 2 · INTER.EMP 1`
- b) Agradece pessoalmente a cada pessoa que ajudou → `INTER.COM 2`
- c) Desenha no caderno a cena da reunião, para nunca esquecer → `COR 2 · ESP 1`
- d) Pensa no que aprendeu sobre si mesma nesta semana → `INTRA.REF 2`

**B09 · 17h · galpão · Bruno**
Beat: Na espera da resposta, Kaio explode com o Jorge de novo, de nervoso.
- a) Junta os dois e define uma regra clara para o resto do dia → `INTER.CONF 2 · LOG 1`
- b) Escreve no grupo da equipe uma mensagem cuidadosa sobre a tarde → `LIN 2`
- c) Monta duplas para o resto do turno e põe Kaio e Jorge juntos, um apoiando o outro → `INTER.COL 2 · INTER.EMP 1`
- d) Puxa o Kaio de lado: "Eu sei que é medo. O meu também" → `INTER.EMP 2 · INTRA.REG 1`

**18h · a resposta → FINAL (§7)**

#### EPÍLOGO · Três meses depois

**E01 · tela neutra, sem personagem, a pergunta é para o jogador**
Pergunta: *Olhando para trás, o que fica dessa semana para você?*
- a) As pessoas, e o que cada uma estava sentindo → `INTER.EMP 2`
- b) O que eu descobri sobre mim → `INTRA.REF 2`
- c) A vontade de fazer melhor da próxima vez → `INTRA.MOT 2`
- d) O time, e a vontade de comemorar junto → `INTER.COL 2 · COR 1`

### 5.6 Guia de estilo para o agente escrever os diálogos
- **Balões:** no máximo 140 caracteres e 3 linhas. A narração é em 3ª pessoa, no presente, com no máximo 2 frases por bloco.
- **Vozes:** siga a coluna "Voz" da tabela §5.2. Cada personagem precisa ser reconhecível sem o nome.
- **Opções:** use o texto **exatamente** como está aqui. Nunca nomeie a inteligência. Nunca use cor, ícone ou ordem fixa por inteligência. Todas as opções têm o mesmo peso visual.
- **Todas as opções são competentes e simpáticas.** Nenhuma pode soar como "a errada". Se uma soar óbvia demais, reescreva a pergunta, não a opção, e registre a mudança.
- **Reação local:** cada opção P gera de 1 a 3 falas de reação, sem julgamento. "Boa escolha!" e equivalentes são proibidos.
- **`reportSnippet`:** cada opção P tem 1 frase na 2ª pessoa, no passado, para o relatório. Exemplo (B03-a): *"Na terça, quando o Jorge falou do medo, você escolheu escutar antes de prometer."*
- **Tom:** demissão e ansiedade tratadas com realismo, sem melodrama. Nenhum vilão: Marta e Patrícia têm motivos compreensíveis. Sem romance, sem palavrão, sem violência. Elenco diverso de forma natural, sem estereótipos.
- **Emoção:** cada capítulo tem um momento de virada emocional (Seg.: a história do Jorge · Ter.: o elevador · Qua.: a lista · Qui.: Dani chorando / a apresentação da Sofia · Sex.: o silêncio no pitch).

### 5.7 Orçamento de palavras por caminho
| Bloco | Palavras | Cenas |
|---|---|---|
| Prólogo | 300 | 2 |
| Cap. 1 | 750 | 8 |
| Cap. 2 | 650 | 7 |
| Cap. 3 | 650 | 7 |
| Cap. 4 | 650 | 7 |
| Cap. 5 | 650 | 7 |
| Final + epílogos | 350 | — |
| **Total** | **≈ 4.000** | |

O script `validate:story` (§13) soma as palavras por caminho e acusa erro se algum caminho ficar fora da faixa de 3.400 a 4.600.

### 5.8 Fluxograma de fim de capítulo (mecânica Detroit)
Ao fechar cada capítulo, mostrar um diagrama com as decisões **K/N** do capítulo:
- caminho escolhido aceso;
- caminhos não escolhidos como **"???"**, revelados em partidas futuras neste navegador;
- abaixo de cada opção, **"x% da sua turma escolheu isto"**, mostrado **só** quando a turma tiver 5 ou mais partidas concluídas (protege escolhas individuais).

As decisões P **não** aparecem no fluxograma, para não induzir conformidade social no perfil.

---

## 6. Sistema de pontuação do perfil

### 6.1 Dados
Cada opção de decisão P tem `tags: Record<Tag, 1 | 2>`. A inteligência de nível superior de `INTER.EMP` é `INTER`, e assim por diante. As decisões K e N não têm tags.

### 6.2 Cálculo (sempre no servidor, a partir das escolhas gravadas e da `contentVersion`)
Para cada inteligência `i` (as 8 de nível superior) e cada subdimensão `s`:

```
raw_i  = Σ (decisões P respondidas) Σ pesos da opção escolhida cuja inteligência é i
max_i  = Σ (decisões P respondidas) max sobre as opções da decisão (soma dos pesos de i na opção)
score_i = round(100 × raw_i / max_i)                          // 0–100
base_i  = 100 × Σ (média sobre as opções dos pesos de i) / max_i   // linha de base ao acaso
delta_i = score_i − base_i                                     // acima ou abaixo do acaso
```

Para cada subdimensão também se calcula a **taxa de escolha quando disponível**: em quantas decisões, das que tinham uma opção com `s` como tag principal, o jogador escolheu essa opção (exibida como "4 de 6 vezes").

**A ordenação do perfil usa `delta_i`, não `score_i`.** Sem essa correção, INTER e INTRA apareceriam no topo de quase todo mundo só porque aparecem em mais opções.

### 6.3 Linha de base e oportunidades do conteúdo v1.0
Valores calculados a partir das tabelas da §5.5 (o `validate:story` recalcula sempre que o conteúdo mudar):

| Inteligência | Decisões em que aparece | Peso máximo | Linha de base ao acaso |
|---|---|---|---|
| LIN | 14 | 24 | 26% |
| LOG | 13 | 23 | 25% |
| ESP | 13 | 24 | 25% |
| COR | 12 | 22 | 25% |
| MUS | 11 | 20 | 25% |
| NAT | 11 | 19 | 26% |
| **INTER** | **25** | **50** | **40%** |
| **INTRA** | **18** | **35** | **34%** |

| Subdimensão | Decisões | Linha de base |
|---|---|---|
| INTER.EMP | 14 | 28% |
| INTER.COL | 12 | 25% |
| INTER.COM | 7 | 27% |
| INTER.CONF | 6 | 26% |
| INTRA.REG | 11 | 27% |
| INTRA.AUTO | 5 | 25% |
| INTRA.MOT | 5 | 25% |
| INTRA.REF | 5 | 25% |

### 6.4 Interpretação (textos do relatório)
- `delta ≥ +15` → **"Forma de agir que você mais escolheu"**
- `−10 < delta < +15` → **"Intermediária"**
- `delta ≤ −10` → **"Forma de agir que você menos escolheu"**
- Se `max(delta) − min(delta) < 20`, mostrar o aviso: *"Suas escolhas ficaram bem distribuídas. O mapa não mostra preferências marcantes, o que também é uma informação."*

Com 11 a 14 oportunidades por inteligência, uma única escolha move a pontuação em cerca de 8 a 9 pontos. Diferenças menores que 10 pontos **não** devem ser tratadas como significativas no texto.

### 6.5 Integridade
- O cliente nunca envia pontuação. Envia apenas `decisionId` + `optionId`. O servidor recalcula tudo.
- Decisões P **não** têm tempo limite e não podem ser puladas.
- Cada partida grava a `contentVersion`. Se o conteúdo mudar, as partidas antigas continuam sendo calculadas com a versão delas (manter versões antigas em `content/versions/`).

### 6.6 Controle de qualidade das opções
- **Validação estática** (`validate:story`, falha o build):
  - cada decisão P tem de 2 a 4 opções;
  - cada opção tem 1 tag principal (peso 2) e no máximo 1 secundária (peso 1);
  - numa mesma decisão, nenhuma tag principal se repete;
  - cada inteligência de nível superior aparece em pelo menos 10 decisões;
  - cada subdimensão aparece em pelo menos 5 decisões.
- **Monitoramento em uso** (admin): frequência de cada opção. Uma opção escolhida por mais de 70% (com pelo menos 15 respostas) fica marcada como **"opção óbvia — revisar redação"**.

---

## 7. Lógica dos finais

### 7.1 Fórmulas (em `content/config.ts`, ajustáveis sem mexer no código)
```
coesao     = LB + BR + RL                       // cada uma limitada a [−3, +3]
negociacao = (F_DADOS ? 1 : 0) + (F_VOZ ? 1 : 0) + (COOP >= 2 ? 1 : 0)

COESAO_MIN = 5
NEGOCIACAO_MIN = 2

A "Mesa Cheia"                        se coesao ≥ 5  e negociacao ≥ 2
B "Contrato fechado, cadeiras vazias" se coesao < 5  e negociacao ≥ 2
C "Recomeço"                          se coesao ≥ 5  e negociacao < 2
D "Fim de expediente"                 nos demais casos
```

**Simulação** com todas as 270 combinações de decisões K, escolhidas ao acaso e com o mesmo peso: A 26%, B 30%, C 10%, D 34%. Jogadores reais tendem a escolher opções cooperativas, então A deve ficar mais frequente. Calibre `COESAO_MIN` com a distribuição real mostrada no admin: 4 aumenta A e C, 6 reduz A.

### 7.2 Os quatro finais
Nenhum final é chamado de "bom" ou "ruim" na interface.
- **A · Mesa Cheia.** A Orbe aceita a proposta conjunta: contrato com a cooperativa, campanha "Origem" e rota compartilhada. Marta suspende a lista. Cena final: festa no galpão, Bruno no cavaquinho, o cartaz da Lia na parede, Rafa fica até o fim.
- **B · Contrato fechado, cadeiras vazias.** A Orbe aceita, convencida pelos números e pela campanha. Sem um plano de operações construído em conjunto, porém, Marta mantém dois cortes "para garantir a margem". Jorge e Dani saem. Cena final: um armário vazio no galpão.
- **C · Recomeço.** A Orbe não renova. O time, unido, convence Marta a apostar em venda direta e lojas de bairro com a marca "Origem", junto com a cooperativa. Ninguém sabe se vai dar certo, mas todo mundo fica.
- **D · Fim de expediente.** A Orbe não renova e os cortes acontecem. Rafa pede demissão e o estágio da Lia não é renovado. Cena final: Bruno, sozinho às 22h, apaga as luzes do galpão.

### 7.3 Epílogos individuais (cards depois do final)
| Protagonista | Condição | Texto-guia |
|---|---|---|
| Lia | `F_VOZ` | "Lia foi efetivada. Na primeira reunião como analista, falou antes que alguém pedisse." |
| Lia | `!F_VOZ` | "Lia terminou o estágio com um caderno cheio de ideias que ninguém viu." |
| Bruno | `F_SOFIA` | "Sofia ainda fala do pai na primeira fila." |
| Bruno | `!F_SOFIA` | "Bruno viu a apresentação da Sofia pelo celular. Três vezes." |
| Bruno | `F_SEGREDO` (linha extra) | "Ele nunca contou à equipe sobre a lista." |
| Rafa | `RL ≥ 2` | "Rafa e Lia almoçam juntos toda terça. Ele não admite, mas é o melhor dia da semana." |
| Rafa | `RL < 2` | "Rafa continua chegando cedo e saindo tarde. Sozinho." |

---

## 8. Relatório do aluno

### 8.1 Estrutura da página (nesta ordem)
1. **Cabeçalho.** Nome, turma, data, final alcançado (ilustração pequena do final).
2. **Seu mapa de preferências.** Gráfico radar com as 8 inteligências (`score_i`) e um anel tracejado com a **linha de base ao acaso** (`base_i`). Legenda: *"O tracejado mostra quanto alguém pontuaria escolhendo ao acaso. O que importa é o quanto você ficou acima ou abaixo dele."*
3. **As formas de agir que você mais escolheu** (até 3, maior `delta`). Para cada uma: nome, definição de 1 linha, **1 exemplo real** (o `reportSnippet` de uma escolha do aluno) e uma linha de "ponto forte no trabalho".
4. **Interpessoal e intrapessoal em detalhe.** Barras das 8 subdimensões com "x de y vezes" e 1 frase interpretativa para cada.
5. **O que desenvolver** (o equivalente a "erros", sem certo ou errado): as 3 de menor `delta`, cada uma com:
   - o que é;
   - onde apareceu e você escolheu outro caminho (1 `reportSnippet` da decisão em que a opção estava disponível e não foi escolhida, formato: *"Na quarta, quando a Patrícia apresentou seu layout, havia a opção de falar com ela sobre o crédito. Você escolheu esperar a raiva passar."*);
   - **2 práticas concretas** (tabela §8.5);
   - **conexão com a disciplina** (tópico da ementa, §3).
6. **Pontos de atenção** (até 3, regras da §8.4).
7. **Espelho** (§8.3): como você se vê × o que suas escolhas mostraram.
8. **Limites deste mapa** (texto obrigatório, Apêndice C).
9. Botões: **Salvar em PDF** (impressão do navegador com CSS de impressão) · **Jogar de novo** · **Ver outros finais**.

### 8.2 Regra para trechos dinâmicos
O relatório é montado com templates e `reportSnippet`s. **Não usar IA generativa em tempo de execução**: o resultado precisa ser reproduzível e revisável pelo professor.

### 8.3 Espelho (autoavaliação, depois do final)
Instrução: *"Antes de ver seu mapa: quando você enfrenta um problema no trabalho ou na faculdade, o quanto costuma…"* (escala de 1 a 5, de "quase nunca" a "quase sempre"):
| Item | Inteligência |
|---|---|
| …escrever, conversar ou argumentar com palavras | LIN |
| …organizar em números, causas e etapas | LOG |
| …desenhar, esquematizar ou visualizar | ESP |
| …pôr a mão na massa, se movimentar, testar fisicamente | COR |
| …prestar atenção a ritmo, som e tom de voz | MUS |
| …observar padrões do ambiente, da natureza, de onde as coisas vêm | NAT |
| …entender o que os outros sentem e envolver pessoas | INTER |
| …olhar para o que você sente e pensa antes de agir | INTRA |

**Comparação por posição, não por número** (as escalas são diferentes): ordene as autoavaliações e os `delta`s de 1 a 8. Mostre as até 2 inteligências em que as posições diferem em 3 ou mais. Textos-modelo:
- *"Você se vê como alguém que usa bastante [X], mas nas suas escolhas ela apareceu pouco."*
- *"Suas escolhas mostraram mais [Y] do que você se atribui. Vale reparar."*

Fecho: *"Diferenças entre como nos vemos e como agimos são material de autoconhecimento, não erro."*

### 8.4 Pontos de atenção (regras)
Aplicar na ordem e mostrar no máximo 3:
1. `INTER.CONF` disponível ≥ 5 vezes e escolhida ≤ 1 → *"Em divergências, você quase não escolheu enfrentar a conversa (x de y). Conflito evitado costuma voltar maior."* · Ementa: conflito e negociação.
2. `INTER.EMP` taxa ≥ 50% **e** `INTER.COM` taxa ≤ 20% → *"Você percebe bem o que os outros sentem, mas pouco escolheu dizer com clareza o que você pensa."* · Ementa: comunicação.
3. `INTRA.REG` taxa ≤ 20% → *"Você raramente escolheu pausar antes de agir. Sob pressão, a primeira reação nem sempre é a melhor."* · Ementa: emoções e estresse.
4. `delta_INTER ≥ +15` **e** `delta_INTRA ≤ −10` → *"Você cuidou muito dos outros e pouco de si nesta semana."* · Ementa: emoções; equilíbrio trabalho-vida.
5. `delta_INTRA ≥ +15` **e** `delta_INTER ≤ −10` → *"Você olhou muito para dentro. Lembre que, no trabalho, as decisões também passam pelos outros."* · Ementa: comportamento em grupo.
6. `INTER.COL` taxa ≤ 20% → *"Você tendeu a resolver sozinho(a). Em problemas complexos, juntar gente costuma render mais."* · Ementa: equipes.

### 8.5 Práticas de desenvolvimento
| Tag | Práticas (o relatório mostra 2) | Base |
|---|---|---|
| INTER.EMP | Parafrasear o que a pessoa disse antes de responder · perguntar "o que você precisa agora?" | escuta ativa |
| INTER.COM | Dar feedback no formato Situação-Comportamento-Impacto · dizer a conclusão primeiro | modelo SCI (Center for Creative Leadership) |
| INTER.CONF | Separar a pessoa do problema e focar em interesses, não em posições · propor critérios objetivos | Fisher, Ury & Patton, *Como chegar ao sim* |
| INTER.COL | Dividir papéis explicitamente no próximo trabalho em grupo · fazer uma rodada de ideias antes de decidir | dinâmica de equipes |
| INTRA.AUTO | Nomear a emoção em palavras ("estou com medo de…") · registrar o gatilho | rotulação afetiva (Lieberman et al., 2007) |
| INTRA.REG | Pausa de 10 respirações antes de responder sob pressão · reinterpretar a situação ("o que mais isso pode significar?") | reavaliação cognitiva (Gross, 1998) |
| INTRA.MOT | Definir 1 meta específica e desafiadora para a semana · ligar a tarefa a um propósito pessoal | teoria do estabelecimento de metas (Locke & Latham, 2002) |
| INTRA.REF | Diário semanal com 3 perguntas: o que aconteceu, o que senti, o que faria diferente | ciclo de aprendizagem experiencial (Kolb, 1984) |
| LIN | Escrever o e-mail importante com a conclusão na primeira linha · resumir uma reunião em 3 frases | princípio da pirâmide (Minto) |
| LOG | Decompor o problema numa árvore de causas · conferir as premissas de uma planilha antes de usá-la | análise de custo total |
| ESP | Esboçar um fluxograma antes de explicar um processo · montar um storyboard da apresentação | mapeamento de processos |
| COR | Ir ao lugar onde o trabalho acontece antes de opinar · ensaiar apresentações em pé, em voz alta | *gemba walk* (lean) |
| MUS | Treinar ritmo, pausa e entonação na fala em público · reparar no tom de voz, não só nas palavras | comunicação oral |
| NAT | Mapear de onde vêm os insumos de um produto · observar padrões sazonais em dados de demanda | cadeia de suprimentos e sustentabilidade |

**Proibido no relatório:** afirmar que música melhora o raciocínio (o "efeito Mozart" não se sustenta; ver Waterhouse, 2006), recomendar estudar "no seu estilo", ou atribuir capacidade ("você é inteligente em…").

---

## 9. Painel admin (professor)

**Acesso.** `/admin/login` com e-mail e senha (Supabase Auth). Só entra quem estiver na tabela `admins`. O usuário admin é criado manualmente no painel do Supabase (Authentication › Add user), e o `user_id` dele é inserido em `admins`.

**Telas:**
1. **Turmas.** Criar turma (nome + código gerado com 6 caracteres sem ambiguidade, ex.: `D7A-4KQ`), abrir/fechar, copiar o link de convite `/?turma=CODIGO`.
2. **Visão da turma.**
   - Cartões: partidas iniciadas, concluídas, taxa de conclusão, duração mediana.
   - Distribuição dos finais (barras).
   - Perfil médio da turma (radar de `delta` médio), com o aviso *"descreve o grupo, não indivíduos"*.
   - Tabela: aluno · status · final · mais escolheu (3 rótulos) · menos escolheu (3 rótulos) · duração · data. Ordenável **só por nome e data**. **Sem ranking**, sem ordenar por pontuação.
3. **Decisões.** Para cada decisão, barras de frequência por opção. Opções com mais de 70% de escolha e n ≥ 15 aparecem marcadas com "revisar redação".
4. **Partida do aluno.**
   - O mesmo relatório que o aluno vê;
   - a linha do tempo de todas as decisões (texto da opção escolhida, tempo de resposta, se o tempo acabou);
   - as variáveis finais (LB, BR, RL, COOP, flags);
   - o Espelho.
   - Aviso fixo: *"Tempo de resposta não indica traço de personalidade."*
5. **Exportar CSV** (partidas e escolhas).
6. **Excluir partida**, com confirmação (atende pedidos de exclusão).

---

## 10. Arte, interface e áudio

### 10.1 Especificação visual
- **Palco base:** 320 × 180 px (16:9), ampliado em escala inteira (×2, ×3, ×4…) com `image-rendering: pixelated`. **Retratos:** 64 × 64 px.
- **Desktop:** palco 16:9 centralizado, caixa de diálogo sobreposta na parte de baixo (estilo visual novel), escolhas logo acima da caixa.
- **Celular (retrato):** cenário no topo (16:9, largura total), retrato e caixa de diálogo abaixo, escolhas empilhadas em botões de largura total com no mínimo 48 px de altura.
- **Tipografia:**
  - Títulos e HUD: **Pixelify Sans**.
  - Texto corrido: **Atkinson Hyperlegible**, no mínimo 18 px, entrelinha 1,5.
  - Fonte pixel em texto longo cansa em 30 minutos de leitura. As duas estão no Google Fonts (`next/font`).
- **Paleta base:** fundo `#14121F`, superfície `#221F33`, texto `#F2EFE6`, destaques por protagonista (§5.2). Contraste mínimo de 4,5:1.
- **HUD:** canto superior esquerdo `QUARTA · 10:05`; canto superior direito, botão de pausa.

### 10.2 Componentes
| Componente | Comportamento |
|---|---|
| `TitleCard` | card de capítulo com dia e título; 2 s ou toque |
| `Stage` | cenário + retratos, fade de 200 ms; leve oscilação de 1 px nos retratos |
| `DialogueBox` | nome colorido do falante; texto em máquina de escrever (40 caracteres/s), toque completa, ▼ piscando para avançar |
| `ChoiceList` | 2–4 botões, atalhos 1–4, foco visível, mesmo estilo para todas as opções |
| `TimerBar` | só em K3 e K6; barra que esvazia, tique nos últimos 5 s; desligável |
| `RelationToast` | "Lia ↔ Bruno · confiança ▲", 2,5 s |
| `ChapterFlowchart` | §5.8 |
| `PauseMenu` | continuar · opções · salvar e sair |
| `OptionsPanel` | tamanho do texto (3 níveis), velocidade do texto, **desligar tempo limite**, volume de música e efeitos, reduzir movimento |
| `RadarChart` | SVG próprio em estilo pixel, com anel de linha de base |
| `Report` | §8, com CSS de impressão |

### 10.3 Lista de arte
- **Cenários (15):**
  - quarto da Lia (noite e manhã)
  - sala de reunião
  - open space do marketing
  - corredor de vidro
  - galpão (dia)
  - doca
  - copa
  - elevador
  - mesa do Rafa (dia e noite)
  - casa e varanda do Bruno
  - banheiro
  - jardim do prédio
  - rua e parque (L08)
  - sala da Orbe
  - galpão em festa (final A)
  - galpão escuro (final D)
- **Retratos (25):** 3 protagonistas × 3 expressões + 8 secundários × 2.
- **Ilustrações de final (4)**, 320 × 180.

### 10.4 Origem e licença dos assets
- **Cenários:** packs de interiores modernos do itch.io, como "Modern Interiors" (LimeZu, com versão gratuita) e "Modern Office" (LimeZu, pago e barato). A licença permite uso comercial e não comercial e proíbe revenda e redistribuição. Monte as cenas em Tiled ou LDtk e exporte PNG.
- **Retratos:** pack de avatares em pixel art ou gerador de personagens com licença compatível.
- Registre autor, link e licença de cada pack em `public/assets/CREDITS.md` e mostre os créditos numa tela do jogo.
- **Repositório privado no GitHub.** Os packs proíbem redistribuição, e um repositório público com os arquivos originais seria redistribuição. Versione apenas os PNGs finais usados no jogo.
- **Placeholders:** até a arte chegar, use retângulos com o nome do cenário e silhuetas coloridas. O jogo precisa funcionar sem arte.

### 10.5 Áudio (opcional, fase 6)
- Uma trilha lo-fi por capítulo.
- Efeitos: clique, aviso de relação, tique do timer.
- Use apenas áudio CC0 (ex.: Kenney, ou OpenGameArt filtrado por CC0).
- O áudio fica mudo até o primeiro toque do jogador (política de autoplay dos navegadores).

---

## 11. Arquitetura técnica

### 11.1 Stack
- **Next.js** (App Router, versão estável atual) + **TypeScript** (`strict`) + **Tailwind CSS**.
- **Zustand** para o estado do jogo; **Zod** para validar conteúdo e payloads.
- **Supabase** (Postgres + Auth só para o admin) com `@supabase/supabase-js` e `@supabase/ssr`.
- **Sem engine de jogo** (Phaser etc.): numa visual novel, DOM + CSS é mais simples, acessível e responsivo.
- **Vitest** (unidade) e **Playwright** (ponta a ponta).

### 11.2 Estrutura de pastas
```
/app
  /(game)/page.tsx                         entrada
  /(game)/jogar/page.tsx                   jogo
  /(game)/relatorio/[runId]/page.tsx       relatório (?t=reportToken)
  /admin/login/page.tsx
  /admin/(protected)/turmas/page.tsx
  /admin/(protected)/turmas/[id]/page.tsx
  /admin/(protected)/turmas/[id]/decisoes/page.tsx
  /admin/(protected)/partidas/[runId]/page.tsx
  /api/runs/start/route.ts
  /api/runs/[runId]/choice/route.ts
  /api/runs/[runId]/complete/route.ts
  /api/runs/[runId]/report/route.ts
  /api/classes/[code]/stats/route.ts
  /api/admin/export/route.ts
  /api/health/route.ts
/content
  config.ts            limiares, timers, contentVersion
  tags.ts
  characters.ts
  story/prologo.ts, cap1.ts … cap5.ts, epilogo.ts, finais.ts
  report/practices.ts, attentionRules.ts, texts.ts
  versions/            snapshots de versões antigas do conteúdo
/lib
  engine/              interpretador de nós, efeitos, condições, shuffle
  scoring/             cálculo do perfil (funções puras, rodam no servidor)
  endings.ts
  supabase/server.ts, client.ts, admin.ts
/components/game, /components/report, /components/admin
/scripts/validate-story.ts
/supabase/migrations/0001_init.sql
/public/assets/bg, /portraits, /ui, /audio, CREDITS.md
/docs/GDD.md
/.agents/rules/expediente.md
```

### 11.3 Modelo de conteúdo
```ts
type Tag = 'LIN'|'LOG'|'ESP'|'COR'|'MUS'|'NAT'
  | 'INTER.EMP'|'INTER.COM'|'INTER.CONF'|'INTER.COL'
  | 'INTRA.AUTO'|'INTRA.REG'|'INTRA.MOT'|'INTRA.REF';

type Var  = 'LB'|'BR'|'RL'|'COOP';
type Flag = 'F_DADOS'|'F_VOZ'|'F_SOFIA'|'F_SEGREDO'|'F_LIA_GUARDOU'|'K2_A';

type Effect =
  | { op: 'add'; var: Var; value: number }
  | { op: 'set'; flag: Flag; value: boolean };

type Condition =
  | { flag: Flag; equals: boolean }
  | { var: Var; gte?: number; lt?: number }
  | { all: Condition[] } | { any: Condition[] };

type Line = { speaker?: CharacterId; expression?: 'neutro'|'tenso'|'sorrindo'; text: string; if?: Condition };

type PNode = { id: string; kind: 'decision'; type: 'P'; chapter: number; clock: string; bg: string; pov: CharacterId;
  lines?: Line[]; prompt: string; next: string;
  options: { id: 'a'|'b'|'c'|'d'; text: string; tags: Partial<Record<Tag, 1|2>>; reaction: Line[]; reportSnippet: string }[] };

type KNode = { id: string; kind: 'decision'; type: 'K'|'N'; chapter: number; clock: string; bg: string; pov: CharacterId;
  lines?: Line[]; prompt: string; next: string; timerSec?: number; timeoutOption?: string;
  options: { id: string; text: string; effects: Effect[]; reaction: Line[]; next?: string }[] };

type Node =
  | { id: string; kind: 'scene'; chapter: number; clock: string; bg: string; pov: CharacterId; lines: Line[]; effects?: Effect[]; next: string }
  | PNode | KNode
  | { id: string; kind: 'branch'; when: { if: Condition; next: string }[]; else: string }   // ex.: pular K4 se K2_A
  | { id: string; kind: 'chapterEnd'; chapter: number; next: string }
  | { id: string; kind: 'resolveEnding' }                                                  // aplica §7.1
  | { id: string; kind: 'ending'; ending: 'A'|'B'|'C'|'D'; next: string };                  // → epílogos → E01 → espelho
```
Os momentos fixos M1, M2 e M3 são nós `scene` com `effects`. A opção K2-a também grava `K2_A = true`.

### 11.4 Motor do jogo
- **Store:** `{ runId, clientToken, nodeId, lineIndex, vars, flags, answered: Record<decisionId, optionId>, startedAt, settings }`.
- **Salvamento local:** a store vai para `localStorage` a cada mudança, sempre dentro de `try/catch`. O jogo precisa funcionar mesmo se o storage falhar.
- **Envio de escolhas:** cada escolha vai ao servidor por uma fila com retentativa. Offline, o jogo continua e sincroniza depois.
- **Embaralhamento:** PRNG com semente (mulberry32), semente = hash(`runId` + `decisionId`). A ordem é estável ao recarregar.
- **Fonte da verdade:** o cliente aplica efeitos para narrar, mas o **final oficial e o perfil são recalculados no servidor** a partir das escolhas gravadas. Mexer no `localStorage` não muda o resultado.

### 11.5 Banco (Supabase) · `supabase/migrations/0001_init.sql`
```sql
create extension if not exists pgcrypto;

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{4,12}$'),
  name text not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  player_name text not null check (char_length(player_name) between 2 and 60),
  attempt int not null default 1,
  client_token uuid not null default gen_random_uuid(),
  report_token uuid not null default gen_random_uuid(),
  content_version text not null,
  status text not null default 'in_progress'
    check (status in ('in_progress','completed','abandoned')),
  current_node text,
  state jsonb not null default '{}'::jsonb,
  scores jsonb,
  mirror jsonb,
  ending text check (ending in ('A','B','C','D')),
  consent_at timestamptz not null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  total_ms int
);
create index runs_class_idx on public.runs (class_id, status);
create index runs_name_idx  on public.runs (class_id, lower(player_name));

create table public.choices (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.runs(id) on delete cascade,
  decision_id text not null,
  option_id text not null,
  decision_type text not null check (decision_type in ('P','K','N')),
  response_ms int,
  timed_out boolean not null default false,
  chosen_at timestamptz not null default now(),
  unique (run_id, decision_id)
);
create index choices_decision_idx on public.choices (decision_id, option_id);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins  enable row level security;
alter table public.classes enable row level security;
alter table public.runs    enable row level security;
alter table public.choices enable row level security;

create policy admins_self_read   on public.admins  for select using (user_id = auth.uid());
create policy classes_admin_all  on public.classes for all    using (public.is_admin()) with check (public.is_admin());
create policy runs_admin_read    on public.runs    for select using (public.is_admin());
create policy runs_admin_delete  on public.runs    for delete using (public.is_admin());
create policy choices_admin_read on public.choices for select using (public.is_admin());
-- Sem políticas para anon: alunos NUNCA acessam o banco direto.
-- Escritas de alunos passam pelas rotas /api com a chave secreta (service role), só no servidor.
```
`attempt` = número de partidas existentes com o mesmo `class_id` e `lower(player_name)`, + 1.

### 11.6 Contrato da API
| Rota | Entrada | Saída e regras |
|---|---|---|
| `POST /api/runs/start` | `{ playerName, classCode, consent: true }` | `201 { runId, clientToken, attempt, contentVersion }` · 404 turma inexistente · 403 turma fechada · 422 nome inválido |
| `POST /api/runs/[runId]/choice` | header `x-client-token`; `{ decisionId, optionId, responseMs, timedOut, nodeId, state }` | 200 · valida se decisão e opção existem na `contentVersion` · idempotente (repetição da mesma decisão é ignorada; vale a primeira) |
| `POST /api/runs/[runId]/complete` | header `x-client-token`; `{ mirror: Record<Inteligencia, 1..5> }` | recalcula perfil, variáveis e final; grava; `200 { reportUrl }` |
| `GET /api/runs/[runId]/report?t=` | `reportToken` | JSON do relatório |
| `GET /api/classes/[code]/stats` | — | % por opção só das decisões K/N, só se a turma tiver ≥ 5 partidas concluídas |
| `GET /api/admin/export?classId=` | sessão admin | CSV |
| `GET /api/health` | header `Authorization: Bearer CRON_SECRET` | consulta trivial ao banco (mantém o projeto ativo) |

### 11.7 Variáveis de ambiente
| Nome | Onde | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | cliente e servidor | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cliente | usada só no login do admin. No painel atual do Supabase pode aparecer como *publishable key* |
| `SUPABASE_SERVICE_ROLE_KEY` | **só servidor** | **nunca** com prefixo `NEXT_PUBLIC_`, nunca no repositório. Pode aparecer como *secret key* |
| `CRON_SECRET` | servidor | protege `/api/health` |

`.env.local` fica no `.gitignore`. Na Vercel, configure em Project › Settings › Environment Variables.

### 11.8 Manter o Supabase acordado
No plano gratuito, o projeto **pausa depois de 1 semana sem atividade** e precisa ser reativado manualmente. Para evitar isso, crie um cron diário da Vercel em `vercel.json`:
```json
{ "crons": [{ "path": "/api/health", "schedule": "0 12 * * *" }] }
```
Mesmo assim, confira no painel do Supabase, na véspera da aula, se o projeto está ativo.

### 11.9 Fluxo GitHub Desktop → Vercel
1. O Antigravity cria o projeto numa pasta local.
2. No GitHub Desktop: *Add existing repository* → *Publish repository*, marcando **Keep this code private**.
3. Na Vercel: *Add New Project* → importar o repositório → configurar as variáveis de ambiente → *Deploy*.
4. Cada fase da §14 vira um commit ("Fase 3: Supabase e API") → *Push* → a Vercel publica automaticamente.

---

## 12. Requisitos não funcionais
- **Desempenho:** LCP < 2,5 s em 4G; PNGs otimizados; assets totais < 8 MB; pré-carregar o próximo cenário.
- **Compatibilidade:** últimas 2 versões de Chrome, Safari (iOS), Firefox e Edge; Android 10+.
- **Acessibilidade** (referência WCAG 2.2 AA):
  - contraste ≥ 4,5:1;
  - jogo inteiro navegável por teclado;
  - `aria-live="polite"` na caixa de diálogo;
  - opção de **desligar o tempo limite**;
  - respeito a `prefers-reduced-motion`;
  - 3 tamanhos de texto.
- **Robustez:** cada escolha é salva localmente antes do envio. Se o jogo terminar sem rede, mostrar *"Conecte-se para gerar seu relatório"* e tentar de novo.
- **Segurança:**
  - RLS ativo;
  - chave secreta só no servidor;
  - Zod em todas as rotas;
  - token por partida;
  - nenhum dado pessoal em URL (só `runId` e `reportToken`, UUIDs aleatórios).
- **Privacidade (LGPD):**
  - Coleta só o nome e as escolhas no jogo; sem e-mail, sem documento.
  - Tela de ciência informa finalidade (atividade educacional), quem vê (o professor) e prazo (exclusão ao fim do semestre).
  - O admin exclui partidas a pedido.
  - Se a atividade for oficial da instituição, alinhar com a política de privacidade dela.

---

## 13. Qualidade e testes
- **`npm run validate:story`** (roda no build e falha se algo quebrar):
  - grafo: todos os nós alcançáveis, nenhum `next` quebrado, nenhum beco sem saída fora dos finais;
  - regras da §6.6;
  - palavras por caminho (§5.7);
  - recalcula a tabela da §6.3;
  - simula a distribuição dos finais (§7.1);
  - imprime um relatório no terminal.
- **Vitest:**
  - `scoring`: só opções "a"; partida aleatória com semente; conferência contra a tabela da §6.3;
  - `endings`: tabela-verdade das 4 condições;
  - `shuffle`: determinístico.
- **Playwright:**
  - partida completa em viewport de celular e de desktop;
  - recarregar no meio e retomar;
  - tempo esgotado em K3 e K6;
  - o admin vê a partida;
  - adulterar o `localStorage` não muda o final oficial.
- **Playtest** com 3 a 5 pessoas antes da turma. Medir duração, pontos de abandono, opções óbvias e se o relatório é entendido sem explicação.

---

## 14. Plano de construção por fases
| Fase | Entrega | Critério de aceite |
|---|---|---|
| **F0 · Base** | Next.js + TS + Tailwind, pastas da §11.2, fontes, `docs/GDD.md`, regra do Apêndice A, repositório privado, deploy inicial | a URL da Vercel abre |
| **F1 · Motor** | engine, store, `DialogueBox`, `ChoiceList`, `TimerBar`, shuffle, salvamento local; Prólogo + Cap. 1 com placeholders | jogar Prólogo + Cap. 1 no celular e no desktop; recarregar retoma do mesmo ponto |
| **F2 · Conteúdo** | todos os capítulos, K/N, finais, epílogos, E01, `validate:story` | validador verde; roteiros de teste alcançam os 4 finais; caminhos entre 3.400 e 4.600 palavras |
| **F3 · Dados** | migration, rotas da §11.6, fila de envio, cálculo no servidor, cron | partida completa grava `runs` e `choices`; adulterar o cliente não muda o resultado |
| **F4 · Relatório** | Espelho + relatório da §8 + impressão em PDF | todas as seções presentes; nenhum termo proibido (§1.4, §8.5) |
| **F5 · Admin** | telas da §9 + CSV + exclusão | login funciona; criar turma; ver turma, decisões e aluno; sem ranking |
| **F6 · Polimento** | arte real, áudio, fluxograma com %, acessibilidade | Lighthouse Acessibilidade ≥ 90; testes Playwright verdes |
| **F7 · Calibração** | ajustes pós-playtest | duração mediana entre 25 e 35 min; nenhuma opção acima de 70% |

---

## 15. Riscos
| Risco | Mitigação |
|---|---|
| Supabase pausado no dia da aula | cron diário (§11.8) + conferir na véspera |
| O plano Hobby da Vercel é só para uso pessoal e não comercial | se a atividade for paga (ex.: aula particular cobrada), usar o plano Pro ou outra hospedagem |
| Repositório público redistribuindo assets | repositório privado (§10.4) |
| Duração fora de 25–35 min | medir no admin; cortar ou expandir falas, não decisões |
| O agente escrever diálogos genéricos ou mexer nas opções | regra "não altere opções" + revisão humana por capítulo |
| O aluno tratar o mapa como diagnóstico | textos obrigatórios + conversa em sala |
| Nome falso ou duplicado (sem login) | aceito no design; o admin exclui; fechar a turma depois da atividade |
| Vazamento da chave secreta | nunca `NEXT_PUBLIC_`; se vazar, gerar nova chave no painel do Supabase |

---

## 16. Referências

**Teoria e evidência**
- GARDNER, H. *Frames of Mind: the theory of multiple intelligences*. New York: Basic Books, 1983. (Ed. bras.: *Estruturas da mente*. Porto Alegre: Artmed.)
- GARDNER, H. *Intelligence Reframed: multiple intelligences for the 21st century*. New York: Basic Books, 1999. (Ed. bras.: *Inteligência: um conceito reformulado*. Rio de Janeiro: Objetiva.)
- GARDNER, H.; MORAN, S. The science of multiple intelligences theory: a response to Lynn Waterhouse. *Educational Psychologist*, v. 41, n. 4, p. 227–232, 2006.
- VISSER, B. A.; ASHTON, M. C.; VERNON, P. A. Beyond *g*: putting multiple intelligences theory to the test. *Intelligence*, v. 34, n. 5, p. 487–502, 2006.
- WATERHOUSE, L. Multiple intelligences, the Mozart effect, and emotional intelligence: a critical review. *Educational Psychologist*, v. 41, n. 4, p. 207–225, 2006.
- WATERHOUSE, L. Why multiple intelligences theory is a neuromyth. *Frontiers in Psychology*, v. 14, 1217288, 2023.
- PASHLER, H. et al. Learning styles: concepts and evidence. *Psychological Science in the Public Interest*, v. 9, n. 3, p. 105–119, 2008.
- HICKS, L. E. Some properties of ipsative, normative, and forced-choice normative measures. *Psychological Bulletin*, v. 74, n. 3, p. 167–184, 1970.

**Inteligência emocional, autorregulação e desenvolvimento**
- GOLEMAN, D. *Inteligência emocional*. Rio de Janeiro: Objetiva, 1995.
- GROSS, J. J. The emerging field of emotion regulation: an integrative review. *Review of General Psychology*, v. 2, n. 3, p. 271–299, 1998.
- LIEBERMAN, M. D. et al. Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli. *Psychological Science*, v. 18, n. 5, p. 421–428, 2007.
- LOCKE, E. A.; LATHAM, G. P. Building a practically useful theory of goal setting and task motivation. *American Psychologist*, v. 57, n. 9, p. 705–717, 2002.
- KOLB, D. A. *Experiential Learning*. Englewood Cliffs: Prentice Hall, 1984.
- FISHER, R.; URY, W.; PATTON, B. *Como chegar ao sim*. Rio de Janeiro: Sextante.
- MINTO, B. *The Pyramid Principle*. London: Pearson.

**Comportamento organizacional e ementas consultadas**
- ROBBINS, S. P.; JUDGE, T. A.; SOBRAL, F. *Comportamento organizacional: teoria e prática no contexto brasileiro*. São Paulo: Pearson.
- UFES. Plano de ensino ADM02158 – Comportamento Organizacional. https://administracao.ufes.br/sites/administracao.ufes.br/files/field/anexo/adm02158_-comportamento_organizacional.pdf
- UDESC/ESAG. Plano de ensino 12CHGP – Comportamento Humano na Gestão Pública. https://www.udesc.br/arquivos/esag/id_cpmenu/671/12CHGP_Comportamento_Humano_Mat_16796756342155_671.pdf
- IFMT. Componente curricular Comportamento Organizacional (Tecnologia em Gestão de RH). https://alf.ifmt.edu.br/media/filer_public/b7/7e/b77ebf72-106c-4c51-9095-344fae96fc99/suptecngrh-1a.pdf
- UFPB. Plano de curso 8108082 – Comportamento Organizacional. https://www.ufpb.br/dcsa/contents/documentos/8108082-comportamento-organizacional-turma-01-2020-1.pdf

**Normas**
- BRASIL. Lei nº 4.119, de 27 de agosto de 1962 (profissão de psicólogo).
- CONSELHO FEDERAL DE PSICOLOGIA. Resolução nº 31/2022 (avaliação psicológica e SATEPSI).
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018 (LGPD).

**Plataformas**
- Supabase – planos e limites: https://supabase.com/pricing
- Vercel – plano Hobby: https://vercel.com/docs/plans/hobby
- Google Antigravity – Rules e Workflows: https://antigravity.google/docs/ide/workflows
- LimeZu – Modern Office: https://limezu.itch.io/modernoffice

**Referência de design**
- QUANTIC DREAM. *Detroit: Become Human*. Sony Interactive Entertainment, 2018.

---

## Apêndice A · Regra do workspace (`.agents/rules/expediente.md`)
O Antigravity lê regras de workspace em `.agents/rules/`, e `.agent/rules/` também funciona em projetos antigos. Copie o bloco abaixo:

```markdown
# Projeto EXPEDIENTE — regras do agente
- A especificação completa está em docs/GDD.md. Leia a seção relevante antes de cada tarefa.
- Construa UMA fase por vez (GDD §14). Ao terminar, rode os critérios de aceite, mostre o resultado e PARE para revisão.
- NÃO altere sem autorização explícita: texto das opções, tags e pesos (§5.5), fórmulas de pontuação (§6), lógica dos finais (§7), schema do banco (§11.5) e textos obrigatórios (Apêndice C).
- Interface 100% em português do Brasil. Nunca chamar a atividade de "teste", "diagnóstico", "laudo" ou "avaliação psicológica".
- Perfil e final são SEMPRE calculados no servidor a partir das escolhas gravadas. O cliente só envia decisionId + optionId.
- SUPABASE_SERVICE_ROLE_KEY só em código de servidor. Nunca com prefixo NEXT_PUBLIC_. Nunca commitar .env.local.
- Todo acesso a localStorage dentro de try/catch; o jogo funciona sem ele.
- TypeScript strict, Zod em todas as rotas, sem dependências além das listadas no GDD §11.1 sem perguntar.
- Ao escrever diálogos: GDD §5.6 (estilo) e §5.7 (palavras). Nenhuma opção pode soar como "a errada".
- Se algo estiver ambíguo, PERGUNTE antes de implementar.
```

---

## Apêndice B · Prompts por fase (para colar no Antigravity)
- **F0.** "Leia `docs/GDD.md` inteiro e a regra em `.agents/rules/expediente.md`. Execute só a Fase F0 da §14: crie o projeto Next.js + TypeScript + Tailwind com a estrutura da §11.2, configure as fontes da §10.1 e um `.gitignore` com `.env.local`. Me diga como publicar pelo GitHub Desktop (repositório privado) e fazer o primeiro deploy na Vercel. Pare ao final."
- **F1.** "Execute a Fase F1. Implemente o modelo de conteúdo (§11.3), o motor (§11.4) e os componentes de jogo (§10.2), com placeholders de arte. Escreva os diálogos do Prólogo e do Capítulo 1 a partir dos beats da §5.5, seguindo §5.6 e §5.7, sem alterar opções nem tags. Mostre como testar no celular e no desktop."
- **F2.** "Execute a Fase F2. Escreva os Capítulos 2 a 5, os finais (§7.2), os epílogos (§7.3) e E01. Implemente `scripts/validate-story.ts` com todas as checagens da §13, rode e me mostre o relatório. Os números da §6.3 e a distribuição da §7.1 precisam bater."
- **F3.** "Execute a Fase F3. Crie `supabase/migrations/0001_init.sql` exatamente como a §11.5, as rotas da §11.6, a fila de envio, o cálculo no servidor (§6.2 e §7.1) e o cron da §11.8. Liste as variáveis de ambiente que preciso configurar no `.env.local` e na Vercel, e os passos no painel do Supabase."
- **F4.** "Execute a Fase F4: Espelho (§8.3) e relatório completo (§8), com CSS de impressão. Use os textos do Apêndice C. Confira que nenhum termo proibido (§1.4 e §8.5) aparece."
- **F5.** "Execute a Fase F5: painel admin da §9, com login Supabase restrito à tabela `admins`, exportação CSV e exclusão de partida. Sem ranking."
- **F6.** "Execute a Fase F6. Os PNGs estão em `public/assets` (lista na §10.3). Ligue-os ao conteúdo, adicione as animações e o fluxograma com % da turma (§5.8), revise a acessibilidade (§12) e rode Lighthouse e Playwright."
- **F7.** "Analise o CSV exportado (anexo) e proponha ajustes de `COESAO_MIN` (§7.1), de redação de opções óbvias (§6.6) e de tamanho de texto para a duração da §4.2. Não aplique nada sem minha aprovação."

---

## Apêndice C · Textos obrigatórios

**C.1 · Ciência (tela de entrada)**
> Esta é uma atividade educacional sobre as inteligências múltiplas. Vamos registrar seu nome, sua turma e as escolhas que você fizer no jogo. Só o professor responsável vê seus resultados. Os dados serão excluídos ao fim do semestre, e você pode pedir a exclusão antes disso.
> ☐ Entendi e quero participar.

**C.2 · Instrução inicial (Como jogar)**
> Não existe resposta certa. Em cada escolha, pense no que **você** faria no lugar do personagem.

**C.3 · Limites (no relatório, sempre visível)**
> **Como ler este mapa.** Ele mostra as formas de agir que você escolheu numa história de cerca de 30 minutos. Ele não mede inteligência, capacidade nem personalidade, e não é um teste psicológico. A teoria das inteligências múltiplas, de Howard Gardner, é uma lente útil para pensar em diferentes formas de resolver problemas, mas tem pouca comprovação científica como medida de inteligências separadas. Use este mapa como ponto de partida para refletir e conversar, não como rótulo.

**C.4 · Fecho do Espelho**
> Diferenças entre como nos vemos e como agimos são material de autoconhecimento, não erro.

**C.5 · Créditos**
> Estrutura narrativa inspirada em *Detroit: Become Human* (Quantic Dream). Arte: [packs, autores e licenças, conforme `public/assets/CREDITS.md`].
