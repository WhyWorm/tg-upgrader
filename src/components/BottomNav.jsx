import React from 'react';
import { Zap, Backpack, History, User } from 'lucide-react';
import { playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function BottomNav({ activeTab, onTabChange, inventoryCount = 0 }) {
  const tabs = [
    { id: 'upgrade', label: 'Upgrader', icon: Zap },
    { id: 'inventory', label: 'Инвентарь', icon: Backpack, badge: inventoryCount },
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
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none select-none">
      {/* Floating Apple Liquid Glass Dock (Ref: Image 3 macOS Tahoe / iOS 18 Dock) */}
      <nav className="pointer-events-auto w-full max-w-md rounded-[26px] apple-glass border border-white/20 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.35)] grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-[20px] transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-white/15 border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0.5px_rgba(255,255,255,0.4)]'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-[#0A84FF] stroke-[2.5] scale-110 drop-shadow-[0_0_8px_rgba(0,122,255,0.6)]'
                      : 'text-white/50 hover:text-white stroke-[1.8]'
                  }`}
                />

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#007AFF] border border-white/30 text-[9px] font-black text-white flex items-center justify-center font-mono shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight transition-colors ${
                  isActive
                    ? 'text-white font-extrabold'
                    : 'text-white/45 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
