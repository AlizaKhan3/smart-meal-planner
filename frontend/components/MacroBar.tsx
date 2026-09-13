'use client';
export default function MacroBar({
  label, value, goal, color,
}: { label: string; value: number; goal: number; color: string }) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div className="flex items-center gap-2 text-[11.5px] font-bold mb-2.5">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="w-14">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
        <span
          className="block h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-muted w-16 text-right">{Math.round(value)}/{goal}g</span>
    </div>
  );
}
