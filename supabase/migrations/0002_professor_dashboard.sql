-- Migration 0002: Suporte ao Painel do Professor, Visões Analíticas e Otimizações de Linha do Tempo
-- Projeto EXPEDIENTE

-- 1. Índice para consultas rápidas na linha do tempo ordenada
create index if not exists choices_run_timeline_idx 
  on public.choices (run_id, chosen_at asc);

-- 2. Permitir que partidas livres utilizem a turma GERAL como padrão caso class_id seja omitido
do $$
begin
  -- Se class_id for obrigatório, garantimos que a turma GERAL possa ser resolvida automaticamente
  perform 1 from public.classes where code = 'GERAL';
  if not found then
    insert into public.classes (code, name, is_open)
    values ('GERAL', 'Turma Geral / Demonstração', true)
    on conflict (code) do nothing;
  end if;
end $$;

-- 3. Visão para o Painel do Professor: Resumo agregado de jogadores
create or replace view public.v_professor_runs as
select 
  r.id as run_id,
  r.player_name,
  r.attempt,
  r.status,
  r.current_node,
  r.state,
  r.scores,
  r.mirror,
  r.ending,
  r.content_version,
  r.started_at,
  r.updated_at,
  r.completed_at,
  r.total_ms,
  c.id as class_id,
  c.code as class_code,
  c.name as class_name,
  coalesce(count(ch.id), 0) as choices_count,
  max(ch.chosen_at) as last_choice_at,
  -- Coesão calculada a partir do estado salvo ou 0
  coalesce((r.state->'vars'->>'LB')::int, 0) as lb,
  coalesce((r.state->'vars'->>'BR')::int, 0) as br,
  coalesce((r.state->'vars'->>'RL')::int, 0) as rl,
  coalesce((r.state->'vars'->>'COOP')::int, 0) as coop,
  (coalesce((r.state->'vars'->>'LB')::int, 0) + 
   coalesce((r.state->'vars'->>'BR')::int, 0) + 
   coalesce((r.state->'vars'->>'RL')::int, 0)) as coesao_total
from public.runs r
left join public.classes c on r.class_id = c.id
left join public.choices ch on r.id = ch.run_id
group by r.id, c.id;

-- 4. Políticas adicionais de RLS para flexibilidade no painel docente
-- Permitir leitura das visões e tabelas pelo professor autenticado ou via service-role
do $$
begin
  -- Política para permitir que o professor/admin leia as turmas e partidas
  if not exists (
    select 1 from pg_policies where tablename = 'runs' and policyname = 'professor_read_runs'
  ) then
    create policy professor_read_runs on public.runs
      for select
      using (public.is_admin() or auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'choices' and policyname = 'professor_read_choices'
  ) then
    create policy professor_read_choices on public.choices
      for select
      using (public.is_admin() or auth.role() = 'authenticated');
  end if;
end $$;

-- 5. Inserção de dados de demonstração (seed) para ambiente de desenvolvimento / testes do professor
do $$
declare
  v_class_id uuid;
  v_run_mariana uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  v_run_lucas uuid   := '22222222-2222-2222-2222-222222222222'::uuid;
  v_run_beatriz uuid := '33333333-3333-3333-3333-333333333333'::uuid;
