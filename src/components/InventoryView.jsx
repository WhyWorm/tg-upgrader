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
    <div className="w-full max-w-md mx-auto px-4 py-3 select-none pb-24 bg-black min-h-screen">
      {/* Bento Header Overview Card */}
      <div className="apple-glass-card rounded-[26px] p-4 mb-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
              Ваш инвентарь
            </span>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
              <span>{totalValueTon.toFixed(2)} TON</span>
              <span className="text-xs text-white/40 font-medium">
                (~${(totalValueTon * 5.25).toFixed(0)})
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{totalStars} Stars в подарках</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
              Предметов
            </span>
            <div className="text-xl font-black text-[#0A84FF] font-mono">
              {inventory.length} шт.
            </div>
          </div>
        </div>

        {/* Claim Free Daily Gift (Apple Capsule Banner) */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div className="text-xs text-white/80 font-bold flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#0A84FF]" />
            <span>Ежедневный дроп</span>
          </div>
          <button
            onClick={handleClaimFreeGift}
            disabled={isClaimingDrop}
            className="px-4 py-1.5 rounded-full apple-btn-primary text-white font-black text-xs transition-all active:scale-95"
          >
            {isClaimingDrop ? 'Открытие...' : 'Забрать'}
          </button>
        </div>
      </div>

      {/* Apple Search Capsule */}
      <div className="relative mb-3.5">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Поиск по названию или #номеру..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full apple-pill-badge bg-white/[0.06] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF] font-medium"
        />
      </div>

      {/* Grid */}
      {filteredInventory.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center apple-glass rounded-[26px] border border-white/10 p-6">
          <div className="w-12 h-12 rounded-2xl apple-glass flex items-center justify-center text-white/40 mb-2.5">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">Инвентарь пуст</h4>
          <p className="text-xs text-white/50 mt-1 max-w-[200px]">
            Заберите ежедневный дроп или пополните баланс в шапке
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredInventory.map(item => (
            <div key={item.instanceId || item.id} className="relative group flex flex-col">
              <GiftCard
                gift={item}
                onClick={() => {
                  playSelect();
                  onSelectForUpgrade(item);
                }}
              />

              <div className="mt-1.5 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    playSelect();
                    haptics.selection();
                    onSelectForUpgrade(item);
                  }}
                  className="flex-1 py-1.5 rounded-full apple-btn-primary text-white font-bold text-[11px] transition-all active:scale-95"
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
                  className="px-3 py-1.5 rounded-full apple-pill-badge text-white/50 hover:text-rose-400 text-[11px] font-mono font-bold transition-all active:scale-95"
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
