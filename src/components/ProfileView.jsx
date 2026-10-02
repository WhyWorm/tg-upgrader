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
    <div className="w-full max-w-md mx-auto px-3.5 py-3 select-none pb-24 space-y-3 bg-[#0e1621]">
      {/* User Card */}
      <div className="bg-[#17212b] rounded-2xl p-4 border border-[#233244]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#1e2c3a] overflow-hidden flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-base text-[#229ED9]">TG</span>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white">
                {user.username}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#229ED9] text-white font-bold">
                PRO
              </span>
            </div>
            <span className="text-xs text-[#7e8d9b] font-mono mt-0.5">
              ID: {user.tgId || '894129482'}
            </span>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="mt-4 pt-3 border-t border-[#233244] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#7e8d9b] uppercase">
              Баланс
            </span>
            <div className="text-xl font-bold text-white font-mono flex items-center gap-1">
              <span>{balanceTon.toFixed(2)} TON</span>
              <span className="text-xs text-[#7e8d9b] font-normal">
                (~${(balanceTon * 5.25).toFixed(0)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playClick();
                onOpenDeposit();
              }}
              className="px-3 py-2 rounded-lg bg-[#229ED9] hover:bg-[#2aabeb] text-white font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              Пополнить
            </button>
            <button
              onClick={() => {
                playClick();
                onOpenWithdraw();
              }}
              className="px-3 py-2 rounded-lg bg-[#1e2c3a] hover:bg-[#233344] text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              Вывод
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#17212b] border border-[#233244] rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between text-[#7e8d9b] mb-1">
            <span className="text-[10px] uppercase">Игр</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-lg font-bold text-white font-mono">
            {stats.totalGames}
          </span>
          <span className="text-[10px] text-[#7e8d9b] mt-0.5">
            Побед: <span className="text-[#53aee2] font-semibold">{stats.wins}</span> / Поражений: {stats.losses}
          </span>
        </div>

        <div className="bg-[#17212b] border border-[#233244] rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between text-[#7e8d9b] mb-1">
            <span className="text-[10px] uppercase">Винрейт</span>
            <Percent className="w-3.5 h-3.5 text-[#229ED9]" />
          </div>
          <span className="text-lg font-bold text-[#229ED9] font-mono">
            {winRate}%
          </span>
          <span className="text-[10px] text-[#7e8d9b] mt-0.5">
            Процент побед
          </span>
        </div>

        <div className="bg-[#17212b] border border-[#233244] rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between text-[#7e8d9b] mb-1">
            <span className="text-[10px] uppercase">Оборот ставок</span>
            <Zap className="w-3.5 h-3.5 text-[#53aee2]" />
          </div>
          <span className="text-lg font-bold text-white font-mono">
            {stats.totalWagered.toFixed(1)} TON
          </span>
          <span className="text-[10px] text-[#7e8d9b] mt-0.5">
            Сумма ставок
          </span>
        </div>

        <div className="bg-[#17212b] border border-[#233244] rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between text-[#7e8d9b] mb-1">
            <span className="text-[10px] uppercase">Рекорд</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-lg font-bold text-amber-400 font-mono">
            x{stats.bestMultiplier.toFixed(2)}
          </span>
          <span className="text-[10px] text-[#7e8d9b] mt-0.5">
            Лучший множитель
          </span>
        </div>
      </div>

      {/* Provably Fair */}
      <div className="bg-[#17212b] border border-[#233244] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-[#229ED9]" />
            <span>Проверка честности (Provably Fair)</span>
          </div>
          <span className="text-[10px] text-[#53aee2] font-mono font-semibold">
            SHA-256
          </span>
        </div>

        <div className="bg-[#131b24] rounded-lg p-2 border border-[#233244] space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#7e8d9b]">Клиентский сид:</span>
            <div className="flex items-center gap-1">
              <span className="text-white font-mono">{clientSeed}</span>
              <button
                onClick={regenerateClientSeed}
                className="text-[#229ED9] hover:text-[#53aee2]"
                title="Обновить"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
