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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#17212b] border-t sm:border border-[#233244] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#233244]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              mode === 'deposit' ? 'bg-[#229ED9]/20 text-[#229ED9]' : 'bg-[#1e2c3a] text-[#53aee2]'
            }`}>
              {mode === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {mode === 'deposit' ? 'Пополнение баланса' : 'Вывод средств'}
              </h3>
              <span className="text-[10px] text-[#7e8d9b] font-mono">
                Сеть: TON
              </span>
            </div>
          </div>

          <button
            onClick={() => { playClick(); onClose(); }}
            className="w-7 h-7 rounded-lg bg-[#1e2c3a] hover:bg-[#233344] flex items-center justify-center text-[#7e8d9b] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-base font-semibold text-white">
              {mode === 'deposit' ? 'Баланс пополнен' : 'Заявка отправлена'}
            </h4>
            <p className="text-xs text-[#7e8d9b] mt-1">
              {amount} TON успешно {mode === 'deposit' ? 'зачислены' : 'отправлены'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-[11px] text-[#7e8d9b] mb-1 block">
                Сумма (TON):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={mode === 'withdraw' ? balanceTon : 500}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-[#131b24] border border-[#233244] rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#229ED9]"
                />
                <span className="absolute right-3 top-2 text-xs text-[#229ED9] font-mono font-bold">
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
                    className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      amount === val
                        ? 'bg-[#229ED9] text-white'
                        : 'bg-[#1e2c3a] text-slate-300 hover:text-white'
                    }`}
                  >
                    +{val}
                  </button>
                ))}
              </div>
            )}

            {mode === 'withdraw' && (
              <div>
                <label className="text-[11px] text-[#7e8d9b] mb-1 block">
                  Адрес TON:
                </label>
                <input
                  type="text"
                  placeholder="EQC... или @wallet"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-[#131b24] border border-[#233244] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#7e8d9b] focus:outline-none focus:border-[#229ED9]"
                />
              </div>
            )}

            {mode === 'deposit' && (
              <div className="bg-[#1e2c3a] p-2.5 rounded-xl border border-[#233244] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Telegram Stars</span>
                    <span className="text-[10px] text-[#7e8d9b]">Быстрая оплата в Telegram</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDepositPreset(20)}
                  className="px-2.5 py-1 rounded bg-[#229ED9]/20 text-[#53aee2] font-semibold text-[10px]"
                >
                  Оплатить
                </button>
              </div>
            )}

            <button
              onClick={handleExecute}
              className="w-full py-3 rounded-xl bg-[#229ED9] hover:bg-[#2aabeb] text-white font-bold text-xs uppercase tracking-wider transition-colors active:scale-[0.98]"
            >
              {mode === 'deposit' ? `Пополнить на ${amount} TON` : `Вывести ${amount} TON`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
