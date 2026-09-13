'use client';
import { useEffect, useState } from 'react';

export default function CalorieRing({
  consumed, target, size = 112,
}: { consumed: number; target: number; size?: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, target ? consumed / target : 0);
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct)), 150);
    return () => clearTimeout(t);
  }, [circ, pct]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F2F5" strokeWidth="12" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ring)" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)' }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4A15E" />
            <stop offset="1" stopColor="#E85D04" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold tracking-tight leading-none">
          {consumed.toLocaleString()}
        </div>
        <div className="text-[10px] font-bold text-muted mt-1">/ {target.toLocaleString()} KCAL</div>
      </div>
    </div>
  );
}
