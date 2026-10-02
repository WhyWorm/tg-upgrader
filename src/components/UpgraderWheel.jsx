import React, { useEffect, useRef, useState } from 'react';
import { playTick, playWhoosh } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { ArrowLeftRight } from 'lucide-react';
import { TELEGRAM_GIFTS_CATALOG } from '../data/gifts';

export default function UpgraderWheel({
  chance = 40,
  multiplier = 2.45,
  isRolling = false,
  rollDirection = 'under',
  onToggleRollDirection,
  finalDegree = null,
  onSpinEnd,
  targetItem = null
}) {
  const [needleAngle, setNeedleAngle] = useState(0);
  const [rollingEmojiIndex, setRollingEmojiIndex] = useState(0);
  const animationRef = useRef(null);
  const lastTickAngleRef = useRef(0);
  const emojiCycleRef = useRef(null);

  const radius = 94;
  const center = 120;
  const circumference = 2 * Math.PI * radius;

  const safeChance = Math.max(0.5, Math.min(95, chance));
  const arcLength = (safeChance / 100) * circumference;
  const rotationOffset = -90 + (rollDirection === 'under' ? 0 : 360 - (safeChance * 3.6));

  useEffect(() => {
    if (!isRolling) {
      if (finalDegree !== null) {
        setNeedleAngle(finalDegree);
      }
      if (emojiCycleRef.current) {
        clearInterval(emojiCycleRef.current);
        emojiCycleRef.current = null;
      }
      return;
    }

    playWhoosh();
    haptics.impact('medium');

    const startTime = performance.now();
    const duration = 4600;
    const baseRotations = 5;
    const targetDegree = finalDegree !== null ? finalDegree : Math.random() * 360;
    const totalRotation = baseRotations * 360 + targetDegree;
    const startAngle = needleAngle % 360;

    lastTickAngleRef.current = startAngle;

    let cycleIntervalMs = 70;
    const catalogLen = TELEGRAM_GIFTS_CATALOG.length;

    emojiCycleRef.current = setInterval(() => {
      setRollingEmojiIndex(prev => (prev + 1) % catalogLen);
    }, cycleIntervalMs);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3.8);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      const currentAngle = startAngle + (totalRotation - startAngle) * eased;
      setNeedleAngle(currentAngle);

      if (progress > 0.6 && cycleIntervalMs < 160) {
        cycleIntervalMs = 160;
        if (emojiCycleRef.current) clearInterval(emojiCycleRef.current);
        emojiCycleRef.current = setInterval(() => {
          setRollingEmojiIndex(prev => (prev + 1) % catalogLen);
        }, cycleIntervalMs);
      } else if (progress > 0.85 && cycleIntervalMs < 320) {
        cycleIntervalMs = 320;
        if (emojiCycleRef.current) clearInterval(emojiCycleRef.current);
        emojiCycleRef.current = setInterval(() => {
          setRollingEmojiIndex(prev => (prev + 1) % catalogLen);
        }, cycleIntervalMs);
      }

      if (Math.abs(currentAngle - lastTickAngleRef.current) >= 16) {
        const speed = 1 - progress;
        playTick(0.8 + speed * 0.4);
        haptics.impact('light');
        lastTickAngleRef.current = currentAngle;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setNeedleAngle(targetDegree);
        if (emojiCycleRef.current) {
          clearInterval(emojiCycleRef.current);
          emojiCycleRef.current = null;
        }
        if (onSpinEnd) {
          onSpinEnd(targetDegree);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (emojiCycleRef.current) clearInterval(emojiCycleRef.current);
    };
  }, [isRolling]);

  const activeRollingGift = TELEGRAM_GIFTS_CATALOG[rollingEmojiIndex] || targetItem;

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1">
      {/* Crisp Cupertino Activity Gauge */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-full h-full">
          {/* Subtle Outer Track */}
          <circle
            cx={center}
            cy={center}
            r={radius + 8}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1.5"
          />

          {/* Background Activity Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="#1c1c1e"
            stroke="#2c2c2e"
            strokeWidth="12"
          />

          {/* Razor-Sharp Apple Blue Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#007AFF"
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform={`rotate(${rotationOffset} ${center} ${center})`}
          />

          {/* Inner Clean Center Disc */}
          <circle
            cx={center}
            cy={center}
            r={radius - 12}
            fill="#121214"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />

          {/* Top 12 o'clock needle marker */}
          <circle
            cx={center}
            cy={center - radius}
            r="3"
            fill="#ffffff"
          />
        </svg>

        {/* Sharp Needle Indicator */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `rotate(${needleAngle}deg)`,
          }}
        >
          <div className="absolute top-[17px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[15px] border-b-white" />
          <div className="w-3.5 h-3.5 rounded-full bg-white ring-2 ring-[#007AFF]" />
        </div>

        {/* Center Display: Crisp SF Pro Typography & Emoji Reel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
          {isRolling ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2c2c2e] border border-[#007AFF] flex items-center justify-center p-2.5 shadow-lg">
                <img
                  src={activeRollingGift?.image}
                  alt="rolling"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[12px] font-bold text-white mt-1.5 tracking-tight truncate max-w-[120px]">
                {activeRollingGift?.name || 'Крутим...'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {targetItem && (
                <div className="w-10 h-10 mb-0.5 flex items-center justify-center">
                  <img src={targetItem.image} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight leading-tight">
                x{multiplier.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-[#007AFF]/20 text-[#007AFF]">
                <span className="text-[11px] font-bold font-mono">
                  {safeChance.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Direction Switcher */}
      <button
        onClick={onToggleRollDirection}
        disabled={isRolling}
        className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#8e8e93] hover:text-white border border-white/[0.08] transition-colors"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-[#007AFF]" />
        <span>{rollDirection === 'under' ? 'Сектор: Слева' : 'Сектор: Справа'}</span>
      </button>
    </div>
  );
}
