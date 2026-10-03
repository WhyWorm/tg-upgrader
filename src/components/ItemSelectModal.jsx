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

  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl select-none ${
        isClosing ? 'apple-modal-backdrop-out' : 'apple-modal-backdrop-in'
      }`}
      onClick={() => handleDismiss(onClose)}
    >
      <div 
        className={`w-full max-w-md max-h-[88vh] apple-glass border-t sm:border border-white/20 rounded-t-[32px] sm:rounded-[32px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden ${
          isClosing ? 'apple-sheet-out' : 'apple-sheet-in'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* iOS Grabber Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-tight">
              {title}
            </h3>
            <span className="text-xs font-mono font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
              {filteredItems.length}
            </span>
          </div>

          <button
            onClick={() => {
              playClick();
              handleDismiss(onClose);
            }}
            className="w-8 h-8 rounded-full apple-pill-badge flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Search & Sort Controls (Apple Settings Style) */}
        <div className="p-4 border-b border-white/[0.08] space-y-3 bg-black/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Поиск по названию или #номеру..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full apple-pill-badge bg-white/[0.06] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF] focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/50">
              Сортировка:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-full apple-segmented-bar">
              <button
                onClick={() => { playClick(); setSortBy('price-asc'); }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  sortBy === 'price-asc'
                    ? 'apple-segmented-item-active'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Дешевле ↑
              </button>
              <button
                onClick={() => { playClick(); setSortBy('price-desc'); }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  sortBy === 'price-desc'
                    ? 'apple-segmented-item-active'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Дороже ↓
              </button>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[58vh]">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-xs font-semibold text-white/40">
              Ничего не найдено
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map(item => (
                <GiftCard
                  key={item.id}
                  gift={item}
                  isSelected={item.id === selectedItemId}
                  showSelectBadge={true}
                  onClick={() => {
                    playSelect();
                    haptics.selection();
                    handleDismiss(() => onSelectItem(item));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
