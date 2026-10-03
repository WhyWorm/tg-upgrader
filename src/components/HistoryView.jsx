import React, { useState } from 'react';
import { ArrowRight, Trophy, ShieldCheck } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function HistoryView({ userHistory = [], globalHistory = [] }) {
  const [activeTab, setActiveTab] = useState('user');
  const [filterType, setFilterType] = useState('all');

  const currentList = activeTab === 'user' ? userHistory : globalHistory;

  const filteredList = currentList.filter(item => {
    if (filterType === 'wins') return item.won;
    if (filterType === 'high') return item.multiplier >= 4.0;
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 select-none pb-24 bg-black min-h-screen">
      {/* Header Tabs: Apple Segmented Pill */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center p-1 rounded-full apple-segmented-bar">
          <button
            onClick={() => { playClick(); setActiveTab('user'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'user'
                ? 'apple-segmented-item-active'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Мои игры ({userHistory.length})
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('global'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'global'
                ? 'apple-segmented-item-active'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Все игроки
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          {['all', 'wins', 'high'].map(type => (
            <button
              key={type}
              onClick={() => { playClick(); setFilterType(type); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                filterType === type
                  ? 'bg-[#007AFF] text-white shadow-sm ring-1 ring-white/20'
                  : 'apple-pill-badge text-white/50 hover:text-white'
              }`}
            >
              {type === 'all' ? 'Все' : type === 'wins' ? 'Победы' : '>4x'}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredList.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center apple-glass rounded-[26px] border border-white/10 p-6">
          <div className="w-12 h-12 rounded-2xl apple-glass flex items-center justify-center text-white/40 mb-2.5">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white">История пуста</span>
          <span className="text-xs text-white/50 mt-1 max-w-[200px]">
            Сделайте первый апгрейд в разделе Upgrader
          </span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredList.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className={`p-3.5 rounded-[22px] transition-all apple-glass-card border ${
                entry.won
                  ? 'border-emerald-500/25'
                  : 'border-white/[0.08]'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                    entry.won
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'apple-pill-badge text-rose-300'
                  }`}>
                    x{entry.multiplier.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-white/45 font-mono">
                    Шанс: {entry.chance ? entry.chance.toFixed(1) : ((100 / entry.multiplier) * 0.95).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 font-mono">
                    {entry.time || 'Только что'}
                  </span>
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    entry.won
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {entry.won ? 'WIN' : 'LOSE'}
                  </span>
                </div>
              </div>

              {/* Middle row: Source -> Target Gift Bento */}
              <div className="flex items-center justify-between gap-2 apple-glass p-2.5 rounded-[16px] border border-white/10">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl apple-glass flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {entry.sourceImage ? (
                      <img src={entry.sourceImage} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-white truncate">
                      {entry.sourceName}
                    </span>
                    <span className="text-[10px] font-mono text-white/50">
                      {entry.sourcePrice ? entry.sourcePrice.toFixed(2) : '1.00'} TON
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-white/40 px-1">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-white truncate">
                      {entry.targetName}
                    </span>
                    <span className="text-[10px] font-mono text-[#0A84FF] font-black">
                      {entry.targetPrice ? entry.targetPrice.toFixed(2) : (entry.priceTon || 0).toFixed(2)} TON
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl apple-glass flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {entry.targetImage ? (
                      <img src={entry.targetImage} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Provably Fair Hash */}
              <div className="mt-2.5 flex items-center justify-between text-[9px] text-white/40 font-mono">
                <span className="flex items-center gap-1 text-[#0A84FF] font-bold">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  Provably Fair
                </span>
                <span>
                  Стрелка: {entry.rollDegree ? entry.rollDegree.toFixed(1) : (Math.random() * 360).toFixed(1)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
