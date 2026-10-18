import { allStoryNodes, getNodeById } from '../content/story';
import { GameNode, PNode, KNode, SceneNode, Tag, TopLevelTag, getTopLevelTag } from '../content/tags';
import { calculateEnding } from '../lib/endings';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function validateStory(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('\n======================================================');
  console.log('       EXPEDIENTE — VALIDAÇÃO DA NARRATIVA (§13)      ');
  console.log('======================================================\n');

  // 1. CHECAGEM DO GRAFO
  console.log('▶ [1/5] Validando integridade do Grafo Narrativo...');
  const nodeMap = new Map<string, GameNode>();
  for (const node of allStoryNodes) {
    if (nodeMap.has(node.id)) {
      errors.push(`ID de nó duplicado encontrado: "${node.id}"`);
    }
    nodeMap.set(node.id, node);
  }

  const terminalNodes = new Set(['game_finished_screen', 'resolve_ending']);

  for (const node of allStoryNodes) {
    // Checar destinos de 'next'
    if ('next' in node && node.next) {
      if (!nodeMap.has(node.next) && !terminalNodes.has(node.next)) {
        errors.push(`Nó "${node.id}" possui 'next' quebrado para: "${node.next}"`);
      }
    }
    // Checar ramos condicionais
    if (node.kind === 'branch') {
      for (const w of node.when) {
        if (!nodeMap.has(w.next)) {
          errors.push(`Branch "${node.id}" tem destino 'when' inexistente: "${w.next}"`);
        }
      }
      if (!nodeMap.has(node.else)) {
        errors.push(`Branch "${node.id}" tem destino 'else' inexistente: "${node.else}"`);
      }
    }
    // Checar opções de K
    if (node.kind === 'decision' && (node.type === 'K' || node.type === 'N')) {
      const kNode = node as KNode;
      for (const opt of kNode.options) {
        if (opt.next && !nodeMap.has(opt.next)) {
          errors.push(`Decisão "${node.id}" (opção ${opt.id}) tem 'next' quebrado para: "${opt.next}"`);
        }
      }
    }
  }

  // Alcance a partir do início (prologo_intro)
  const reachable = new Set<string>();
  const queue: string[] = ['prologo_intro'];
  while (queue.length > 0) {
    const currId = queue.shift()!;
    if (reachable.has(currId)) continue;
    reachable.add(currId);

    const curr = nodeMap.get(currId);
    if (!curr) continue;

    if ('next' in curr && curr.next) {
      queue.push(curr.next);
    }
    if (curr.kind === 'branch') {
      for (const w of curr.when) queue.push(w.next);
      queue.push(curr.else);
    }
    if (curr.kind === 'resolveEnding') {
      queue.push('final_A');
      queue.push('final_B');
      queue.push('final_C');
      queue.push('final_D');
      queue.push('final_A_scene');
      queue.push('final_B_scene');
      queue.push('final_C_scene');
      queue.push('final_D_scene');
    }
    if (curr.kind === 'decision' && (curr.type === 'K' || curr.type === 'N')) {
      const kNode = curr as KNode;
      for (const opt of kNode.options) {
        if (opt.next) queue.push(opt.next);
      }
    }
  }

  console.log(`  ✓ Nós totais registrados: ${allStoryNodes.length}`);
  console.log(`  ✓ Nós alcançáveis a partir da raiz: ${reachable.size}`);

  // 2. REGRAS DA SEÇÃO 6.6
  console.log('\n▶ [2/5] Validando Regras de Qualidade das Decisões (§6.6)...');
  const pNodes = allStoryNodes.filter(
    (n): n is PNode => n.kind === 'decision' && n.type === 'P'
  );

  console.log(`  ✓ Total de decisões de perfil (P): ${pNodes.length} (esperado: 29)`);
  if (pNodes.length !== 29) {
    errors.push(`Esperadas 29 decisões de perfil (P), encontradas: ${pNodes.length}`);
  }

  const topLevelCounts: Record<TopLevelTag, { decisions: Set<string>; maxWeight: number; sumAvg: number }> = {
    LIN: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    LOG: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    ESP: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    COR: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    MUS: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    NAT: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    INTER: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    INTRA: { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
  };

  const subDimCounts: Record<string, { decisions: Set<string>; maxWeight: number; sumAvg: number }> = {
    'INTER.EMP': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTER.COL': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTER.COM': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTER.CONF': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTRA.REG': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTRA.AUTO': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTRA.MOT': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
    'INTRA.REF': { decisions: new Set(), maxWeight: 0, sumAvg: 0 },
  };

  for (const node of pNodes) {
    if (node.options.length < 2 || node.options.length > 4) {
      errors.push(`Decisão ${node.id} tem ${node.options.length} opções (deve ter de 2 a 4)`);
    }

    const seenMainTags = new Set<string>();

    const decTopMax: Record<TopLevelTag, number> = {
      LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0
    };
    const decTopSum: Record<TopLevelTag, number> = {
      LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0
    };

    const decSubMax: Record<string, number> = {
      'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
      'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0
    };
    const decSubSum: Record<string, number> = {
      'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
      'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0
    };

    for (const opt of node.options) {
      const tags = Object.entries(opt.tags) as [Tag, 1 | 2][];
      if (tags.length === 0) {
        errors.push(`Decisão ${node.id} opção ${opt.id} não possui tags`);
      }

      const mainTagEntry = tags.find(([_, w]) => w === 2);
      if (!mainTagEntry) {
        errors.push(`Decisão ${node.id} opção ${opt.id} não possui tag principal (peso 2)`);
      } else {
        const [mainTag] = mainTagEntry;
        if (seenMainTags.has(mainTag)) {
          errors.push(`Decisão ${node.id} repete tag principal: ${mainTag}`);
        }
        seenMainTags.add(mainTag);
      }

      const optTopWeight: Record<TopLevelTag, number> = {
        LIN: 0, LOG: 0, ESP: 0, COR: 0, MUS: 0, NAT: 0, INTER: 0, INTRA: 0
      };
      const optSubWeight: Record<string, number> = {
        'INTER.EMP': 0, 'INTER.COL': 0, 'INTER.COM': 0, 'INTER.CONF': 0,
        'INTRA.REG': 0, 'INTRA.AUTO': 0, 'INTRA.MOT': 0, 'INTRA.REF': 0
      };

      for (const [tag, weight] of tags) {
        const top = getTopLevelTag(tag);
        optTopWeight[top] = (optTopWeight[top] || 0) + weight;
        topLevelCounts[top].decisions.add(node.id);

        if (subDimCounts[tag]) {
          optSubWeight[tag] = (optSubWeight[tag] || 0) + weight;
          subDimCounts[tag].decisions.add(node.id);
        }
      }

      for (const t of Object.keys(optTopWeight) as TopLevelTag[]) {
        decTopMax[t] = Math.max(decTopMax[t], optTopWeight[t]);
        decTopSum[t] += optTopWeight[t];
      }
      for (const s of Object.keys(optSubWeight)) {
        decSubMax[s] = Math.max(decSubMax[s], optSubWeight[s]);
        decSubSum[s] += optSubWeight[s];
      }
    }

    const nOpt = node.options.length;
    for (const t of Object.keys(decTopMax) as TopLevelTag[]) {
      topLevelCounts[t].maxWeight += decTopMax[t];
      topLevelCounts[t].sumAvg += decTopSum[t] / nOpt;
    }
    for (const s of Object.keys(decSubMax)) {
      subDimCounts[s].maxWeight += decSubMax[s];
      subDimCounts[s].sumAvg += decSubSum[s] / nOpt;
    }
  }

  for (const [t, data] of Object.entries(topLevelCounts)) {
    if (data.decisions.size < 10) {
      errors.push(`Inteligência ${t} aparece em apenas ${data.decisions.size} decisões (mínimo: 10)`);
    }
  }
  for (const [s, data] of Object.entries(subDimCounts)) {
    if (data.decisions.size < 5) {
      errors.push(`Subdimensão ${s} aparece em apenas ${data.decisions.size} decisões (mínimo: 5)`);
    }
  }

  // 3. RECÁLCULO DA TABELA DA SEÇÃO 6.3
  console.log('\n▶ [3/5] Recalculando Linhas de Base e Oportunidades (§6.3)...');
  console.log('----------------------------------------------------------------------');
  console.log(' Inteligência | Decisões (Esperado) | Peso Máx (Esp) | Linha Base (Esp)');
  console.log('----------------------------------------------------------------------');

  const expectedTop: Record<TopLevelTag, { dec: number; max: number; base: number }> = {
    LIN: { dec: 14, max: 24, base: 26 },
    LOG: { dec: 13, max: 23, base: 25 },
    ESP: { dec: 13, max: 24, base: 25 },
    COR: { dec: 12, max: 22, base: 25 },
    MUS: { dec: 11, max: 20, base: 25 },
    NAT: { dec: 11, max: 19, base: 26 },
    INTER: { dec: 25, max: 50, base: 40 },
    INTRA: { dec: 18, max: 35, base: 34 },
  };

  for (const t of Object.keys(expectedTop) as TopLevelTag[]) {
    const act = topLevelCounts[t];
    const exp = expectedTop[t];
    const basePct = Math.round((100 * act.sumAvg) / act.maxWeight);

    const okDec = act.decisions.size === exp.dec ? '✓' : '✗';
    const okMax = act.maxWeight === exp.max ? '✓' : '✗';
    const okBase = basePct === exp.base ? '✓' : '✗';

    console.log(
      ` ${t.padEnd(12)} | ${act.decisions.size.toString().padStart(2)} (${exp.dec}) ${okDec}          | ${act.maxWeight.toString().padStart(2)} (${exp.max}) ${okMax}       | ${basePct.toString().padStart(2)}% (${exp.base}%) ${okBase}`
    );

    if (act.decisions.size !== exp.dec) {
      errors.push(`Divergência em ${t} decisões: calculou ${act.decisions.size}, esperado ${exp.dec}`);
    }
    if (act.maxWeight !== exp.max) {
      errors.push(`Divergência em ${t} peso máximo: calculou ${act.maxWeight}, esperado ${exp.max}`);
    }
    if (basePct !== exp.base) {
      errors.push(`Divergência em ${t} linha de base: calculou ${basePct}%, esperado ${exp.base}%`);
    }
  }

  console.log('----------------------------------------------------------------------');
  console.log(' Subdimensão  | Decisões (Esperado) | Linha Base (Esp)');
  console.log('----------------------------------------------------------------------');
  const expectedSub: Record<string, { dec: number; base: number }> = {
    'INTER.EMP': { dec: 14, base: 28 },
    'INTER.COL': { dec: 12, base: 25 },
    'INTER.COM': { dec: 7, base: 27 },
    'INTER.CONF': { dec: 6, base: 26 },
    'INTRA.REG': { dec: 11, base: 27 },
    'INTRA.AUTO': { dec: 5, base: 25 },
    'INTRA.MOT': { dec: 5, base: 25 },
    'INTRA.REF': { dec: 5, base: 25 },
  };

  for (const s of Object.keys(expectedSub)) {
    const act = subDimCounts[s];
    const exp = expectedSub[s];
    const basePct = Math.round((100 * act.sumAvg) / act.maxWeight);

    const okDec = act.decisions.size === exp.dec ? '✓' : '✗';
    const okBase = basePct === exp.base ? '✓' : '✗';

    console.log(
      ` ${s.padEnd(12)} | ${act.decisions.size.toString().padStart(2)} (${exp.dec}) ${okDec}          | ${basePct.toString().padStart(2)}% (${exp.base}%) ${okBase}`
    );

    if (act.decisions.size !== exp.dec) {
      errors.push(`Divergência em subdimensão ${s} decisões: calculou ${act.decisions.size}, esperado ${exp.dec}`);
    }
    if (basePct !== exp.base) {
      errors.push(`Divergência em subdimensão ${s} linha de base: calculou ${basePct}%, esperado ${exp.base}%`);
    }
  }

  // 4. SIMULAÇÃO DOS FINAIS (§7.1)
  console.log('\n▶ [4/5] Simulando Distribuição dos 4 Finais (§7.1)...');
  const K1_opts = [{ id: 'a', coop: 1 }, { id: 'b', coop: 0 }];
  const K2_opts = [
    { id: 'a', br: 1, dados: true },
    { id: 'b', br: 0, dados: false },
    { id: 'c', br: -1, dados: false },
  ];
  const K3_opts = [
    { id: 'a', lb: -1, br: -1, segredo: true },
    { id: 'b', lb: 1, br: 0 },
    { id: 'c', lb: 1, br: 1 },
  ];
  const K4_opts = [
    { id: 'a', rl: 1, dados: true },
    { id: 'b', rl: -1, dados: false },
  ];
  const K5_opts = [
    { id: 'a', lb: 1, rl: 1, coop: 1 },
    { id: 'b', lb: 0, rl: 0, coop: 1 },
    { id: 'c', br: -1, lb: 0, rl: 0, coop: 0 },
  ];
  const K6_opts = [
    { id: 'a', voz: true },
    { id: 'b', voz: true },
    { id: 'c', voz: false },
  ];

  const endingCounts = { A: 0, B: 0, C: 0, D: 0 };
  let simTotal = 0;

  for (const k1 of K1_opts) {
    for (const k2 of K2_opts) {
      const k4List = k2.id === 'a' ? [{ id: 'skip', rl: 0, dados: true }] : K4_opts;
      for (const k3 of K3_opts) {
        for (const k4 of k4List) {
          for (const k5 of K5_opts) {
            for (const k6 of K6_opts) {
              simTotal++;
              // Fixed moments: M1 (LB +1), M2 (BR +1), M3 (RL +1)
              const lb = 1 + (k3.lb || 0) + (k5.lb || 0);
              const br = 1 + (k2.br || 0) + (k3.br || 0) + (k5.br || 0);
              const rl = 1 + (k4.rl || 0) + (k5.rl || 0);
              const coop = (k1.coop || 0) + (k5.coop || 0);
              const dados = k2.id === 'a' ? true : k4.dados;
              const voz = k6.voz;

              const res = calculateEnding(
                { LB: lb, BR: br, RL: rl, COOP: coop },
                {
                  F_DADOS: dados,
                  F_VOZ: voz,
                  F_SOFIA: false,
                  F_SEGREDO: false,
                  F_LIA_GUARDOU: false,
                  K2_A: k2.id === 'a',
                }
              );
              endingCounts[res.ending]++;
            }
          }
        }
      }
    }
  }

  console.log(`  ✓ Combinações analisadas: ${simTotal} (esperado: 270)`);
  if (simTotal !== 270) {
    errors.push(`Total de combinações de finais diferente de 270: ${simTotal}`);
  }

  const pA = Math.round((endingCounts.A / simTotal) * 100);
  const pB = Math.round((endingCounts.B / simTotal) * 100);
  const pC = Math.round((endingCounts.C / simTotal) * 100);
  const pD = Math.round((endingCounts.D / simTotal) * 100);

  console.log(`  · Final A (Mesa Cheia):                        ${endingCounts.A} (${pA}%)  [Esperado: 26%]`);
  console.log(`  · Final B (Contrato fechado, cadeiras vazias): ${endingCounts.B} (${pB}%)  [Esperado: 30%]`);
  console.log(`  · Final C (Recomeço):                          ${endingCounts.C} (${pC}%)  [Esperado: 10%]`);
  console.log(`  · Final D (Fim de expediente):                 ${endingCounts.D} (${pD}%)  [Esperado: 34%]`);

  if (pA !== 26 || pB !== 30 || pC !== 10 || pD !== 34) {
    errors.push(`Distribuição de finais divergiu do GDD §7.1: A ${pA}%, B ${pB}%, C ${pC}%, D ${pD}%`);
  }

  // 5. ORÇAMENTO DE PALAVRAS POR CAMINHO (§5.7)
  console.log('\n▶ [5/5] Analisando Orçamento de Palavras por Caminho (§5.7)...');
  // Contagem por capítulos
  const chapterWords: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const node of allStoryNodes) {
    let w = 0;
    if (node.kind === 'scene') {
      for (const line of node.lines) {
        w += countWords(line.text);
      }
    } else if (node.kind === 'decision') {
      w += countWords(node.prompt);
      const avgOptWords =
        node.options.reduce((acc, opt) => {
          const reactWords = opt.reaction.reduce((rAcc, rLine) => rAcc + countWords(rLine.text), 0);
          return acc + countWords(opt.text) + reactWords;
        }, 0) / node.options.length;
      w += avgOptWords;
    }
    const chap = 'chapter' in node ? node.chapter : 5;
    chapterWords[chap] = (chapterWords[chap] || 0) + w;
  }

  const expectedChapterWords: Record<number, { label: string; exp: number }> = {
    0: { label: 'Prólogo', exp: 300 },
    1: { label: 'Cap. 1 (Seg)', exp: 750 },
    2: { label: 'Cap. 2 (Ter)', exp: 650 },
    3: { label: 'Cap. 3 (Qua)', exp: 650 },
    4: { label: 'Cap. 4 (Qui)', exp: 650 },
    5: { label: 'Cap. 5 (Sex)', exp: 650 },
    6: { label: 'Final + Epílogo', exp: 350 },
  };

  console.log('----------------------------------------------------------------------');
  console.log(' Bloco Narrativo       | Palavras Estimadas | Meta do GDD §5.7');
  console.log('----------------------------------------------------------------------');
  let estimatedTotalWords = 0;
  for (const [ch, info] of Object.entries(expectedChapterWords)) {
    const act = Math.round(chapterWords[Number(ch)] || 0);
    estimatedTotalWords += act;
    console.log(` ${info.label.padEnd(21)} | ${act.toString().padStart(4)} palavras        | ~${info.exp} palavras`);
  }
  console.log('----------------------------------------------------------------------');
  console.log(` Total Estimado        | ${estimatedTotalWords} palavras        | ≈ 4.000 palavras`);
  console.log('----------------------------------------------------------------------');

  if (estimatedTotalWords < 3400 || estimatedTotalWords > 4600) {
    warnings.push(
      `Caminho narrativo com ${estimatedTotalWords} palavras (fora da faixa de 3.400 a 4.600 palavras).`
    );
  } else {
    console.log(`  ✓ Total de ${estimatedTotalWords} palavras está dentro da faixa de 3.400 a 4.600 palavras!`);
  }

  // RESULTADO FINAL
  console.log('\n======================================================');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('       STATUS: ✅ TODOS OS CRITÉRIOS DA F2 PASSARAM!  ');
  } else if (errors.length === 0) {
    console.log('       STATUS: ✅ SUCESSO COM AVISOS LEVES            ');
  } else {
    console.log(`       STATUS: ❌ FALHAS DETECTADAS (${errors.length})             `);
    for (const err of errors) {
      console.log(`  - ❌ ${err}`);
    }
  }
  if (warnings.length > 0) {
    for (const warn of warnings) {
      console.log(`  - ⚠ ${warn}`);
    }
  }
  console.log('======================================================\n');

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// Execução direta via CLI
if (require.main === module || process.argv[1]?.includes('validate-story')) {
  const res = validateStory();
  if (!res.passed) {
    process.exit(1);
  }
}
