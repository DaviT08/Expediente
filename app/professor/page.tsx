'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type {
  RunRecord,
  ClassRecord,
  ProfessorDashboardMetrics,
  EnrichedTimelineItem,
} from '@/lib/supabase/types';
import DatabaseStatusBanner from '@/components/admin/DatabaseStatusBanner';
import MetricsSummary from '@/components/admin/MetricsSummary';
import PlayerList from '@/components/admin/PlayerList';
import PlayerStateCard from '@/components/admin/PlayerStateCard';
import PlayerTimeline from '@/components/admin/PlayerTimeline';
import IntelligenceBreakdown from '@/components/admin/IntelligenceBreakdown';
import ProfessorLogin from '@/components/admin/ProfessorLogin';
import ClassOverview from '@/components/admin/ClassOverview';
import DecisionStats from '@/components/admin/DecisionStats';
import type { ClassOverview as Overview } from '@/lib/professorStats';

export default function ProfessorDashboardPage() {
  // Login: 'loading' → verificando; 'out' → pede a senha; 'in' → painel liberado
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading');
  const [passwordConfigured, setPasswordConfigured] = useState(true);
  const [view, setView] = useState<'runs' | 'overview' | 'decisions'>('runs');
  const [overview, setOverview] = useState<(Overview & { isLive: boolean }) | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/professor/login', { cache: 'no-store' });
      const data = await res.json();
      setPasswordConfigured(!!data.configured);
      setAuth(data.loggedIn ? 'in' : 'out');
    } catch {
      setAuth('out');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    await fetch('/api/professor/login', { method: 'DELETE' }).catch(() => {});
    setAuth('out');
  };

  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [metrics, setMetrics] = useState<ProfessorDashboardMetrics>({
    totalRuns: 0,
    inProgressRuns: 0,
    completedRuns: 0,
    abandonedRuns: 0,
    averageDurationMs: 0,
    averageCohesion: 0,
    endingDistribution: { A: 0, B: 0, C: 0, D: 0 },
  });
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  // Detalhes do jogador selecionado
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);
  const [timeline, setTimeline] = useState<EnrichedTimelineItem[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Filtros
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'state' | 'timeline' | 'scores'>('state');

  // Modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carrega lista geral de partidas
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClassId !== 'all') params.set('classId', selectedClassId);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/professor/runs?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        setAuth('out');
        return;
      }
      const data = await res.json();

      if (data.success) {
        setRuns(data.runs || []);
        setMetrics(data.metrics);
        setClasses(data.classes || []);
        setIsLive(data.isLive);

        // Se houver jogador previamente selecionado, mantém; senão seleciona o primeiro
        if (data.runs && data.runs.length > 0) {
          setSelectedRunId((prev) => {
            const exists = data.runs.some((r: RunRecord) => r.id === prev);
            return exists ? prev : data.runs[0].id;
          });
        } else {
          setSelectedRunId(null);
          setSelectedRun(null);
          setTimeline([]);
        }
      }
    } catch (err) {
      console.error('Falha ao carregar dashboard do professor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId, statusFilter, search]);

  // Carrega detalhes e timeline do jogador selecionado
  const loadPlayerDetails = useCallback(async (runId: string) => {
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/professor/runs/${runId}`, { cache: 'no-store' });
      if (res.status === 401) {
        setAuth('out');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSelectedRun(data.run);
        setTimeline(data.timeline || []);
      }
    } catch (err) {
      console.error(`Falha ao carregar dados do jogador ${runId}:`, err);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Visão da turma e Decisões
  const loadOverview = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedClassId !== 'all') params.set('classId', selectedClassId);
      const res = await fetch(`/api/professor/overview?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        setAuth('out');
        return;
      }
      const data = await res.json();
      if (data.success) setOverview(data);
    } catch (err) {
      console.error('Falha ao carregar a visão da turma:', err);
    }
  }, [selectedClassId]);

  // Efeito inicial e recarga com filtros
  useEffect(() => {
    if (auth !== 'in') return;
    loadDashboardData();
  }, [auth, loadDashboardData]);

  useEffect(() => {
    if (auth !== 'in' || view === 'runs') return;
    loadOverview();
  }, [auth, view, loadOverview]);

  // Efeito ao selecionar outro jogador
  useEffect(() => {
    if (auth === 'in' && selectedRunId) {
      loadPlayerDetails(selectedRunId);
    }
  }, [auth, selectedRunId, loadPlayerDetails]);

  // Auto-refresh opcional (a cada 15 segundos para acompanhar em tempo real)
  useEffect(() => {
    if (!autoRefresh || auth !== 'in') return;
    const interval = setInterval(() => {
      if (view === 'runs') {
        loadDashboardData();
        if (selectedRunId) loadPlayerDetails(selectedRunId);
      } else {
        loadOverview();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, auth, view, loadDashboardData, loadPlayerDetails, loadOverview, selectedRunId]);

  const exportCsv = (tipo: 'partidas' | 'escolhas') => {
    const params = new URLSearchParams({ tipo });
    if (selectedClassId !== 'all') params.set('classId', selectedClassId);
    window.location.href = `/api/professor/export?${params.toString()}`;
  };

  // Excluir partida
  const handleDeleteRun = async () => {
    if (!selectedRunId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/professor/runs/${selectedRunId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Erro ao excluir partida:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Exportar JSON da partida selecionada
  const handleExportJson = () => {
    if (!selectedRun) return;
    const exportData = {
      player: selectedRun,
      timeline,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expediente_${selectedRun.player_name.toLowerCase().replace(/\s+/g, '_')}_detalhes.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (auth === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#14121F] text-slate-400 font-mono text-sm">
        Carregando…
      </main>
    );
  }
  if (auth === 'out') {
    return <ProfessorLogin configured={passwordConfigured} onSuccess={() => setAuth('in')} />;
  }

  return (
    <main className="min-h-screen bg-[#14121F] text-[#F2EFE6] p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Cabeçalho Superior */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#E0A526]/10 text-[#E0A526] border border-[#E0A526]/30 font-bold">
                Área Docente
              </span>
              <span className="text-xs font-mono text-slate-400">
                Projeto EXPEDIENTE · Raiz Alimentos
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-pixel text-[#E0A526] mt-1 tracking-wide">
              PAINEL DO PROFESSOR
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Monitoramento em tempo real do estado dos alunos e histórico de decisões pedagógicas
            </p>
          </div>

          {/* Controles de Topo e Navegação */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Seletor de Turma */}
            <div className="flex items-center space-x-2 text-xs font-mono bg-[#221F33] px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Turma:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent text-[#F2EFE6] font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#221F33]">Todas as Turmas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#221F33]">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Alternador de Atualização Automática */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition flex items-center space-x-1.5 ${
                autoRefresh
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                  : 'bg-[#221F33] text-slate-400 border-slate-700'
              }`}
              title="Ativar/desativar atualização periódica automática (15s)"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{autoRefresh ? 'Tempo Real (15s)' : 'Pausado'}</span>
            </button>

            {/* Exportar CSV (abre no Excel) */}
            <button
              onClick={() => exportCsv('partidas')}
              className="px-3 py-1.5 bg-[#221F33] hover:bg-slate-800 text-slate-200 text-xs font-mono rounded-lg border border-slate-700"
              title="Uma linha por aluno, com final e mapa de preferências"
            >
              ⬇ CSV partidas
            </button>
            <button
              onClick={() => exportCsv('escolhas')}
              className="px-3 py-1.5 bg-[#221F33] hover:bg-slate-800 text-slate-200 text-xs font-mono rounded-lg border border-slate-700"
              title="Uma linha por decisão de cada aluno, com tempo de resposta"
            >
              ⬇ CSV escolhas
            </button>

            {/* Link para o Jogo */}
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-[#14121F] hover:bg-[#221F33] text-slate-300 hover:text-white text-xs font-mono rounded-lg border border-slate-700 transition"
            >
              ← Ir para o Jogo
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-700 text-slate-400 hover:text-white"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Banner de Conexão Supabase */}
        <DatabaseStatusBanner
          isLive={isLive}
          isLoading={isLoading}
          onRefresh={loadDashboardData}
        />

        {/* Abas do painel */}
        <nav className="flex flex-wrap gap-2 font-mono text-sm">
          {([
            ['runs', 'Partidas'],
            ['overview', 'Visão da turma'],
            ['decisions', 'Decisões'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`px-4 py-2 rounded-lg border font-bold transition ${
                view === k
                  ? 'bg-[#E0A526] text-[#14121F] border-[#E0A526]'
                  : 'bg-[#221F33] text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {label}
              {k === 'decisions' && overview && overview.decisions.some((d) => d.options.some((o) => o.obvious)) && (
                <span className="ml-1.5 text-rose-500" title="Há opções óbvias para revisar">●</span>
              )}
            </button>
          ))}
        </nav>

        {view === 'overview' &&
          (overview ? (
            <ClassOverview
              data={overview}
              onOpenRun={(id) => {
                setSelectedRunId(id);
                setView('runs');
              }}
            />
          ) : (
            <p className="text-sm font-mono text-slate-400">Carregando…</p>
          ))}

        {view === 'decisions' &&
          (overview ? <DecisionStats decisions={overview.decisions} /> : <p className="text-sm font-mono text-slate-400">Carregando…</p>)}

        {view === 'runs' && (<>
        {/* Cartões de Métricas Agregadas */}
        <MetricsSummary metrics={metrics} />

        {/* Layout Principal: Coluna Esquerda (Lista de Alunos) + Coluna Direita (Estado Atual + Timeline) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Lista de Alunos (4 colunas no grid lg) */}
          <div className="lg:col-span-4 h-full">
            <PlayerList
              runs={runs}
              selectedRunId={selectedRunId}
              onSelectRun={(id) => setSelectedRunId(id)}
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>

          {/* Coluna Direita: Painel Detalhado do Jogador (8 colunas no grid lg) */}
          <div className="lg:col-span-8 space-y-6">
            {isLoadingDetails && !selectedRun ? (
              <div className="bg-[#221F33] border border-slate-700 rounded-xl p-12 text-center font-mono text-sm text-slate-400">
                Carregando dados da partida...
              </div>
            ) : !selectedRun ? (
              <div className="bg-[#221F33] border border-slate-700 rounded-xl p-12 text-center font-mono text-sm text-slate-400">
                Selecione um jogador na lista ao lado para inspecionar o progresso.
              </div>
            ) : (
              <>
                {/* Barra de Navegação entre Visão do Estado, Linha do Tempo e Inteligências */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#221F33] border border-slate-700/80 rounded-xl p-3 shadow-sm">
                  {/* Abas */}
                  <div className="flex space-x-1.5 font-mono text-xs">
                    <button
                      onClick={() => setActiveTab('state')}
                      className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center space-x-1.5 ${
                        activeTab === 'state'
                          ? 'bg-[#E0A526] text-[#14121F]'
                          : 'text-slate-300 hover:text-white hover:bg-[#14121F]'
                      }`}
                    >
                      <span>📊</span>
                      <span>Estado Atual</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center space-x-1.5 ${
                        activeTab === 'timeline'
                          ? 'bg-[#E0A526] text-[#14121F]'
                          : 'text-slate-300 hover:text-white hover:bg-[#14121F]'
                      }`}
                    >
                      <span>⏱</span>
                      <span>Linha do Tempo ({timeline.length})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('scores')}
                      className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center space-x-1.5 ${
                        activeTab === 'scores'
                          ? 'bg-[#E0A526] text-[#14121F]'
                          : 'text-slate-300 hover:text-white hover:bg-[#14121F]'
                      }`}
                    >
                      <span>🧠</span>
                      <span>Inteligências Múltiplas</span>
                    </button>
                  </div>

                  {/* Ações Específicas do Jogador */}
                  <div className="flex items-center space-x-2 text-xs font-mono self-end sm:self-auto">
                    <button
                      onClick={handleExportJson}
                      className="px-2.5 py-1.5 bg-[#14121F] hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition"
                      title="Baixar JSON com todas as variáveis e histórico"
                    >
                      Exportar JSON
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded border border-rose-800/60 transition"
                      title="Excluir partida a pedido do aluno (LGPD)"
                    >
                      Excluir Partida
                    </button>
                  </div>
                </div>

                {/* Conteúdo Dinâmico por Aba */}
                {activeTab === 'state' && (
                  <div className="space-y-6">
                    {/* Visualização Completa do Estado Atual (Requirement 1) */}
                    <PlayerStateCard run={selectedRun} />
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    {/* Linha do Tempo Detalhada das Escolhas (Requirement 2) */}
                    <PlayerTimeline
                      timeline={timeline}
                      playerName={selectedRun.player_name}
                    />
                  </div>
                )}

                {activeTab === 'scores' && (
                  <div className="space-y-6">
                    {/* Detalhamento de Inteligências Gardner */}
                    <IntelligenceBreakdown run={selectedRun} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        </>)}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && selectedRun && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#221F33] border-2 border-rose-700/80 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-pixel text-rose-400">
                Confirmar Exclusão de Partida
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-body">
                Tem certeza que deseja excluir os dados e histórico de escolhas de{' '}
                <strong className="text-white">{selectedRun.player_name}</strong>?
                Esta operação atende ao direito de exclusão previsto no termo de consentimento e na LGPD. Os dados não poderão ser recuperados.
              </p>
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700 font-mono text-xs">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-[#14121F] hover:bg-slate-800 text-slate-300 rounded border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteRun}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir Definitivamente'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
