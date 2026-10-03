import React, { useEffect, useState } from 'react';
import { RECENT_GIFTS_DROPS } from '../data/gifts';
import { Sparkles } from 'lucide-react';

export default function LiveDrops({ latestDrop }) {
  const [drops, setDrops] = useState(RECENT_GIFTS_DROPS);

  useEffect(() => {
    if (latestDrop) {
      setDrops(prev => [latestDrop, ...prev.slice(0, 7)]);
    }
  }, [latestDrop]);

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/[0.08] py-2 px-4 overflow-hidden select-none">
      <div className="max-w-md mx-auto flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Live Badge */}
        <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] text-emerald-400 font-black tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
          Live
        </div>

        {/* Live Drops Horizontal Capsules */}
        <div className="flex items-center gap-2 shrink-0">
          {drops.map((drop, i) => (
            <div
              key={drop.id + '-' + i}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-full apple-glass transition-all ${
                drop.won
                  ? 'border-emerald-500/25 text-white'
                  : 'border-white/[0.08] text-white/50'
              }`}
            >
              <div className="w-5 h-5 shrink-0 relative flex items-center justify-center">
                {drop.image ? (
                  <img src={drop.image} alt={drop.targetName} className="w-full h-full object-contain filter drop-shadow-sm" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold truncate max-w-[75px] text-white">
                  {drop.targetName}
                </span>

                <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                  drop.won ? 'bg-[#007AFF] text-white' : 'apple-pill-badge text-rose-300'
                }`}>
                  x{drop.multiplier.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
