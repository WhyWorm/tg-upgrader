import React from 'react';
import WeaponSvg from './WeaponSvg';
import { RARITIES } from '../data/items';
import { Check, Sparkles } from 'lucide-react';

export default function ItemCard({
  item,
  isSelected = false,
  onClick,
  showSelectBadge = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  badgeText = null
}) {
  if (!item) return null;

  const rarityMeta = RARITIES[item.rarity] || RARITIES.milspec;
  const isSpecial = item.rarity === 'special';

  return (
    <div
      onClick={onClick}
      className={`relative group rounded-2xl p-2.5 transition-all duration-200 cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-[#182335] border-[#229ED9] shadow-[0_0_18px_rgba(34,158,217,0.45)] ring-1 ring-[#229ED9]'
          : 'bg-[#131924]/80 hover:bg-[#18202e] border-slate-800/80 hover:border-[#229ED9]/40 hover:shadow-lg'
      } active:scale-[0.97]`}
      style={{
        boxShadow: isSelected
          ? '0 0 20px rgba(34, 158, 217, 0.45)'
          : isSpecial
          ? '0 0 15px rgba(255, 215, 0, 0.15)'
          : undefined,
      }}
    >
      {/* Background Rarity Glow Gradient */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30"
        style={{ backgroundColor: rarityMeta.color }}
      />

      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-1 relative z-10">
        <span
          className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md font-mono"
          style={{
            color: rarityMeta.color,
            backgroundColor: rarityMeta.bg,
            border: `1px solid ${rarityMeta.border}`
          }}
        >
          {item.wear || 'FN'}
        </span>

        {item.badge && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#229ED9]/20 text-[#229ED9] border border-[#229ED9]/30">
            {item.badge}
          </span>
        )}

        {showSelectBadge && isSelected && (
          <div className="w-4 h-4 rounded-full bg-[#229ED9] text-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Weapon SVG Silhouette */}
      <div className={`relative flex items-center justify-center my-1 ${
        size === 'sm' ? 'h-14' : size === 'lg' ? 'h-24' : 'h-18'
      }`}>
        <WeaponSvg
          type={item.type}
          color1={item.color1 || '#229ED9'}
          color2={item.color2 || '#38b5f2'}
          rarity={item.rarity}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info: Weapon & Skin Name */}
      <div className="relative z-10 flex flex-col mt-1">
        <span className="text-[10px] text-slate-400 font-semibold truncate leading-tight">
          {item.weapon}
        </span>
        <span className="text-xs font-bold text-white truncate leading-tight mt-0.5">
          {item.skin}
        </span>

        {/* Price Tag in TON & USDT */}
        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full bg-[#229ED9]/20 flex items-center justify-center text-[#229ED9]">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L3 8.5L12 22L21 8.5L12 22L21 4.6L18.4 9.2L12 19L5.6 9.2L12 4.6Z" />
              </svg>
            </div>
            <span className="text-xs font-extrabold text-white font-mono">
              {item.priceTon.toFixed(2)}
            </span>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            ~${(item.priceTon * 5.25).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Rarity Bottom Stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: rarityMeta.color }}
      />
    </div>
  );
}
