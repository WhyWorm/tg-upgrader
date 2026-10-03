import React, { useEffect, useRef, useState } from 'react';
import { playTick, playWhoosh } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { ArrowLeftRight } from 'lucide-react';

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
  const needleRef = useRef(null);
  const currentAngleRef = useRef(0);
  const animationRef = useRef(null);
  const lastTickTimeRef = useRef(0);

  const radius = 96;
  const center = 120;
  const circumference = 2 * Math.PI * radius;

  const safeChance = Math.max(0.5, Math.min(95, chance));
  const arcLength = (safeChance / 100) * circumference;
  const rotationOffset = -90 + (rollDirection === 'under' ? 0 : 360 - (safeChance * 3.6));

  // Initialize needle position
  useEffect(() => {
    if (!isRolling && needleRef.current) {
      const angle = finalDegree !== null ? finalDegree : currentAngleRef.current;
      needleRef.current.style.transform = `rotate(${angle}deg)`;
      currentAngleRef.current = angle;
    }
  }, [finalDegree, isRolling]);

  useEffect(() => {
    if (!isRolling) return;

    playWhoosh();
    haptics.impact('medium');

    const startTime = performance.now();
    const duration = 4400; // 4.4s smooth physics
    const baseRotations = 5;
    const targetDegree = finalDegree !== null ? finalDegree : Math.random() * 360;
    const totalRotation = baseRotations * 360 + targetDegree;
    const startAngle = currentAngleRef.current % 360;

    // Direct GPU quartic ease-out for ultra-smooth decel
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);

      const currentAngle = startAngle + (totalRotation - startAngle) * eased;
      currentAngleRef.current = currentAngle;

      // Update needle directly via GPU transform (0 React re-renders)
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }

      // Throttled audio tick (max once every 110ms to prevent audio-thread locks)
      if (currentTime - lastTickTimeRef.current >= 110 && progress < 0.95) {
        lastTickTimeRef.current = currentTime;
        playTick(0.9 + (1 - progress) * 0.3);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        currentAngleRef.current = targetDegree;
        if (needleRef.current) {
          needleRef.current.style.transform = `rotate(${targetDegree}deg)`;
        }
        if (onSpinEnd) {
          onSpinEnd(targetDegree);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRolling]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2 transform-gpu">
      {/* Apple Activity Gauge Ring Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Zero-cost GPU radial aura */}
        <div className="absolute inset-4 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(0,122,255,0.12)_0%,transparent_70%)]" />

        <svg viewBox="0 0 240 240" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="appleWheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>
          </defs>

          {/* Outer Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + 12}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Recessed Activity Track Groove */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="rgba(14, 14, 18, 0.85)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
          />

          {/* Electric Apple Blue Activity Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#appleWheelGradient)"
            strokeWidth="14"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform={`rotate(${rotationOffset} ${center} ${center})`}
          />

          {/* Inner Disc */}
          <circle
            cx={center}
            cy={center}
            r={radius - 14}
            fill="rgba(18, 18, 22, 0.95)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />

          {/* Top 12 o'clock needle marker */}
          <circle
            cx={center}
            cy={center - radius}
            r="3.5"
            fill="#ffffff"
            stroke="#007AFF"
            strokeWidth="2"
          />
        </svg>

        {/* Direct GPU Needle Layer (0 React re-renders during spin) */}
        <div
          ref={needleRef}
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center transform-gpu will-change-transform"
          style={{ transform: `rotate(${currentAngleRef.current}deg)` }}
        >
          <div className="absolute top-[13px] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#00F0FF,0_0_2px_#ffffff] ring-2 ring-[#007AFF]" />
        </div>

        {/* Center Display: Pure Apple Minimalist Multiplier & Chance */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none text-center p-4">
          <div className="flex flex-col items-center justify-center">
            {/* Multiplier in Apple Display Font */}
            <div className="text-4xl font-black text-white font-mono tracking-tight leading-none">
              x{multiplier.toFixed(2)}
            </div>

            {/* Chance Capsule */}
            <div className="flex items-center gap-1.5 mt-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#007AFF]/25 to-cyan-500/20 border border-[#007AFF]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="text-xs font-black font-mono text-cyan-200 tracking-tight">
                {safeChance.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Direction Capsule */}
      <button
        onClick={onToggleRollDirection}
        disabled={isRolling}
        className="mt-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold apple-pill-badge hover:bg-white/15 text-white/70 hover:text-white transition-all active:scale-95"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-[#0A84FF]" />
        <span>{rollDirection === 'under' ? 'Сектор: 0.00 → ' + safeChance.toFixed(1) : 'Сектор: ' + (100 - safeChance).toFixed(1) + ' → 100.0'}</span>
      </button>
    </div>
  );
}
