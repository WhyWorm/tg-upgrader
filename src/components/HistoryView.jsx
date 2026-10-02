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
    <div className="w-full max-w-md mx-auto px-3.5 py-3 select-none pb-20 bg-[#0e1621]">
      {/* Header Tabs */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1 bg-[#17212b] p-1 rounded-xl border border-[#233244]">
          <button
            onClick={() => { playClick(); setActiveTab('user'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'user'
                ? 'bg-[#229ED9] text-white shadow-sm'
                : 'text-[#7e8d9b] hover:text-white'
            }`}
          >
            Мои игры ({userHistory.length})
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('global'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'global'
                ? 'bg-[#229ED9] text-white shadow-sm'
                : 'text-[#7e8d9b] hover:text-white'
            }`}
          >
            Все игроки
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { playClick(); setFilterType('all'); }}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              filterType === 'all' ? 'bg-[#1e2c3a] text-white' : 'text-[#7e8d9b]'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => { playClick(); setFilterType('wins'); }}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              filterType === 'wins' ? 'bg-[#229ED9] text-white' : 'text-[#7e8d9b]'
            }`}
          >
            Победы
          </button>
          <button
            onClick={() => { playClick(); setFilterType('high'); }}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              filterType === 'high' ? 'bg-[#229ED9] text-white' : 'text-[#7e8d9b]'
            }`}
          >
            &gt;4x
          </button>
        </div>
      </div>

      {/* History Items List */}
      {filteredList.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-[#17212b] rounded-2xl border border-[#233244] p-6">
          <div className="w-12 h-12 rounded-xl bg-[#1e2c3a] flex items-center justify-center text-[#7e8d9b] mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-slate-300">История пуста</span>
          <span className="text-xs text-[#7e8d9b] mt-1">
            Сделайте первый апгрейд в разделе Upgrader
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredList.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className={`p-3 rounded-xl border transition-all ${
                entry.won
                  ? 'bg-[#182533] border-[#233244]'
                  : 'bg-[#151d27] border-[#233244]/60'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    entry.won
                      ? 'bg-[#229ED9] text-white'
                      : 'bg-[#1e2c3a] text-rose-400'
                  }`}>
                    x{entry.multiplier.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#7e8d9b] font-mono">
                    Шанс: {entry.chance ? entry.chance.toFixed(1) : ((100 / entry.multiplier) * 0.95).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#7e8d9b] font-mono">
                    {entry.time || 'Только что'}
                  </span>
                  <span className={`text-xs font-bold ${
                    entry.won ? 'text-[#53aee2]' : 'text-rose-400'
                  }`}>
                    {entry.won ? 'WIN' : 'LOSE'}
                  </span>
                </div>
              </div>

              {/* Middle row: Source -> Target Gift */}
              <div className="flex items-center justify-between gap-2 bg-[#131b24] p-2 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded bg-[#17212b] flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                    {entry.sourceImage ? (
                      <img src={entry.sourceImage} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs">🎁</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-slate-200 truncate">
                      {entry.sourceName}
                    </span>
                    <span className="text-[10px] font-mono text-[#7e8d9b]">
                      {entry.sourcePrice ? entry.sourcePrice.toFixed(2) : '1.00'} TON
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-[#7e8d9b]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-white truncate">
                      {entry.targetName}
                    </span>
                    <span className="text-[10px] font-mono text-[#229ED9] font-bold">
                      {entry.targetPrice ? entry.targetPrice.toFixed(2) : (entry.priceTon || 0).toFixed(2)} TON
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded bg-[#17212b] flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                    {entry.targetImage ? (
                      <img src={entry.targetImage} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs">⭐</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Provably Fair Hash */}
              <div className="mt-2 flex items-center justify-between text-[9px] text-[#7e8d9b] font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#229ED9]" />
                  Provably Fair
                </span>
                <span>
                  Roll: {entry.rollDegree ? entry.rollDegree.toFixed(1) : (Math.random() * 360).toFixed(1)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
