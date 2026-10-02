import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playWin, playLose, playCash, playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { Trophy, XCircle, DollarSign, RotateCcw } from 'lucide-react';

export default function ResultModal({
  isOpen,
  won,
  sourceItem,
  targetItem,
  multiplier,
  chance,
  rollDegree,
  winArc,
  onClose,
  onQuickSell,
  onTryAgain
}) {
  useEffect(() => {
    if (!isOpen) return;

    if (won) {
      playWin();
      haptics.notification('success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#229ED9', '#53aee2', '#ffffff'],
        });
      } catch (e) {}
    } else {
      playLose();
      haptics.notification('error');
    }
  }, [isOpen, won]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`relative w-full max-w-sm rounded-2xl p-5 border text-center shadow-xl ${
        won 
          ? 'bg-[#17212b] border-[#229ED9]' 
          : 'bg-[#17212b] border-[#233244]'
      }`}>
        {/* Status Header */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
            won 
              ? 'bg-[#229ED9] text-white' 
              : 'bg-[#1e2c3a] text-rose-400 border border-rose-500/30'
          }`}>
            {won ? <Trophy className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>

          <h2 className="text-lg font-bold text-white">
            {won ? 'Успешный апгрейд!' : 'Неудача'}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              won ? 'bg-[#229ED9] text-white' : 'bg-[#1e2c3a] text-rose-400'
            }`}>
              x{multiplier.toFixed(2)}
            </span>
            <span className="text-xs text-[#7e8d9b] font-mono">
              Шанс: {chance.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Center Item */}
        <div className="my-4 p-4 rounded-xl bg-[#131b24] border border-[#233244]">
          {won && targetItem ? (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#7e8d9b] uppercase tracking-wider mb-1">
                Вы получили
              </span>

              <div className="w-24 h-24 my-1 flex items-center justify-center">
                <img
                  src={targetItem.image}
                  alt={targetItem.name}
                  className="max-h-full max-w-full object-contain animate-tg-float"
                />
              </div>

              <span className="text-sm font-bold text-white mt-1">
                {targetItem.name}
              </span>
              <span className="text-[11px] text-[#7e8d9b] font-mono">
                {targetItem.serialNumber || '#00142'} • {targetItem.stars || 50} Stars
              </span>

              <div className="mt-2 px-3 py-1 rounded bg-[#229ED9]/15 text-[#53aee2] font-mono font-bold text-xs">
                +{targetItem.priceTon.toFixed(2)} TON (~${(targetItem.priceTon * 5.25).toFixed(0)})
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <span className="text-xs text-slate-300 font-medium mb-1">
                Подарок сгорел
              </span>
              <div className="text-xs text-[#7e8d9b] font-mono space-y-1">
                <div>Стрелка: <span className="text-rose-400 font-bold">{rollDegree ? rollDegree.toFixed(1) : 0}°</span></div>
                <div>Выигрышный сектор: <span className="text-white">{winArc}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {won ? (
            <>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-[#229ED9] hover:bg-[#2aabeb] text-white font-semibold text-xs transition-colors"
              >
                Забрать в инвентарь
              </button>

              {onQuickSell && targetItem && (
                <button
                  onClick={() => {
                    playCash();
                    onQuickSell(targetItem);
                  }}
                  className="w-full py-2 rounded-lg bg-[#1e2c3a] hover:bg-[#233344] text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Быстрая продажа за {(targetItem.priceTon * 0.95).toFixed(2)} TON
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                playClick();
                onTryAgain ? onTryAgain() : onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-[#1e2c3a] hover:bg-[#233344] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
