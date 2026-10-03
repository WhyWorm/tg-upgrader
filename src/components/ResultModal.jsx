import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { playWin, playLose, playCash, playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { Trophy, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import LottiePlayer from './LottiePlayer';

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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (won) {
      playWin();
      haptics.notification('success');

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#00F0FF', '#FFD60A', '#ffffff'],
        });
      } catch (e) {}
    } else {
      playLose();
      haptics.notification('error');
    }
  }, [isOpen, won]);

  const handleDismiss = (callback) => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (callback) callback();
      else if (onClose) onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const targetNum = targetItem?.id ? targetItem.id.replace('gift-', '') : '1';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none ${
        isClosing ? 'apple-modal-backdrop-out' : 'apple-modal-backdrop-in'
      }`}
      onClick={() => handleDismiss(onClose)}
    >
      <div 
        className={`relative w-full max-w-sm rounded-[30px] p-6 text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden ${
          isClosing ? 'apple-modal-card-out' : 'apple-modal-card-in'
        } ${
          won 
            ? 'apple-glass-card border-[#007AFF]/50' 
            : 'apple-glass-card border-white/15'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient Backlight */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          won ? 'bg-gradient-to-b from-[#007AFF]/35 to-emerald-500/25' : 'bg-red-500/15'
        }`} />

        {/* Status Header */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center mb-3 shadow-lg apple-icon-pop ${
            won 
              ? 'apple-btn-primary text-white' 
              : 'apple-glass text-rose-400 border border-rose-500/30'
          }`}>
            {won ? <Trophy className="w-7 h-7 stroke-[2.5]" /> : <XCircle className="w-7 h-7 stroke-[2]" />}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight apple-cascade-1">
            {won ? 'УСПЕШНЫЙ АПГРЕЙД' : 'НЕУДАЧА'}
          </h2>

          <div className="flex items-center gap-2 mt-1.5 apple-cascade-1">
            <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full ${
              won ? 'bg-[#007AFF] text-white' : 'apple-pill-badge text-rose-300'
            }`}>
              x{multiplier.toFixed(2)}
            </span>
            <span className="text-xs text-white/50 font-mono font-medium">
              Шанс: {chance.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Center Item Bento Pod */}
        <div className="relative z-10 my-4 p-4 rounded-[22px] apple-glass border border-white/10 apple-cascade-2">
          {won && targetItem ? (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/50 font-extrabold uppercase tracking-widest mb-1">
                ВЫ ПОЛУЧИЛИ
              </span>

              <div className="w-24 h-24 my-2 flex items-center justify-center filter drop-shadow-xl">
                <LottiePlayer
                  src={`./lottie/gift_${targetNum}.json`}
                  fallbackImage={targetItem.image}
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-sm font-black text-white mt-1">
                {targetItem.name}
              </span>
              <span className="text-[11px] text-white/50 font-mono mt-0.5">
                {targetItem.serialNumber || '#00142'} • {targetItem.stars || 50} Stars
              </span>

              <div className="mt-3 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-black text-xs">
                +{targetItem.priceTon.toFixed(2)} TON (~${(targetItem.priceTon * 5.25).toFixed(0)})
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3">
              <span className="text-xs text-white/70 font-semibold mb-2">
                Стрелка остановилась вне выигрышного сектора
              </span>
              <div className="text-xs text-white/50 font-mono space-y-1 bg-black/40 px-3 py-2 rounded-xl w-full">
                <div className="flex justify-between">
                  <span>Выпало:</span>
                  <span className="text-rose-400 font-bold">{rollDegree ? rollDegree.toFixed(1) : 0}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Сектор:</span>
                  <span className="text-white font-bold">{winArc}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col gap-2 mt-2 apple-cascade-3">
          {won ? (
            <>
              <button
                onClick={() => {
                  playClick();
                  handleDismiss(onClose);
                }}
                className="w-full h-12 rounded-[18px] apple-btn-primary text-white font-black text-xs tracking-tight flex items-center justify-center gap-1.5 transition-all"
              >
                <span>ЗАБРАТЬ В ИНВЕНТАРЬ</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {onQuickSell && targetItem && (
                <button
                  onClick={() => {
                    playCash();
                    handleDismiss(() => onQuickSell(targetItem));
                  }}
                  className="w-full h-10 rounded-[16px] apple-pill-badge text-white/70 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  Быстрая продажа за {(targetItem.priceTon * 0.95).toFixed(2)} TON
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                playClick();
                handleDismiss(onTryAgain || onClose);
              }}
              className="w-full h-12 rounded-[18px] apple-glass border border-white/20 hover:bg-white/10 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              ПОПРОБОВАТЬ СНОВА
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
