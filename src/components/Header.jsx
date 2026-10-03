import React from 'react';
import { Volume2, VolumeX, Plus, Zap } from 'lucide-react';
import { toggleSound, playClick } from '../utils/sound';
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
    <header className="sticky top-0 z-30 w-full apple-glass border-b border-white/[0.12] select-none">
      {/* Apple Dynamic Island Navigation Bar */}
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* User Capsule */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-[#0A84FF]">TG</span>
              )}
            </div>
            {/* Online Green Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34C759] border-2 border-black" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-white tracking-tight leading-tight">
                {user.firstName || 'Trader'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[#0A84FF] border border-blue-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-medium text-white/50 leading-tight mt-0.5 font-mono">
              {user.username}
            </span>
          </div>
        </div>

        {/* Right: Apple Wallet Balance Pill & Actions */}
        <div className="flex items-center gap-2">
          {/* iOS Capsule Balance */}
          <div 
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full apple-pill-badge hover:bg-white/15 cursor-pointer transition-all active:scale-95"
          >
            <div className="w-2 h-2 rounded-full bg-[#007AFF] shadow-[0_0_8px_#007AFF]" />
            <span className="text-[13px] font-black text-white font-mono tracking-tight">
              {currency === 'TON' ? balanceTon.toFixed(2) : balanceUsdt}
            </span>
            <span className="text-[10px] font-black text-[#0A84FF] tracking-wider font-mono">
              {currency}
            </span>
          </div>

          {/* Plus Deposit Button */}
          <button
            onClick={() => {
              playClick();
              haptics.impact('light');
              onOpenDeposit();
            }}
            className="w-8 h-8 rounded-full apple-btn-primary flex items-center justify-center text-white active:scale-90 transition-all"
            aria-label="Пополнить"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Audio Button */}
          <button
            onClick={handleSoundToggle}
            className="w-8 h-8 rounded-full apple-pill-badge flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5 text-[#0A84FF]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
