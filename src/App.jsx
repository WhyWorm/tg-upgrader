import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LiveDrops from './components/LiveDrops';
import UpgraderArena from './components/UpgraderArena';
import InventoryView from './components/InventoryView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import ItemSelectModal from './components/ItemSelectModal';
import ResultModal from './components/ResultModal';
import FinanceModal from './components/FinanceModal';

import { 
  TELEGRAM_GIFTS_CATALOG, 
  DEFAULT_PLAYER_GIFTS_INVENTORY, 
  RECENT_GIFTS_DROPS 
} from './data/gifts';
import { isSoundEnabled } from './utils/sound';

export default function App() {
  // Telegram WebApp initialization
  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#0c1017');
        window.Telegram.WebApp.setBackgroundColor('#0c1017');
      }
    } catch (e) {}
  }, []);

  // Telegram User Data
  const [user, setUser] = useState(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    return {
      username: tgUser?.username ? `@${tgUser.username}` : '@durov_trader',
      firstName: tgUser?.first_name || 'Trader',
      tgId: tgUser?.id ? String(tgUser.id) : '894129482',
      avatar: tgUser?.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
  });

  // State
  const [activeTab, setActiveTab] = useState('upgrade');
  const [currency, setCurrency] = useState('TON');
  const [balanceTon, setBalanceTon] = useState(25.00);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Inventory & Catalog
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_upgrader_gifts_inv');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PLAYER_GIFTS_INVENTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tg_upgrader_gifts_inv', JSON.stringify(inventory));
    } catch (e) {}
  }, [inventory]);

  // Selected Upgrader items
  const [sourceItem, setSourceItem] = useState(DEFAULT_PLAYER_GIFTS_INVENTORY[0]);
  const [targetItem, setTargetItem] = useState(TELEGRAM_GIFTS_CATALOG[14]); // Cyber Duck (30.0 TON)
  const [useDirectBalance, setUseDirectBalance] = useState(false);
  const [betAmountTon, setBetAmountTon] = useState(1.0);

  // Upgrader state
  const [isRolling, setIsRolling] = useState(false);
  const [currentRollMeta, setCurrentRollMeta] = useState(null);
  const [finalDegree, setFinalDegree] = useState(null);

  // Result modal state
  const [resultModalData, setResultModalData] = useState(null);

  // Finance modal (Deposit / Withdraw)
  const [financeModal, setFinanceModal] = useState({ isOpen: false, mode: 'deposit' });

  // Gift select modals
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalGames: 18,
    wins: 8,
    losses: 10,
    totalWagered: 62.5,
    totalWon: 98.4,
    bestMultiplier: 15.0,
  });

  // History
  const [userHistory, setUserHistory] = useState([
    {
      id: 'h-init-1',
      sourceName: 'Sunglasses #0142',
      sourcePrice: 3.5,
      targetName: 'Cyber Duck #0089',
      targetPrice: 30.0,
      multiplier: 8.57,
      chance: 11.1,
      won: true,
      time: '15м назад',
      rollDegree: 28.4,
      sourceImage: TELEGRAM_GIFTS_CATALOG[4]?.image,
      targetImage: TELEGRAM_GIFTS_CATALOG[14]?.image,
    },
    {
      id: 'h-init-2',
      sourceName: 'Brick NFT #0812',
      sourcePrice: 7.5,
      targetName: 'Durov\'s Cap #0007',
      targetPrice: 112.5,
      multiplier: 15.0,
      chance: 6.3,
      won: false,
      time: '32м назад',
      rollDegree: 198.6,
      sourceImage: TELEGRAM_GIFTS_CATALOG[9]?.image,
      targetImage: TELEGRAM_GIFTS_CATALOG[22]?.image,
    }
  ]);

  const [latestDrop, setLatestDrop] = useState(null);

  // Execute Upgrade
  const handleExecuteUpgrade = ({ sourceValue, targetValue, multiplier, chance, rollDirection }) => {
    if (isRolling) return;

    if (useDirectBalance) {
      if (balanceTon < sourceValue) {
        setFinanceModal({ isOpen: true, mode: 'deposit' });
        return;
      }
      setBalanceTon(prev => prev - sourceValue);
    }

    const randomDegree = Math.random() * 360;
    const winArcDegrees = (chance / 100) * 360;

    let won = false;
    let winArcDescription = '';

    if (rollDirection === 'under') {
      won = randomDegree <= winArcDegrees;
      winArcDescription = `0.0° — ${winArcDegrees.toFixed(1)}°`;
    } else {
      const winStart = 360 - winArcDegrees;
      won = randomDegree >= winStart;
      winArcDescription = `${winStart.toFixed(1)}° — 360.0°`;
    }

    const rollMeta = {
      sourceItem: useDirectBalance ? { name: `${sourceValue.toFixed(2)} TON`, priceTon: sourceValue } : sourceItem,
      targetItem,
      sourceValue,
      targetValue,
      multiplier,
      chance,
      rollDirection,
      finalDegree: randomDegree,
      won,
      winArcDescription,
    };

    setCurrentRollMeta(rollMeta);
    setFinalDegree(randomDegree);
    setIsRolling(true);
  };

  // When wheel stops
  const handleSpinEnd = (stoppedDegree) => {
    if (!currentRollMeta) return;

    const { won, sourceItem: usedSource, targetItem: targetWon, multiplier, chance, sourceValue, winArcDescription } = currentRollMeta;

    if (won) {
      const newItem = {
        ...targetWon,
        instanceId: 'won-gift-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      };

      if (!useDirectBalance && sourceItem) {
        setInventory(prev => [newItem, ...prev.filter(it => (it.instanceId || it.id) !== (sourceItem.instanceId || sourceItem.id))]);
        setSourceItem(newItem);
      } else {
        setInventory(prev => [newItem, ...prev]);
      }
    } else {
      if (!useDirectBalance && sourceItem) {
        setInventory(prev => {
          const remaining = prev.filter(it => (it.instanceId || it.id) !== (sourceItem.instanceId || sourceItem.id));
          setSourceItem(remaining.length > 0 ? remaining[0] : null);
          return remaining;
        });
      }
    }

    setStats(prev => ({
      totalGames: prev.totalGames + 1,
      wins: won ? prev.wins + 1 : prev.wins,
      losses: won ? prev.losses : prev.losses + 1,
      totalWagered: prev.totalWagered + sourceValue,
      totalWon: won ? prev.totalWon + (targetWon.priceTon - sourceValue) : prev.totalWon,
      bestMultiplier: won && multiplier > prev.bestMultiplier ? multiplier : prev.bestMultiplier,
    }));

    const historyEntry = {
      id: 'h-' + Date.now(),
      sourceName: usedSource?.name || 'Ставка TON',
      sourcePrice: sourceValue,
      targetName: targetWon.name,
      targetPrice: targetWon.priceTon,
      multiplier,
      chance,
      won,
      time: 'Только что',
      rollDegree: stoppedDegree,
      sourceImage: usedSource?.image,
      targetImage: targetWon.image,
    };

    setUserHistory(prev => [historyEntry, ...prev]);

    setLatestDrop({
      id: 'drop-' + Date.now(),
      user: user.username.replace('@', ''),
      targetName: targetWon.name,
      multiplier,
      won,
      priceTon: targetWon.priceTon,
      time: 'Только что',
      rarity: targetWon.rarity,
      image: targetWon.image,
    });

    setResultModalData({
      won,
      sourceItem: usedSource,
      targetItem: targetWon,
      multiplier,
      chance,
      rollDegree: stoppedDegree,
      winArc: winArcDescription,
    });

    setIsRolling(false);
  };

  const handleQuickSell = (itemToSell) => {
    const saleAmount = itemToSell.priceTon * 0.95;
    setBalanceTon(prev => prev + saleAmount);
    setInventory(prev => prev.filter(it => (it.instanceId || it.id) !== (itemToSell.instanceId || itemToSell.id)));
    if ((sourceItem?.instanceId || sourceItem?.id) === (itemToSell.instanceId || itemToSell.id)) {
      setSourceItem(null);
    }
    setResultModalData(null);
  };

  const handleAddDailyDrop = (newItem) => {
    const itemWithId = {
      ...newItem,
      instanceId: 'drop-' + Date.now(),
    };
    setInventory(prev => [itemWithId, ...prev]);
    if (!sourceItem) {
      setSourceItem(itemWithId);
    }
  };

  const handleInventoryQuickSell = (item) => {
    const saleAmount = item.priceTon * 0.95;
    setBalanceTon(prev => prev + saleAmount);
    setInventory(prev => prev.filter(it => (it.instanceId || it.id) !== (item.instanceId || item.id)));
    if ((sourceItem?.instanceId || sourceItem?.id) === (item.instanceId || item.id)) {
      setSourceItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Top Header */}
      <Header
        user={user}
        balanceTon={balanceTon}
        currency={currency}
        setCurrency={setCurrency}
        onOpenDeposit={() => setFinanceModal({ isOpen: true, mode: 'deposit' })}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Live Drops Ticker */}
      <LiveDrops latestDrop={latestDrop} />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'upgrade' && (
          <UpgraderArena
            sourceItem={sourceItem}
            targetItem={targetItem}
            onOpenSourceSelect={() => setSourceModalOpen(true)}
            onOpenTargetSelect={() => setTargetModalOpen(true)}
            onClearSource={() => setSourceItem(null)}
            onSelectTargetItem={setTargetItem}
            catalog={TELEGRAM_GIFTS_CATALOG}
            onExecuteUpgrade={handleExecuteUpgrade}
            isRolling={isRolling}
            finalDegree={finalDegree}
            onSpinEnd={handleSpinEnd}
            balanceTon={balanceTon}
            useDirectBalance={useDirectBalance}
            setUseDirectBalance={setUseDirectBalance}
            betAmountTon={betAmountTon}
            setBetAmountTon={setBetAmountTon}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            inventory={inventory}
            onSelectForUpgrade={(item) => {
              setSourceItem(item);
              setUseDirectBalance(false);
              setActiveTab('upgrade');
            }}
            onQuickSell={handleInventoryQuickSell}
            onAddDailyDrop={handleAddDailyDrop}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            userHistory={userHistory}
            globalHistory={RECENT_GIFTS_DROPS}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            balanceTon={balanceTon}
            stats={stats}
            onOpenDeposit={() => setFinanceModal({ isOpen: true, mode: 'deposit' })}
            onOpenWithdraw={() => setFinanceModal({ isOpen: true, mode: 'withdraw' })}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inventoryCount={inventory.length}
      />

      {/* Modal: Pick Source Gift */}
      <ItemSelectModal
        isOpen={sourceModalOpen}
        onClose={() => setSourceModalOpen(false)}
        title="Ваши Telegram подарки"
        mode="source"
        items={inventory}
        selectedItemId={sourceItem?.instanceId || sourceItem?.id}
        onSelectItem={(item) => {
          setSourceItem(item);
          setUseDirectBalance(false);
        }}
      />

      {/* Modal: Pick Target Gift */}
      <ItemSelectModal
        isOpen={targetModalOpen}
        onClose={() => setTargetModalOpen(false)}
        title="Каталог Telegram NFT подарков"
        mode="target"
        items={TELEGRAM_GIFTS_CATALOG}
        selectedItemId={targetItem?.id}
        sourcePrice={sourceItem ? sourceItem.priceTon : betAmountTon}
        onSelectItem={(item) => setTargetItem(item)}
      />

      {/* Modal: Result Screen */}
      {resultModalData && (
        <ResultModal
          isOpen={!!resultModalData}
          won={resultModalData.won}
          sourceItem={resultModalData.sourceItem}
          targetItem={resultModalData.targetItem}
          multiplier={resultModalData.multiplier}
          chance={resultModalData.chance}
          rollDegree={resultModalData.rollDegree}
          winArc={resultModalData.winArc}
          onClose={() => setResultModalData(null)}
          onQuickSell={handleQuickSell}
          onTryAgain={() => setResultModalData(null)}
        />
      )}

      {/* Modal: Finance (Deposit / Withdraw) */}
      <FinanceModal
        isOpen={financeModal.isOpen}
        mode={financeModal.mode}
        onClose={() => setFinanceModal(prev => ({ ...prev, isOpen: false }))}
        balanceTon={balanceTon}
        onConfirmDeposit={(amount) => {
          setBalanceTon(prev => prev + amount);
        }}
        onConfirmWithdraw={(amount) => {
          setBalanceTon(prev => Math.max(0, prev - amount));
        }}
      />
    </div>
  );
}
