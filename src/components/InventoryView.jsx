import React, { useState, useMemo } from 'react';
import GiftCard from './GiftCard';
import { TELEGRAM_GIFTS_CATALOG } from '../data/gifts';
import { Search, Gift, PackageOpen, Sparkles, Star } from 'lucide-react';
import { playCash, playClick, playSelect, playWin } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function InventoryView({
  inventory = [],
  onSelectForUpgrade,
  onQuickSell,
  onAddDailyDrop
}) {
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('price-desc');
  const [isClaimingDrop, setIsClaimingDrop] = useState(false);

  const totalValueTon = useMemo(() => {
    return inventory.reduce((sum, item) => sum + (item.priceTon || 0), 0);
  }, [inventory]);

  const totalStars = useMemo(() => {
    return inventory.reduce((sum, item) => sum + (item.stars || 0), 0);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                              (item.serialNumber && item.serialNumber.toLowerCase().includes(search.toLowerCase()));
        const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
        return matchesSearch && matchesRarity;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.priceTon - a.priceTon;
        if (sortBy === 'price-asc') return a.priceTon - b.priceTon;
        return 0;
      });
  }, [inventory, search, selectedRarity, sortBy]);

  const handleClaimFreeGift = () => {
    if (isClaimingDrop) return;
    setIsClaimingDrop(true);
    playClick();
    haptics.impact('medium');

    setTimeout(() => {
      const pool = TELEGRAM_GIFTS_CATALOG.filter(it => it.priceTon <= 12.0);
      const randomGift = pool[Math.floor(Math.random() * pool.length)];
      onAddDailyDrop(randomGift);
      playWin();
      haptics.notification('success');
      setIsClaimingDrop(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-3 select-none pb-20 bg-[#0e1621]">
      {/* Inventory Header Card */}
      <div className="bg-[#17212b] rounded-2xl p-3.5 border border-[#233244] mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#7e8d9b]">
              Ваш инвентарь
            </span>
            <div className="text-xl font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
              <span>{totalValueTon.toFixed(2)} TON</span>
              <span className="text-xs text-[#7e8d9b] font-normal">
                (~${(totalValueTon * 5.25).toFixed(0)})
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{totalStars} Stars в подарках</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#7e8d9b]">
              Предметов
            </span>
            <div className="text-lg font-bold text-[#229ED9] font-mono">
              {inventory.length} шт.
            </div>
          </div>
        </div>

        {/* Claim Free Daily Gift */}
        <div className="mt-3 pt-3 border-t border-[#233244] flex items-center justify-between gap-2">
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#53aee2]" />
            <span>Ежедневный подарок</span>
          </div>
          <button
            onClick={handleClaimFreeGift}
            disabled={isClaimingDrop}
            className="px-3 py-1.5 rounded-lg bg-[#229ED9] hover:bg-[#2aabeb] text-white font-semibold text-xs transition-colors"
          >
            {isClaimingDrop ? 'Открытие...' : 'Забрать'}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#7e8d9b]" />
          <input
            type="text"
            placeholder="Поиск по подаркам..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#17212b] border border-[#233244] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#7e8d9b] focus:outline-none focus:border-[#229ED9]"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredInventory.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-[#17212b] rounded-2xl border border-[#233244] p-6">
          <div className="w-12 h-12 rounded-xl bg-[#1e2c3a] flex items-center justify-center text-[#7e8d9b] mb-2">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Инвентарь пуст</h4>
          <p className="text-xs text-[#7e8d9b] mt-1">
            Заберите ежедневный подарок или пополните баланс
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {filteredInventory.map(item => (
            <div key={item.instanceId || item.id} className="relative group">
              <GiftCard
                gift={item}
                onClick={() => {
                  playSelect();
                  onSelectForUpgrade(item);
                }}
              />

              <div className="mt-1 flex items-center gap-1">
                <button
                  onClick={() => {
                    playSelect();
                    haptics.selection();
                    onSelectForUpgrade(item);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-[#229ED9] hover:bg-[#2aabeb] text-white font-semibold text-[11px] transition-colors"
                >
                  В апгрейдер
                </button>

                <button
                  onClick={() => {
                    playCash();
                    haptics.impact('light');
                    onQuickSell(item);
                  }}
                  title="Продать подарок"
                  className="px-2.5 py-1.5 rounded-lg bg-[#1e2c3a] hover:bg-rose-900/40 text-[#7e8d9b] hover:text-rose-300 text-[11px] font-mono transition-colors"
                >
                  Продать
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
