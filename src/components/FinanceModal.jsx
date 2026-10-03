import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Star, Check } from 'lucide-react';
import { playCash, playClick } from '../utils/sound';
import { haptics } from '../utils/haptics';

export default function FinanceModal({
  isOpen,
  mode = 'deposit',
  onClose,
  balanceTon,
  onConfirmDeposit,
  onConfirmWithdraw
}) {
  const [amount, setAmount] = useState(10);
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDepositPreset = (val) => {
    playClick();
    setAmount(val);
  };

  const handleExecute = () => {
    if (amount <= 0) return;
    if (mode === 'withdraw' && amount > balanceTon) return;

    playCash();
    haptics.notification('success');
    setIsSuccess(true);

    if (mode === 'deposit') {
      onConfirmDeposit(Number(amount));
    } else {
      onConfirmWithdraw(Number(amount), address);
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div 
        className="w-full max-w-sm apple-glass border-t sm:border border-white/20 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* iOS Grabber Handle */}
        <div className="w-full flex items-center justify-center pb-3 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              mode === 'deposit' ? 'apple-btn-primary text-white' : 'apple-glass text-[#0A84FF] border-white/20'
            }`}>
              {mode === 'deposit' ? <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" /> : <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {mode === 'deposit' ? 'Пополнение' : 'Вывод'}
              </h3>
              <span className="text-[10px] text-white/50 font-mono font-semibold">
                Сеть: TON Network
              </span>
            </div>
          </div>

          <button
            onClick={() => { playClick(); onClose(); }}
            className="w-8 h-8 rounded-full apple-pill-badge flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full apple-btn-primary text-white flex items-center justify-center mb-3 shadow-lg">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black text-white tracking-tight">
              {mode === 'deposit' ? 'Баланс пополнен' : 'Заявка отправлена'}
            </h4>
            <p className="text-xs text-white/60 mt-1 font-mono font-medium">
              {amount} TON успешно {mode === 'deposit' ? 'зачислены' : 'отправлены'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-1.5 block">
                Сумма (TON):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={mode === 'withdraw' ? balanceTon : 500}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full apple-pill-badge bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-base font-mono font-black text-white focus:outline-none focus:border-[#007AFF] focus:bg-white/10 transition-all"
                />
                <span className="absolute right-4 top-3 text-xs text-[#0A84FF] font-mono font-black">
                  TON (~${(amount * 5.25).toFixed(0)})
                </span>
              </div>
            </div>

            {mode === 'deposit' && (
              <div className="grid grid-cols-4 gap-2">
                {[5, 15, 50, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => handleDepositPreset(val)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
                      amount === val
                        ? 'bg-[#007AFF] text-white shadow-sm ring-1 ring-white/30'
                        : 'apple-pill-badge text-white/70 hover:text-white'
                    }`}
                  >
                    +{val}
                  </button>
                ))}
              </div>
            )}

            {mode === 'withdraw' && (
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-1.5 block">
                  Адрес кошелька TON:
                </label>
                <input
                  type="text"
                  placeholder="EQC... или @username"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full apple-pill-badge bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#007AFF]"
                />
              </div>
            )}

            {mode === 'deposit' && (
              <div className="apple-glass p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Telegram Stars</span>
                    <span className="text-[10px] text-white/50">Мгновенно через Telegram</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDepositPreset(20)}
                  className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-[11px] active:scale-95 transition-all"
                >
                  Оплатить
                </button>
              </div>
            )}

            <button
              onClick={handleExecute}
              className="w-full h-12 rounded-[18px] apple-btn-primary text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(0,122,255,0.45)]"
            >
              {mode === 'deposit' ? `ПОПОЛНИТЬ НА ${amount} TON` : `ВЫВЕСТИ ${amount} TON`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
