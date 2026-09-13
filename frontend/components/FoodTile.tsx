'use client';
// Gradient food tile with emoji — a lightweight stand-in for photography.
const GRADIENTS: Record<string, [string, string]> = {
  '🥑': ['#F6D97A', '#E8A24A'], '🥗': ['#8FD07B', '#3FA06B'],
  '🍳': ['#FBC26B', '#F08A3E'], '🍣': ['#F79E7C', '#E8623C'],
  '🥣': ['#E4C9A0', '#C99C63'], '🌈': ['#9BD08A', '#4FA96E'],
  '🍝': ['#F4B96A', '#E67E3C'], '🍛': ['#F5A24E', '#D96A22'],
  '🥤': ['#E58AB5', '#B85C99'], '🥡': ['#8ECF6E', '#3D9D5C'],
};

export default function FoodTile({
  emoji, className = '', size = 44, rounded = 'rounded-2xl',
}: { emoji: string; className?: string; size?: number; rounded?: string }) {
  const [a, b] = GRADIENTS[emoji] ?? ['#FDEBD3', '#F6D9B8'];
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${rounded} ${className}`}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <span style={{ fontSize: size, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.18))' }}>
        {emoji}
      </span>
    </div>
  );
}
