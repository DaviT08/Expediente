export default function EntradaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#14121F] text-[#F2EFE6]">
      <div className="w-full max-w-md bg-[#221F33] p-8 rounded-lg shadow-2xl border border-[#2B7A8C]/30 text-center">
        <h1 className="text-4xl sm:text-5xl font-pixel mb-2 tracking-wider text-[#E0A526]">
          EXPEDIENTE
        </h1>
        <p className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-mono">
          Fase F0 · Base Operacional
        </p>

        <div className="bg-[#14121F] p-4 rounded text-left border border-slate-800 mb-6">
          <p className="text-sm font-semibold text-[#2B7A8C] mb-1">
            Status do Projeto:
          </p>
          <ul className="text-xs space-y-1 text-slate-300">
            <li>✔ Next.js + TypeScript + Tailwind CSS</li>
            <li>✔ Tipografia: Pixelify Sans + Atkinson Hyperlegible</li>
            <li>✔ Estrutura de pastas da seção 11.2 criada</li>
            <li>✔ .agents/rules/expediente.md e docs/GDD.md configurados</li>
            <li>✔ .gitignore com proteção de .env.local</li>
          </ul>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">
              Seu nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              disabled
              className="w-full px-3 py-2 bg-[#14121F] border border-slate-700 rounded text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="turma" className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">
              Código da turma
            </label>
            <input
              id="turma"
              type="text"
              placeholder="Ex: D7A-4KQ"
              disabled
              className="w-full px-3 py-2 bg-[#14121F] border border-slate-700 rounded text-sm text-slate-400 cursor-not-allowed uppercase"
            />
          </div>

          <div className="pt-2">
            <button
              disabled
              className="w-full py-3 bg-[#E0A526]/40 text-[#14121F] font-bold rounded cursor-not-allowed uppercase tracking-wider text-sm transition"
            >
              Começar (Habilitado na Fase F1)
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500 font-mono">
          Raiz Alimentos · Atividade Gamificada
        </p>
      </div>
    </main>
  );
}
