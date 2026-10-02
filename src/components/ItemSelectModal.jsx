import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import GiftCard from './GiftCard';
import { playClick, playSelect } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function ItemSelectModal({
  isOpen,
  onClose,
  title = "Выберите подарок",
  mode = "target",
  items = [],
  selectedItemId = null,
  onSelectItem,
  sourcePrice = 0
}) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                              (item.serialNumber && item.serialNumber.toLowerCase().includes(search.toLowerCase()));
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceTon - b.priceTon;
        if (sortBy === 'price-desc') return b.priceTon - a.priceTon;
        return 0;
      });
  }, [items, search, sortBy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md max-h-[85vh] bg-[#17212b] border-t sm:border border-[#233244] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#233244] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>
            <span className="text-xs text-[#7e8d9b] font-mono">
              ({filteredItems.length})
            </span>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-[#1e2c3a] hover:bg-[#233344] flex items-center justify-center text-[#7e8d9b] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="p-3 border-b border-[#233244] space-y-2 bg-[#131b24]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#7e8d9b]" />
            <input
              type="text"
              placeholder="Поиск подарка..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#17212b] border border-[#233244] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#7e8d9b] focus:outline-none focus:border-[#229ED9]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#7e8d9b]">Сортировка:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { playClick(); setSortBy('price-asc'); }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  sortBy === 'price-asc' ? 'bg-[#229ED9] text-white' : 'text-[#7e8d9b]'
                }`}
              >
                Дешевле ↑
              </button>
              <button
                onClick={() => { playClick(); setSortBy('price-desc'); }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  sortBy === 'price-desc' ? 'bg-[#229ED9] text-white' : 'text-[#7e8d9b]'
                }`}
              >
                Дороже ↓
              </button>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="flex-1 overflow-y-auto p-3 max-h-[50vh]">
          {filteredItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-slate-300">Подарки не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredItems.map(item => {
                const isSelected = (item.instanceId || item.id) === selectedItemId;
                return (
                  <div key={item.instanceId || item.id} className="relative">
                    <GiftCard
                      gift={item}
                      isSelected={isSelected}
                      showSelectBadge={true}
                      onClick={() => {
                        playSelect();
                        haptics.selection();
                        onSelectItem(item);
                        onClose();
                      }}
                    />
                    {mode === 'target' && sourcePrice > 0 && item.priceTon > sourcePrice && (
                      <div className="absolute top-2 right-2 z-20 pointer-events-none">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#229ED9] text-white">
                          x{(item.priceTon / sourcePrice).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
