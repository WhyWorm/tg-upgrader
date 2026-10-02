import React from 'react';
import { Volume2, VolumeX, Plus, ChevronRight, Pin } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function Header({ 
  user, 
  balanceTon, 
  currency, 
  setCurrency, 
  onOpenDeposit, 
  soundOn, 
  setSoundOn 
}) {
  const tonToUsdtRate = 5.25;
  const balanceUsdt = (balanceTon * tonToUsdtRate).toFixed(2);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    haptics.selection();
    if (next) playClick();
  };

  const toggleCurrency = () => {
    playClick();
    haptics.selection();
    setCurrency(prev => prev === 'TON' ? 'USDT' : 'TON');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#1c1c1e]/85 backdrop-blur-2xl border-b border-white/[0.08] select-none">
      {/* iOS App Navigation Bar */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2c2c2e] overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-white/10">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-xs text-[#007AFF]">TG</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-white tracking-tight leading-tight">
              Gifts Upgrader
            </span>
            <span className="text-[12px] text-[#8e8e93] leading-tight mt-0.5">
              {user.username} • 1,482 в сети
            </span>
          </div>
        </div>

        {/* Right: Balance & Actions */}
        <div className="flex items-center gap-2">
          {/* iOS Segmented Balance Pill */}
          <div 
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            <span className="text-[13px] font-bold text-white font-mono">
              {currency === 'TON' ? balanceTon.toFixed(2) : balanceUsdt}
            </span>
            <span className="text-[11px] font-bold text-[#007AFF]">
              {currency}
            </span>
          </div>

          {/* iOS Blue Plus Deposit */}
          <button
            onClick={() => {
              playClick();
              haptics.impact('light');
              onOpenDeposit();
            }}
            className="w-8 h-8 rounded-full bg-[#007AFF] hover:bg-[#0A84FF] text-white flex items-center justify-center active:scale-95 transition-all shadow-sm"
            aria-label="Пополнить"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Sound Button */}
          <button
            onClick={handleSoundToggle}
            className="w-8 h-8 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] flex items-center justify-center text-[#8e8e93] hover:text-white transition-colors"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5 text-[#007AFF]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#8e8e93]" />
            )}
          </button>
        </div>
      </div>

      {/* iOS Pinned Announcement Bar */}
      <div className="bg-[#161618] px-4 py-2 flex items-center justify-between text-xs border-t border-white/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <Pin className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
          <span className="text-[12px] text-slate-300 truncate">
            Шанс на мишку: 1 💎 • Шанс на Durov Cap: 0.3% • Вывод на TON
          </span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[#8e8e93] shrink-0" />
      </div>
    </header>
  );
}
