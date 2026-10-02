import React from 'react';
import { Zap, Backpack, History, User } from 'lucide-react';
import { playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function BottomNav({ activeTab, onTabChange, inventoryCount = 0 }) {
  const tabs = [
    { id: 'upgrade', label: 'Upgrader', icon: Zap },
    { id: 'inventory', label: 'Подарки', icon: Backpack, badge: inventoryCount },
    { id: 'history', label: 'История', icon: History },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  const handleSelect = (tabId) => {
    if (tabId === activeTab) return;
    playClick();
    haptics.selection();
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#1c1c1e]/90 backdrop-blur-2xl border-t border-white/[0.08] pb-safe select-none">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="relative flex flex-col items-center justify-center py-0.5 transition-colors active:scale-95"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-[#007AFF] stroke-[2.4]'
                      : 'text-[#8e8e93] hover:text-white stroke-[1.8]'
                  }`}
                />

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#007AFF] text-[10px] font-bold text-white flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 tracking-tight transition-colors ${
                  isActive
                    ? 'text-[#007AFF] font-semibold'
                    : 'text-[#8e8e93]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
