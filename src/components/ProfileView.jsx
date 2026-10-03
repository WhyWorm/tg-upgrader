import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trophy, 
  Percent, 
  ShieldCheck, 
  RefreshCw, 
  Flame,
  Zap,
} from 'lucide-react';
import { playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function ProfileView({
  user,
  balanceTon,
  stats,
  onOpenDeposit,
  onOpenWithdraw
}) {
  const [clientSeed, setClientSeed] = useState('tg_upgrader_client_9824');

  const regenerateClientSeed = () => {
    playClick();
    haptics.impact('light');
    const newSeed = 'tg_seed_' + Math.random().toString(36).substring(2, 10);
    setClientSeed(newSeed);
  };

  const winRate = stats.totalGames > 0 
    ? ((stats.wins / stats.totalGames) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 select-none pb-24 space-y-3.5 bg-black min-h-screen">
      {/* User Bento Hero Card */}
      <div className="apple-glass-card rounded-[26px] p-5">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0 border border-white/20 shadow-md">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-lg text-[#0A84FF]">TG</span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#34C759] border-2 border-black" />
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                {user.username}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-[#0A84FF] border border-blue-500/30 font-bold">
                PRO
              </span>
            </div>
            <span className="text-xs text-white/50 font-mono mt-0.5">
              ID: {user.tgId || '894129482'}
            </span>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
              Баланс
            </span>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
              <span>{balanceTon.toFixed(2)} TON</span>
              <span className="text-xs text-white/40 font-medium">
                (~${(balanceTon * 5.25).toFixed(0)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClick();
                onOpenDeposit();
              }}
              className="px-3.5 py-2 rounded-full apple-btn-primary text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              Пополнить
            </button>
            <button
              onClick={() => {
                playClick();
                onOpenWithdraw();
              }}
              className="px-3.5 py-2 rounded-full apple-pill-badge text-white/80 hover:text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              Вывод
            </button>
          </div>
        </div>
      </div>

      {/* Stats 2x2 Bento Grid (Ref: Image 1 Bento Boxes) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="apple-glass rounded-[22px] p-3.5 flex flex-col border border-white/10">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Всего Игр</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xl font-black text-white font-mono">
            {stats.totalGames}
          </span>
          <span className="text-[10px] text-white/50 mt-1">
            Побед: <span className="text-[#0A84FF] font-bold">{stats.wins}</span> / Поражений: {stats.losses}
          </span>
        </div>

        <div className="apple-glass rounded-[22px] p-3.5 flex flex-col border border-white/10">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Винрейт</span>
            <Percent className="w-3.5 h-3.5 text-[#0A84FF]" />
          </div>
          <span className="text-xl font-black text-[#0A84FF] font-mono">
            {winRate}%
          </span>
          <span className="text-[10px] text-white/50 mt-1">
            Процент побед
          </span>
        </div>

        <div className="apple-glass rounded-[22px] p-3.5 flex flex-col border border-white/10">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Оборот</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xl font-black text-white font-mono">
            {stats.totalWagered.toFixed(1)} TON
          </span>
          <span className="text-[10px] text-white/50 mt-1">
            Сумма ставок
          </span>
        </div>

        <div className="apple-glass rounded-[22px] p-3.5 flex flex-col border border-white/10">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Рекорд</span>
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-xl font-black text-amber-300 font-mono">
            x{stats.bestMultiplier.toFixed(2)}
          </span>
          <span className="text-[10px] text-white/50 mt-1">
            Макс. множитель
          </span>
        </div>
      </div>

      {/* Provably Fair Card */}
      <div className="apple-glass-card rounded-[22px] p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-[#0A84FF]" />
            <span>Проверка честности (Provably Fair)</span>
          </div>
          <span className="text-[10px] text-[#0A84FF] font-mono font-bold bg-[#007AFF]/15 px-2 py-0.5 rounded-full">
            SHA-256
          </span>
        </div>

        <div className="apple-glass rounded-xl p-2.5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 text-[11px]">Клиентский сид:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-mono text-[11px]">{clientSeed}</span>
              <button
                onClick={regenerateClientSeed}
                className="text-[#0A84FF] hover:text-white transition-colors"
                title="Обновить"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
