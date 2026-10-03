import React, { useState, useMemo } from 'react';
import GiftCard from './GiftCard';
import UpgraderWheel from './UpgraderWheel';
import LottiePlayer from './LottiePlayer';
import { Plus, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { playClick, playSelect } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function UpgraderArena({
  sourceItem,
  targetItem,
  onOpenSourceSelect,
  onOpenTargetSelect,
  onClearSource,
  onSelectTargetItem,
  catalog = [],
  onExecuteUpgrade,
  isRolling = false,
  finalDegree = null,
  onSpinEnd,
  balanceTon,
  useDirectBalance = false,
  setUseDirectBalance,
  betAmountTon = 1.0,
  setBetAmountTon
}) {
  const [rollDirection, setRollDirection] = useState('under');

  const sourceValue = useDirectBalance 
    ? Number(betAmountTon) || 0.1 
    : (sourceItem ? sourceItem.priceTon : 0);

  const targetValue = targetItem ? targetItem.priceTon : 0;
  const houseEdge = 0.05;

  const { multiplier, chance } = useMemo(() => {
    if (!sourceValue || !targetValue || targetValue <= 0) {
      return { multiplier: 2.0, chance: 47.5 };
    }
    const mult = targetValue / sourceValue;
    const rawChance = (sourceValue / targetValue) * (1 - houseEdge) * 100;
    const clampedChance = Math.min(95, Math.max(0.1, rawChance));
    return { multiplier: mult, chance: clampedChance };
  }, [sourceValue, targetValue]);

  const handleQuickMultiplier = (targetMult) => {
    playClick();
    haptics.selection();
    if (!sourceValue || sourceValue <= 0) return;
    const desiredTargetPrice = sourceValue * targetMult;

    const closest = catalog.reduce((prev, curr) => {
      return Math.abs(curr.priceTon - desiredTargetPrice) < Math.abs(prev.priceTon - desiredTargetPrice)
        ? curr
        : prev;
    }, catalog[0]);

    if (closest) {
      onSelectTargetItem(closest);
    }
  };

  const handleStartUpgrade = () => {
    if (isRolling) return;
    if (!sourceItem && !useDirectBalance) {
      onOpenSourceSelect();
      return;
    }
    if (!targetItem) {
      onOpenTargetSelect();
      return;
    }
    onExecuteUpgrade({
      sourceValue,
      targetValue,
      multiplier,
      chance,
      rollDirection,
    });
  };

  const popularTargets = useMemo(() => {
    return catalog.filter(g => g.rarity === 'legendary' || g.rarity === 'mythic' || g.name.includes('Duck') || g.name.includes('Cap')).slice(0, 8);
  }, [catalog]);

  const profitTon = Math.max(0, targetValue - sourceValue);

  return (
    <div className="relative w-full flex flex-col items-center select-none pb-8 bg-black overflow-hidden">
      {/* Zero-cost GPU radial background aura */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(0,122,255,0.14)_0%,transparent_70%)]" />

      {/* Mode Switcher: Apple Segmented Pill */}
      <div className="relative z-10 w-full max-w-md px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center p-1 rounded-full apple-segmented-bar">
          <button
            onClick={() => {
              playClick();
              haptics.selection();
              setUseDirectBalance(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              !useDirectBalance
                ? 'apple-segmented-item-active'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Подарок
          </button>
          <button
            onClick={() => {
              playClick();
              haptics.selection();
              setUseDirectBalance(true);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              useDirectBalance
                ? 'apple-segmented-item-active'
                : 'text-white/60 hover:text-white'
            }`}
          >
            TON Баланс
          </button>
        </div>

        {useDirectBalance && (
          <div className="flex items-center gap-1.5 apple-pill-badge px-3 py-1.5">
            <span className="text-[11px] font-semibold text-white/50">Ставка:</span>
            <input
              type="number"
              step="0.5"
              min="0.1"
              max={balanceTon}
              value={betAmountTon}
              onChange={e => setBetAmountTon(Math.max(0.1, Number(e.target.value)))}
              className="w-12 bg-transparent text-xs font-mono font-black text-white text-right focus:outline-none"
            />
            <span className="text-[11px] text-[#0A84FF] font-mono font-black">TON</span>
          </div>
        )}
      </div>

      {/* Main Apple Bento Cards Stage */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col gap-3">
        {/* Split: Source Item vs Target Item */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          {/* YOUR STAKE */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
                Ваша ставка
              </span>
              {sourceItem && !useDirectBalance && (
                <button
                  onClick={() => { playClick(); onOpenSourceSelect(); }}
                  className="text-[11px] text-[#0A84FF] font-bold hover:underline"
                >
                  Сменить
                </button>
              )}
            </div>

            {useDirectBalance ? (
              <div className="h-48 rounded-[22px] apple-glass-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">TON Пул</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    {sourceValue.toFixed(2)} <span className="text-[#0A84FF] text-lg font-bold">TON</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white/50 font-mono mt-0.5">
                    ≈ ${(sourceValue * 5.25).toFixed(0)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => { playClick(); setBetAmountTon(val); }}
                      className={`py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
                        betAmountTon === val
                          ? 'bg-[#007AFF] text-white shadow-sm'
                          : 'apple-pill-badge text-white/70 hover:text-white'
                      }`}
                    >
                      {val}T
                    </button>
                  ))}
                </div>
              </div>
            ) : sourceItem ? (
              <div className="relative">
                <GiftCard
                  gift={sourceItem}
                  onClick={() => { playClick(); onOpenSourceSelect(); }}
                  isSelected={true}
                />
              </div>
            ) : (
              <div
                onClick={() => {
                  playClick();
                  haptics.selection();
                  onOpenSourceSelect();
                }}
                className="h-48 rounded-[22px] border border-dashed border-white/20 hover:border-[#007AFF] bg-white/[0.03] hover:bg-white/[0.06] flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group"
              >
                <div className="w-12 h-12 rounded-full apple-glass border border-white/20 text-[#0A84FF] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">
                  Выбрать подарок
                </span>
                <span className="text-[10px] text-white/50 mt-0.5">
                  из инвентаря
                </span>
              </div>
            )}
          </div>

          {/* TARGET GIFT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
                Цель апгрейда
              </span>
              {targetItem && (
                <button
                  onClick={() => { playClick(); onOpenTargetSelect(); }}
                  className="text-[11px] text-[#0A84FF] font-bold hover:underline"
                >
                  Каталог
                </button>
              )}
            </div>

            {targetItem ? (
              <div className="relative">
                <GiftCard
                  gift={targetItem}
                  onClick={() => { playClick(); onOpenTargetSelect(); }}
                  isSelected={true}
                />
              </div>
            ) : (
              <div
                onClick={() => {
                  playClick();
                  haptics.selection();
                  onOpenTargetSelect();
                }}
                className="h-48 rounded-[22px] border border-dashed border-white/20 hover:border-[#007AFF] bg-white/[0.03] hover:bg-white/[0.06] flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group"
              >
                <div className="w-12 h-12 rounded-full apple-glass border border-white/20 text-[#0A84FF] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">
                  Выбрать цель
                </span>
                <span className="text-[10px] text-white/50 mt-0.5">
                  из каталога
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Apple Bento Activity Ring Card */}
        <div className="w-full apple-glass-card rounded-[26px] p-4 flex flex-col items-center">
          <UpgraderWheel
            chance={chance}
            multiplier={multiplier}
            isRolling={isRolling}
            rollDirection={rollDirection}
            onToggleRollDirection={() => {
              playClick();
              haptics.selection();
              setRollDirection(prev => prev === 'under' ? 'over' : 'under');
            }}
            finalDegree={finalDegree}
            onSpinEnd={onSpinEnd}
            targetItem={targetItem}
          />

          {/* Bento Metrics Pills Row */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-white/[0.08]">
            <div className="flex flex-col items-center p-2 rounded-[16px] apple-pill-badge">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/45">
                Шанс
              </span>
              <span className="text-xs font-black text-cyan-300 font-mono mt-0.5">
                {chance.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-[16px] apple-pill-badge">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/45">
                Диапазон
              </span>
              <span className="text-xs font-black text-white font-mono mt-0.5">
                {rollDirection === 'under' ? `0 – ${chance.toFixed(0)}` : `${(100 - chance).toFixed(0)} – 100`}
              </span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-[16px] apple-pill-badge">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/45">
                Профит
              </span>
              <span className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                +{profitTon.toFixed(1)} T
              </span>
            </div>
          </div>

          {/* Quick Multipliers Capsule Bar */}
          <div className="w-full mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-1 px-1">
            <span className="text-[10px] font-extrabold text-white/45 uppercase tracking-wider">
              Множитель:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[1.5, 2.0, 3.0, 5.0, 10.0, 25.0, 50.0].map(mult => (
                <button
                  key={mult}
                  disabled={isRolling}
                  onClick={() => handleQuickMultiplier(mult)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                    Math.abs(multiplier - mult) < 0.25
                      ? 'bg-gradient-to-r from-[#007AFF] to-[#0A84FF] text-white shadow-sm ring-1 ring-white/30'
                      : 'apple-pill-badge text-white/60 hover:text-white'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Apple Vision Pro Upgrade Button */}
        <button
          onClick={handleStartUpgrade}
          disabled={isRolling || (!sourceItem && !useDirectBalance) || !targetItem}
          className={`w-full h-14 rounded-[20px] font-black text-[15px] tracking-tight flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] ${
            isRolling
              ? 'apple-glass text-white/50 cursor-not-allowed border-white/10'
              : (!sourceItem && !useDirectBalance) || !targetItem
              ? 'apple-glass-card text-white/50 cursor-pointer border-white/15'
              : 'apple-btn-primary text-white shadow-[0_8px_32px_rgba(0,122,255,0.45)]'
          }`}
        >
          {isRolling ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>АПГРЕЙД В ПРОЦЕССЕ...</span>
            </>
          ) : !sourceItem && !useDirectBalance ? (
            <span>ВЫБЕРИТЕ ВАШ ПРЕДМЕТ</span>
          ) : !targetItem ? (
            <span>ВЫБЕРИТЕ ЦЕЛЬ АПГРЕЙДА</span>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              <span>АПГРЕЙД ДО {targetItem.name.toUpperCase()} ({chance.toFixed(1)}%)</span>
            </>
          )}
        </button>

        {/* Popular Gifts Apple Shelf */}
        <div className="w-full mt-2">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">
              Популярные цели
            </span>
            <button
              onClick={() => { playClick(); onOpenTargetSelect(); }}
              className="text-[11px] text-[#0A84FF] font-bold hover:underline"
            >
              Все 56 подарков →
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {popularTargets.map(item => {
              const itemNum = item.id.replace('gift-', '');
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSelect();
                    haptics.selection();
                    onSelectTargetItem(item);
                  }}
                  className={`w-28 shrink-0 p-3 rounded-[20px] cursor-pointer transition-all flex flex-col items-center ${
                    targetItem?.id === item.id
                      ? 'apple-glass-card apple-selected-rim scale-[1.02]'
                      : 'apple-glass-card hover:border-white/25 hover:scale-[1.02]'
                  }`}
                >
                  <div className="h-12 w-12 flex items-center justify-center my-1 filter drop-shadow-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-white truncate w-full text-center mt-1">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#0A84FF] font-black mt-0.5">
                    {item.priceTon.toFixed(1)} TON
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
