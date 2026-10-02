import React from 'react';

export default function WeaponSvg({ type, color1 = '#229ED9', color2 = '#38b5f2', rarity = 'covert', className = "w-full h-full" }) {
  const gradId = `grad-${type}-${color1.replace('#', '')}-${color2.replace('#', '')}`;

  if (type === 'knife_karambit') {
    return (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Curved Claw Blade */}
        <path
          d="M 135 25 C 110 20 70 35 45 75 C 65 65 95 62 115 50 C 130 42 140 32 135 25 Z"
          fill={`url(#${gradId})`}
          filter={`url(#glow-${gradId})`}
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
        {/* Blade Highlight Edge */}
        <path
          d="M 135 25 C 112 28 85 45 45 75"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Inner Blade Pattern */}
        <path d="M 105 38 L 80 52 M 115 44 L 95 58" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* Karambit Ring Handle */}
        <path
          d="M 45 75 C 38 85 22 85 18 75 C 14 65 24 55 35 60 L 55 58"
          fill="#1b2432"
          stroke={color1}
          strokeWidth="2"
        />
        <circle cx="27" cy="74" r="8" fill="#0d131c" stroke={color1} strokeWidth="2.5" />
        {/* Grip Finger Grooves */}
        <path d="M 36 62 Q 42 68 46 64 Q 52 70 56 66" stroke="#2a384e" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'knife_butterfly') {
    return (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Butterfly Blade */}
        <path
          d="M 50 48 L 135 32 C 142 34 140 38 132 42 L 52 56 Z"
          fill={`url(#${gradId})`}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        {/* Blade Fuller & Hole */}
        <line x1="65" y1="46" x2="115" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
        <circle cx="120" cy="37" r="2" fill="#0d131c" />
        {/* Pivot Pins */}
        <circle cx="48" cy="46" r="3.5" fill="#3a4b63" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="50" cy="56" r="3.5" fill="#3a4b63" stroke="#ffffff" strokeWidth="0.8" />
        {/* Handles Split */}
        <path d="M 46 45 L 14 36 C 10 35 8 38 10 41 L 44 50" fill="#182333" stroke={color1} strokeWidth="1.5" />
        <path d="M 48 57 L 16 68 C 12 70 10 67 12 63 L 46 53" fill="#182333" stroke={color2} strokeWidth="1.5" />
        {/* Handle Cutouts */}
        <circle cx="25" cy="40" r="1.8" fill="#0d131c" />
        <circle cx="34" cy="43" r="1.8" fill="#0d131c" />
        <circle cx="26" cy="63" r="1.8" fill="#0d131c" />
        <circle cx="35" cy="60" r="1.8" fill="#0d131c" />
      </svg>
    );
  }

  if (type === 'sniper') {
    return (
      <svg viewBox="0 0 170 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Long Barrel & Muzzle */}
        <rect x="75" y="32" width="75" height="4" fill="#243042" rx="1" />
        <rect x="150" y="30" width="12" height="8" fill="#3a4b63" rx="1.5" />
        {/* Large Scope */}
        <rect x="58" y="21" width="38" height="6" fill="#161f2c" stroke={color1} strokeWidth="1" rx="2" />
        <rect x="52" y="20" width="8" height="8" fill="#202c3e" rx="1" />
        <rect x="94" y="20" width="8" height="8" fill="#202c3e" rx="1" />
        <line x1="66" y1="27" x2="66" y2="33" stroke="#485c7b" strokeWidth="2" />
        <line x1="86" y1="27" x2="86" y2="33" stroke="#485c7b" strokeWidth="2" />
        {/* Main Body (AWP Stock & Receiver) with Custom Skin Color */}
        <path
          d="M 12 48 L 35 44 L 60 34 L 115 34 L 110 42 L 78 44 L 65 52 L 48 54 L 38 48 L 14 54 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />
        {/* Thumbhole / Grip stock */}
        <path d="M 22 47 Q 32 46 36 50 Q 28 53 22 47 Z" fill="#0d131c" />
        {/* Magazine */}
        <path d="M 68 44 L 72 58 L 62 58 L 60 44 Z" fill="#141c27" stroke={color1} strokeWidth="1" />
        {/* Bolt Handle & Detail */}
        <circle cx="56" cy="34" r="2.5" fill="#f8fafc" />
        <path d="M 68 38 L 105 38" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (type === 'rifle') {
    return (
      <svg viewBox="0 0 160 85" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Barrel & Front Sight */}
        <rect x="90" y="36" width="55" height="3.5" fill="#2d3b4e" rx="1" />
        <path d="M 138 34 L 142 34 L 143 38 L 138 38 Z" fill="#4d6282" />
        <rect x="145" y="35" width="6" height="5" fill="#1b2432" />
        {/* Gas Tube / Handguard with Skin */}
        <path
          d="M 85 34 L 125 34 L 122 42 L 85 43 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
        />
        {/* Receiver Body */}
        <path
          d="M 50 33 L 85 33 L 85 44 L 52 44 Z"
          fill={`url(#${gradId})`}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        {/* Wooden / Synthetic Stock */}
        <path
          d="M 10 44 L 50 37 L 50 43 L 18 53 L 10 51 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />
        {/* Curved Banana Magazine */}
        <path
          d="M 65 44 C 70 55 64 68 54 74 L 46 72 C 55 65 58 54 55 44 Z"
          fill="#16202c"
          stroke={color1}
          strokeWidth="1.5"
        />
        {/* Pistol Grip */}
        <path
          d="M 46 44 L 38 64 L 45 66 L 53 44 Z"
          fill="#1c2635"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        {/* Dust Cover accent */}
        <path d="M 54 36 L 80 36" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
      </svg>
    );
  }

  if (type === 'pistol') {
    return (
      <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Slide (Top Part) */}
        <path
          d="M 38 28 L 115 28 L 115 44 L 38 44 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          rx="1"
        />
        {/* Slide Serrations */}
        <line x1="44" y1="31" x2="44" y2="40" stroke="#0d131c" strokeWidth="1.5" />
        <line x1="48" y1="31" x2="48" y2="40" stroke="#0d131c" strokeWidth="1.5" />
        <line x1="52" y1="31" x2="52" y2="40" stroke="#0d131c" strokeWidth="1.5" />
        {/* Front & Rear Sights */}
        <rect x="40" y="25" width="4" height="3" fill="#ffffff" />
        <rect x="110" y="25" width="3" height="3" fill="#ffffff" />
        {/* Frame & Trigger Guard */}
        <path
          d="M 45 44 L 105 44 L 100 50 L 76 50 C 76 58 68 62 60 56 L 60 50 L 52 50 Z"
          fill="#1b2533"
        />
        {/* Trigger */}
        <path d="M 68 51 C 65 55 68 59 70 59" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Ergonomic Handle / Grip */}
        <path
          d="M 50 48 L 40 76 C 39 79 43 81 48 80 L 62 76 L 62 50 Z"
          fill={`url(#${gradId})`}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Grip Texture */}
        <rect x="46" y="55" width="10" height="18" rx="2" fill="#0d131c" fillOpacity="0.4" />
      </svg>
    );
  }

  // Fallback: Gloves or Tactical Blade
  return (
    <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      {/* Tactical Dagger */}
      <path
        d="M 115 32 L 60 42 L 56 47 L 18 47 L 18 41 L 56 41 L 60 36 Z"
        fill={`url(#${gradId})`}
        stroke="#ffffff"
        strokeWidth="1"
      />
      <rect x="18" y="38" width="38" height="12" rx="2" fill="#1e293b" stroke={color1} strokeWidth="1" />
      <circle cx="28" cy="44" r="2.5" fill="#38b5f2" />
      <circle cx="42" cy="44" r="2.5" fill="#38b5f2" />
    </svg>
  );
}
