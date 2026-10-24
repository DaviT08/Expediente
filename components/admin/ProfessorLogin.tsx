'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ProfessorLoginProps {
  configured: boolean;
  onSuccess: () => void;
}

// Tela de senha do painel do professor
export default function ProfessorLogin({ configured, onSuccess }: ProfessorLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/professor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setPassword('');
        onSuccess();
      } else {
        setError(data.error || 'Não foi possível entrar.');
      }
    } catch {
      setError('Sem conexão. Tente de novo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#14121F] text-[#F2EFE6]">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-[#221F33] border border-[#2B7A8C]/50 rounded-xl p-6 sm:p-8 shadow-2xl space-y-5"
      >
        <div>
          <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#E0A526]/10 text-[#E0A526] border border-[#E0A526]/30 font-bold">
            Área Docente
          </span>
          <h1 className="text-3xl font-pixel text-[#E0A526] mt-3 tracking-wide">PAINEL DO PROFESSOR</h1>
        </div>

        {!configured ? (
          <p className="text-sm bg-amber-950/40 border border-amber-700/60 text-amber-200 rounded p-3 leading-relaxed">
            O painel ainda não tem senha. Na Vercel, abra <b>Settings → Environment Variables</b>, crie a variável{' '}
            <code className="font-mono">PROFESSOR_PASSWORD</code> com a senha desejada e faça um novo deploy
            (<b>Deployments → ⋯ → Redeploy</b>).
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="prof-pass" className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-mono font-semibold">
                Senha
              </label>
              <input
                id="prof-pass"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14121F] border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-[#E0A526] focus:ring-1 focus:ring-[#E0A526]"
              />
            </div>
            {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={!password || sending}
              className="w-full py-3 bg-[#E0A526] hover:bg-[#E0A526]/90 disabled:bg-slate-800 disabled:text-slate-500 text-[#14121F] font-bold rounded-lg uppercase tracking-wider text-sm font-mono"
            >
              {sending ? 'Entrando…' : 'Entrar'}
            </button>
          </>
        )}

        <Link href="/" className="block text-center text-xs font-mono text-slate-400 hover:text-white">
          ← Voltar ao jogo
        </Link>
      </form>
    </main>
  );
}