begin
  select id into v_class_id from public.classes where code = 'GERAL' limit 1;

  if v_class_id is not null then
    -- Partida 1: Mariana Souza (Em andamento no Capítulo 3)
    insert into public.runs (
      id, class_id, player_name, attempt, content_version, status,
      current_node, state, consent_at, started_at, updated_at
    ) values (
      v_run_mariana,
      v_class_id,
      'Mariana Souza',
      1,
      '1.0.0',
      'in_progress',
      'cap3_p06',
      '{
        "vars": { "LB": 1, "BR": 2, "RL": 1, "COOP": 2 },
        "flags": { "F_DADOS": true, "F_VOZ": false, "F_SOFIA": true, "F_SEGREDO": true, "F_LIA_GUARDOU": true, "K2_A": true }
      }'::jsonb,
      now() - interval '35 minutes',
      now() - interval '35 minutes',
      now() - interval '2 minutes'
    ) on conflict (id) do nothing;

    -- Escolhas da Mariana
    insert into public.choices (run_id, decision_id, option_id, decision_type, response_ms, timed_out, chosen_at)
    values
      (v_run_mariana, 'L01', 'a', 'P', 4200, false, now() - interval '34 minutes'),
      (v_run_mariana, 'B01', 'b', 'P', 5100, false, now() - interval '31 minutes'),
      (v_run_mariana, 'R01', 'c', 'P', 3800, false, now() - interval '28 minutes'),
      (v_run_mariana, 'K1',  'a', 'K', 8500, false, now() - interval '24 minutes'),
      (v_run_mariana, 'L02', 'b', 'P', 4600, false, now() - interval '20 minutes'),
      (v_run_mariana, 'B02', 'a', 'P', 6200, false, now() - interval '16 minutes'),
      (v_run_mariana, 'R02', 'd', 'P', 3900, false, now() - interval '13 minutes'),
      (v_run_mariana, 'K2',  'a', 'K', 7100, false, now() - interval '10 minutes'),
      (v_run_mariana, 'L03', 'c', 'P', 4900, false, now() - interval '7 minutes'),
      (v_run_mariana, 'B03', 'a', 'P', 5400, false, now() - interval '4 minutes'),
      (v_run_mariana, 'K3',  'b', 'K', 9200, false, now() - interval '2 minutes')
    on conflict (run_id, decision_id) do nothing;

    -- Partida 2: Lucas Andrade (Concluído com Final A)
    insert into public.runs (
      id, class_id, player_name, attempt, content_version, status,
      current_node, state, scores, mirror, ending, consent_at, started_at, updated_at, completed_at, total_ms
    ) values (
      v_run_lucas,
      v_class_id,
      'Lucas Andrade',
      1,
      '1.0.0',
      'completed',
      'game_finished_screen',
      '{
        "vars": { "LB": 2, "BR": 2, "RL": 1, "COOP": 3 },
        "flags": { "F_DADOS": true, "F_VOZ": true, "F_SOFIA": true, "F_SEGREDO": true, "F_LIA_GUARDOU": true, "K2_A": true }
      }'::jsonb,
      '{
        "raw": { "LIN": 24, "LOG": 26, "ESP": 18, "COR": 12, "MUS": 14, "NAT": 15, "INTER": 32, "INTRA": 28 },
        "scores": { "LIN": 68, "LOG": 75, "ESP": 50, "COR": 35, "MUS": 40, "NAT": 42, "INTER": 90, "INTRA": 82 }
      }'::jsonb,
      '{"LIN": 4, "LOG": 4, "ESP": 3, "COR": 2, "MUS": 2, "NAT": 3, "INTER": 5, "INTRA": 4}'::jsonb,
      'A',
      now() - interval '2 hours',
      now() - interval '2 hours',
      now() - interval '1 hour 28 minutes',
      now() - interval '1 hour 28 minutes',
      1920000
    ) on conflict (id) do nothing;

    -- Escolhas do Lucas (amostra representativa)
    insert into public.choices (run_id, decision_id, option_id, decision_type, response_ms, timed_out, chosen_at)
    values
      (v_run_lucas, 'L01', 'a', 'P', 3100, false, now() - interval '118 minutes'),
      (v_run_lucas, 'B01', 'a', 'P', 4200, false, now() - interval '115 minutes'),
      (v_run_lucas, 'R01', 'a', 'P', 2900, false, now() - interval '112 minutes'),
      (v_run_lucas, 'K1',  'a', 'K', 6100, false, now() - interval '108 minutes'),
      (v_run_lucas, 'L02', 'a', 'P', 4800, false, now() - interval '104 minutes'),
      (v_run_lucas, 'B02', 'b', 'P', 5200, false, now() - interval '100 minutes'),
      (v_run_lucas, 'K2',  'a', 'K', 7400, false, now() - interval '95 minutes'),
      (v_run_lucas, 'K3',  'a', 'K', 6300, false, now() - interval '90 minutes'),
      (v_run_lucas, 'K4',  'a', 'K', 5900, false, now() - interval '85 minutes'),
      (v_run_lucas, 'N1',  'a', 'N', 8900, false, now() - interval '78 minutes'),
      (v_run_lucas, 'K5',  'a', 'K', 6400, false, now() - interval '72 minutes'),
      (v_run_lucas, 'K6',  'a', 'K', 7100, false, now() - interval '65 minutes')
    on conflict (run_id, decision_id) do nothing;

    -- Partida 3: Beatriz Lima (Iniciou recentemente no Capítulo 1)
    insert into public.runs (
      id, class_id, player_name, attempt, content_version, status,
      current_node, state, consent_at, started_at, updated_at
    ) values (
      v_run_beatriz,
      v_class_id,
      'Beatriz Lima',
      1,
      '1.0.0',
      'in_progress',
      'K1',
      '{
        "vars": { "LB": 0, "BR": 0, "RL": 0, "COOP": 0 },
        "flags": { "F_DADOS": false, "F_VOZ": false, "F_SOFIA": false, "F_SEGREDO": false, "F_LIA_GUARDOU": false, "K2_A": false }
      }'::jsonb,
      now() - interval '10 minutes',
      now() - interval '10 minutes',
      now() - interval '1 minute'
    ) on conflict (id) do nothing;

    insert into public.choices (run_id, decision_id, option_id, decision_type, response_ms, timed_out, chosen_at)
    values
      (v_run_beatriz, 'L01', 'b', 'P', 6800, false, now() - interval '8 minutes'),
      (v_run_beatriz, 'B01', 'c', 'P', 4200, false, now() - interval '5 minutes'),
      (v_run_beatriz, 'R01', 'b', 'P', 7100, false, now() - interval '2 minutes')
    on conflict (run_id, decision_id) do nothing;

  end if;
end $$;
