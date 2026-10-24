'use client';

import React, { useState } from 'react';

interface DatabaseStatusBannerProps {
  isLive: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function DatabaseStatusBanner({
  isLive,
  onRefresh,
  isLoading,
}: DatabaseStatusBannerProps) {
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  return (
    <div className="w-full bg-[#1b1829] border border-slate-700/80 rounded-xl p-3 sm:p-4 mb-6 shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isLive ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`absolute inline-block w-3 h-3 rounded-full animate-ping ${
                isLive ? 'bg-emerald-400/60' : 'bg-amber-400/60'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-300">
                {isLive ? 'Conexão Ativa com Supabase' : 'Banco de dados não conectado'}
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  isLive
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                }`}
              >
                {isLive ? 'POSTGRES LIVE' : 'SEM BANCO'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isLive
                ? 'Sincronizado com as tabelas runs e choices em tempo real.'
                : 'As partidas dos alunos não estão sendo gravadas. No computador (npm run dev) aparecem dados de exemplo; no site publicado, a lista fica vazia.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          {!isLive && (
            <button
              onClick={() => setShowConfigHelp(!showConfigHelp)}
              className="text-xs text-[#E0A526] hover:underline font-mono px-2 py-1 rounded bg-[#E0A526]/10 border border-[#E0A526]/30 transition"
            >
              {showConfigHelp ? 'Fechar Ajuda' : 'Como Conectar?'}
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2B7A8C] hover:bg-[#2B7A8C]/80 disabled:opacity-50 text-white text-xs font-mono font-bold rounded transition"
            title="Atualizar lista de jogadores e decisões"
          >
            <span className={isLoading ? 'animate-spin' : ''}>↻</span>
            <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {showConfigHelp && !isLive && (
        <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300 space-y-2 bg-[#14121F] p-3 rounded-lg font-mono">
          <p className="font-bold text-[#E0A526]">Passos para conectar com seu projeto Supabase:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>
              Na Vercel, em <b>Settings → Environment Variables</b> (ou num arquivo{' '}
              <code className="text-amber-300">.env.local</code> no computador), cadastre:
            </li>
            <div className="p-2 bg-black/40 rounded border border-slate-800 text-[11px] text-emerald-400 select-all overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon<br />
              SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
            </div>
            <li>
              Execute as migrations em <code className="text-amber-300">supabase/migrations/0001_init.sql</code> e{' '}
              <code className="text-amber-300">supabase/migrations/0002_professor_dashboard.sql</code> no SQL Editor do Supabase.
            </li>
            <li>
              Faça um novo deploy na Vercel (<b>Deployments → ⋯ → Redeploy</b>) ou reinicie o{' '}
              <code className="text-amber-300">npm run dev</code>.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
