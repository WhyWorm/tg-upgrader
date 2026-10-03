import React from 'react';
import LottiePlayer from './LottiePlayer';
import { Star, Check } from 'lucide-react';

const RARITY_GLOW = {
  common: 'from-blue-500/20 to-transparent',
  rare: 'from-blue-600/25 to-transparent',
  epic: 'from-purple-600/30 to-transparent',
  legendary: 'from-amber-500/35 to-transparent',
  mythic: 'from-rose-500/40 to-transparent',
};

const RARITY_LABEL = {
  common: { text: 'COMMON', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  rare: { text: 'RARE', color: 'text-sky-300 bg-sky-500/15 border-sky-400/25' },
  epic: { text: 'EPIC', color: 'text-purple-300 bg-purple-500/15 border-purple-400/25' },
  legendary: { text: 'LEGEND', color: 'text-amber-300 bg-amber-500/20 border-amber-400/30' },
  mythic: { text: 'MYTHIC', color: 'text-rose-300 bg-rose-500/20 border-rose-400/30' },
};

export default function GiftCard({
  gift,
  isSelected = false,
  onClick,
  showSelectBadge = false,
  size = 'md',
  animateLottie = false
}) {
  if (!gift) return null;

  const giftNum = gift.id ? gift.id.replace('gift-', '') : '1';
  const lottiePath = `./lottie/gift_${giftNum}.json`;
  const glowGradient = RARITY_GLOW[gift.rarity] || RARITY_GLOW.common;
  const rarityBadge = RARITY_LABEL[gift.rarity] || RARITY_LABEL.common;

  // Only animate if selected or explicitly requested (hero card)
  const shouldAnimate = isSelected || animateLottie;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-[22px] p-3.5 transition-transform duration-150 cursor-pointer overflow-hidden transform-gpu will-change-transform ${
        isSelected
          ? 'apple-glass-card apple-selected-rim scale-[1.01]'
          : 'apple-glass-card hover:border-white/25 active:scale-[0.98]'
      }`}
    >
      {/* Radiant Apple Backlight Glow */}
      <div 
        className={`absolute -inset-2 bg-gradient-radial ${glowGradient} blur-lg opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} 
      />

      {/* Top Header: Serial & Star/Rarity Pills */}
      <div className="relative z-10 flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-mono text-white/60 bg-black/50 border border-white/10 px-2 py-0.5 rounded-full font-medium tracking-tight">
          {gift.serialNumber || '#00001'}
        </span>

        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full border ${rarityBadge.color}`}>
            {rarityBadge.text}
          </span>

          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-300 stroke-none" />
            {gift.stars || 25}
          </span>

          {showSelectBadge && isSelected && (
            <div className="w-4 h-4 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-sm">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Crisp Sticker: Hardware Canvas for selected, WebP for grid */}
      <div className={`relative z-10 flex items-center justify-center my-2 ${
        size === 'sm' ? 'h-14' : size === 'lg' ? 'h-24' : 'h-20'
      }`}>
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {shouldAnimate ? (
            <LottiePlayer
              src={lottiePath}
              fallbackImage={gift.image}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={gift.image}
              alt={gift.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Title & Apple Cupertino Price Pill */}
      <div className="relative z-10 flex flex-col mt-1">
        <span className="text-[13px] font-bold text-white tracking-tight truncate leading-tight">
          {gift.name}
        </span>

        <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between">
          {/* TON Capsule */}
          <div className="flex items-center gap-1 bg-[#007AFF]/20 border border-[#007AFF]/30 px-2.5 py-1 rounded-full">
            <span className="text-xs font-black text-white font-mono tracking-tight">
              {gift.priceTon.toFixed(2)}
            </span>
            <span className="text-[10px] font-black text-[#0A84FF] tracking-wider font-mono">
              TON
            </span>
          </div>

          <span className="text-[11px] font-semibold text-white/50 font-mono">
            ${(gift.priceTon * 5.25).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
