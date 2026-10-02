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
    <div className="w-full bg-[#17212b] border-b border-[#233244] py-1.5 px-3 overflow-hidden select-none">
      <div className="max-w-md mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-[#229ED9]/15 text-[10px] text-[#53aee2] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#53aee2] animate-pulse" />
          Live
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {drops.map((drop, i) => (
            <div
              key={drop.id + '-' + i}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all ${
                drop.won
                  ? 'bg-[#1e2c3a] border-[#233244] text-white'
                  : 'bg-[#182533] border-[#233244]/60 text-[#7e8d9b]'
              }`}
            >
              <div className="w-6 h-6 shrink-0 relative flex items-center justify-center p-0.5 rounded bg-[#131b24]">
                {drop.image ? (
                  <img src={drop.image} alt={drop.targetName} className="w-full h-full object-contain" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#229ED9]" />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold truncate max-w-[80px] text-white">
                    {drop.targetName}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                    drop.won ? 'bg-[#229ED9] text-white' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    x{drop.multiplier.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#7e8d9b] font-mono">
                  <span>{drop.priceTon.toFixed(1)} TON</span>
                  <span className={drop.won ? 'text-[#53aee2] font-bold' : 'text-rose-400'}>
                    {drop.won ? 'WIN' : 'LOSE'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
