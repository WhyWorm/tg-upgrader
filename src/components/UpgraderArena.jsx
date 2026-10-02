import React, { useState, useMemo } from 'react';
import GiftCard from './GiftCard';
import UpgraderWheel from './UpgraderWheel';
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
    return catalog.filter(g => g.rarity === 'legendary' || g.rarity === 'mythic' || g.name.includes('Duck') || g.name.includes('Cap')).slice(0, 7);
  }, [catalog]);

  return (
    <div className="w-full flex flex-col items-center select-none pb-4 bg-black">
      {/* iOS Segmented Control: Gift vs TON */}
      <div className="w-full max-w-md px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#1c1c1e] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => {
              playClick();
              haptics.selection();
              setUseDirectBalance(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !useDirectBalance
                ? 'bg-[#2c2c2e] text-white shadow-sm'
                : 'text-[#8e8e93] hover:text-white'
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              useDirectBalance
                ? 'bg-[#2c2c2e] text-white shadow-sm'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            Баланс TON
          </button>
        </div>

        {useDirectBalance && (
          <div className="flex items-center gap-1.5 bg-[#1c1c1e] border border-white/[0.08] rounded-xl px-3 py-1.5">
            <span className="text-[11px] text-[#8e8e93]">Ставка:</span>
            <input
              type="number"
              step="0.5"
              min="0.1"
              max={balanceTon}
              value={betAmountTon}
              onChange={e => setBetAmountTon(Math.max(0.1, Number(e.target.value)))}
              className="w-14 bg-transparent text-xs font-mono font-bold text-white text-right focus:outline-none"
            />
            <span className="text-[11px] text-[#007AFF] font-mono font-bold">TON</span>
          </div>
        )}
      </div>

      {/* Main Upgrader Cards */}
      <div className="w-full max-w-md px-4 py-2 flex flex-col gap-3">
        {/* Split: Source Gift vs Target Gift */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          {/* YOUR GIFT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
                Ваш подарок
              </span>
              {sourceItem && !useDirectBalance && (
                <button
                  onClick={() => { playClick(); onOpenSourceSelect(); }}
                  className="text-[11px] text-[#007AFF] font-medium"
                >
                  Сменить
                </button>
              )}
            </div>

            {useDirectBalance ? (
              <div className="h-44 rounded-[18px] bg-[#1c1c1e] border border-white/[0.08] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8e8e93]">Баланс TON</span>
                  <span className="text-[11px] text-[#007AFF] font-semibold">Активен</span>
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <span className="text-xl font-bold text-white font-mono">
                    {sourceValue.toFixed(2)} TON
                  </span>
                  <span className="text-[11px] text-[#8e8e93] font-mono">
                    ~${(sourceValue * 5.25).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => { playClick(); setBetAmountTon(val); }}
                      className="px-2 py-0.5 rounded-lg bg-[#2c2c2e] hover:bg-[#007AFF] text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                    >
                      {val}
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
                className="h-44 rounded-[18px] border border-dashed border-white/[0.15] hover:border-[#007AFF] bg-[#1c1c1e]/60 hover:bg-[#1c1c1e] flex flex-col items-center justify-center cursor-pointer transition-all p-3 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#2c2c2e] text-[#007AFF] flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Выбрать подарок
                </span>
                <span className="text-[11px] text-[#8e8e93] mt-0.5">
                  из инвентаря
                </span>
              </div>
            )}
          </div>

          {/* TARGET GIFT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
                Цель апгрейда
              </span>
              {targetItem && (
                <button
                  onClick={() => { playClick(); onOpenTargetSelect(); }}
                  className="text-[11px] text-[#007AFF] font-medium"
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
                className="h-44 rounded-[18px] border border-dashed border-white/[0.15] hover:border-[#007AFF] bg-[#1c1c1e]/60 hover:bg-[#1c1c1e] flex flex-col items-center justify-center cursor-pointer transition-all p-3 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#2c2c2e] text-[#007AFF] flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Цель апгрейда
                </span>
                <span className="text-[11px] text-[#8e8e93] mt-0.5">
                  нажмите для выбора
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Apple Activity Gauge Card */}
        <div className="w-full bg-[#1c1c1e] border border-white/[0.08] rounded-[22px] p-4 flex flex-col items-center">
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

          {/* Quick Multipliers */}
          <div className="w-full mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-1 px-1">
            <span className="text-[11px] text-[#8e8e93]">Множители:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[1.5, 2.0, 5.0, 10.0, 25.0, 50.0].map(mult => (
                <button
                  key={mult}
                  disabled={isRolling}
                  onClick={() => handleQuickMultiplier(mult)}
                  className={`px-2.5 py-1 rounded-lg text-[12px] font-mono font-semibold transition-all ${
                    Math.abs(multiplier - mult) < 0.3
                      ? 'bg-[#007AFF] text-white shadow-sm'
                      : 'bg-[#2c2c2e] text-[#8e8e93] hover:text-white'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Apple Blue UPGRADE Button */}
        <button
          onClick={handleStartUpgrade}
          disabled={isRolling || (!sourceItem && !useDirectBalance) || !targetItem}
          className={`w-full py-4 rounded-[16px] font-semibold text-[15px] tracking-tight flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isRolling
              ? 'bg-[#2c2c2e] text-[#8e8e93] cursor-not-allowed'
              : (!sourceItem && !useDirectBalance) || !targetItem
              ? 'bg-[#1c1c1e] text-[#8e8e93] border border-white/[0.08] cursor-pointer'
              : 'bg-[#007AFF] hover:bg-[#0A84FF] text-white shadow-md'
          }`}
        >
          {isRolling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Апгрейд...</span>
            </>
          ) : !sourceItem && !useDirectBalance ? (
            <span>Выберите ваш подарок</span>
          ) : !targetItem ? (
            <span>Выберите цель апгрейда</span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Апгрейд до {targetItem.name} ({chance.toFixed(1)}%)</span>
            </>
          )}
        </button>

        {/* Popular Targets */}
        <div className="w-full mt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[13px] font-semibold text-white">
              Популярные подарки
            </span>
            <button
              onClick={() => { playClick(); onOpenTargetSelect(); }}
              className="text-[12px] text-[#007AFF] font-medium"
            >
              Все 56 подарков →
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {popularTargets.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  playSelect();
                  haptics.selection();
                  onSelectTargetItem(item);
                }}
                className={`w-28 shrink-0 p-2.5 rounded-[16px] border bg-[#1c1c1e] hover:bg-[#252528] cursor-pointer transition-all flex flex-col items-center ${
                  targetItem?.id === item.id
                    ? 'border-[#007AFF] ring-1 ring-[#007AFF]'
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="h-12 w-12 flex items-center justify-center my-1">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="text-[11px] font-semibold text-white truncate w-full text-center mt-1">
                  {item.name}
                </div>
                <div className="text-[11px] font-mono text-[#007AFF] font-bold">
                  {item.priceTon.toFixed(1)} TON
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
