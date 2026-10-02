import React from 'react';
import LottiePlayer from './LottiePlayer';
import { Star, Check } from 'lucide-react';

const LOTTIE_MAP = {
  'gift-1': '/lottie/gift_lottie_1.json',
  'gift-2': '/lottie/gift_lottie_2.json',
  'gift-15': '/lottie/gift_lottie_15.json',
  'gift-21': '/lottie/gift_lottie_21.json',
  'gift-23': '/lottie/gift_lottie_23.json',
  'gift-30': '/lottie/gift_lottie_30.json',
  'gift-31': '/lottie/gift_lottie_31.json',
  'gift-34': '/lottie/gift_lottie_34.json',
};

export default function GiftCard({
  gift,
  isSelected = false,
  onClick,
  showSelectBadge = false,
  size = 'md',
  animateLottie = true
}) {
  if (!gift) return null;

  const lottiePath = LOTTIE_MAP[gift.id];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-[18px] p-3 transition-all duration-150 cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-[#2c2c2e] border-[#007AFF] ring-1 ring-[#007AFF]'
          : 'bg-[#1c1c1e] hover:bg-[#252528] border-white/[0.08]'
      } active:scale-[0.98]` }
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] font-mono text-[#8e8e93] bg-[#2c2c2e] px-2 py-0.5 rounded-full font-medium">
          {gift.serialNumber || '#00001'}
        </span>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {gift.stars || 25}
          </span>

          {showSelectBadge && isSelected && (
            <div className="w-4 h-4 rounded-full bg-[#007AFF] text-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Crisp Emoji / Gift Image */}
      <div className={`relative flex items-center justify-center my-1.5 ${
        size === 'sm' ? 'h-14' : size === 'lg' ? 'h-24' : 'h-20'
      }`}>
        {animateLottie && lottiePath ? (
          <LottiePlayer
            src={lottiePath}
            fallbackImage={gift.image}
            className="w-full h-full"
          />
        ) : (
          <img
            src={gift.image}
            alt={gift.name}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {/* Title & Price */}
      <div className="flex flex-col mt-1">
        <span className="text-[13px] font-semibold text-white tracking-tight truncate leading-tight">
          {gift.name}
        </span>

        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold text-[#007AFF] font-mono">
            {gift.priceTon.toFixed(2)} TON
          </span>

          <span className="text-[11px] text-[#8e8e93] font-mono">
            ~${(gift.priceTon * 5.25).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
