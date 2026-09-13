'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, SlidersHorizontal, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { GroceryList } from '@/lib/types';
import FoodTile from '@/components/FoodTile';
import { useToast } from '@/components/Toast';

const CAT_EMOJI: Record<string, string> = {
  vegetables: '🥬', fruits: '🍎', grains: '🌾', dairy: '🧀',
  meat: '🥩', protein: '🍳', pantry: '🫙',
};
function itemEmoji(name: string) {
  const n = name.toLowerCase();
  if (/avocado/.test(n)) return '🥑'; if (/tomato/.test(n)) return '🍅';
  if (/spinach|kale/.test(n)) return '🥬'; if (/potato/.test(n)) return '🍠';
  if (/broccoli/.test(n)) return '🥦'; if (/pepper/.test(n)) return '🫑';
  if (/berr|mango/.test(n)) return '🫐'; if (/banana/.test(n)) return '🍌';
  if (/bread/.test(n)) return '🍞'; if (/quinoa|rice|oat/.test(n)) return '🌾';
  if (/pasta|noodle/.test(n)) return '🍝'; if (/egg/.test(n)) return '🥚';
  if (/salmon/.test(n)) return '🐟'; if (/tofu|chickpea|edamame/.test(n)) return '🫘';
  if (/yogurt|milk/.test(n)) return '🥛'; if (/feta|parmesan|cheese/.test(n)) return '🧀';
  if (/coconut/.test(n)) return '🥥'; if (/oil/.test(n)) return '🫒';
  if (/honey/.test(n)) return '🍯'; return '🛒';
}

export default function Grocery() {
  const toast = useToast();
  const [list, setList] = useState<GroceryList | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<GroceryList[]>('/grocery');
      setList(data[0] ?? null);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    if (!list) return {};
    const g: Record<string, typeof list.items> = {};
    list.items
      .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
      .forEach((i) => { (g[i.category] ??= []).push(i); });
    return g;
  }, [list, query]);

  const done = list?.items.filter((i) => i.isPurchased).length ?? 0;
  const totalItems = list?.items.length ?? 0;
  const pct = totalItems ? Math.round((done / totalItems) * 100) : 0;

  async function toggle(itemId: string, current: boolean) {
    if (!list) return;
    setList({ ...list, items: list.items.map((i) => i._id === itemId ? { ...i, isPurchased: !current } : i) });
    try { await api.patch(`/grocery/${list._id}/items/${itemId}`, { isPurchased: !current }); }
    catch { load(); }
  }

  async function refresh() {
    if (!list?.mealPlanId) { toast('Generate a plan first from the Planner'); return; }
    try { await api.post('/grocery/generate', { mealPlanId: list.mealPlanId }); await load(); toast('List rebuilt from your plan 🔄'); }
    catch { toast('Could not refresh'); }
  }

  return (
    <div className="animate-fadeUp">
      <div className="px-5 pt-6">
        <div className="text-[13px] text-muted font-semibold">Auto-generated from your plan</div>
        <h1 className="text-[26px] font-extrabold tracking-tight mt-0.5 mb-3.5">This week's groceries</h1>
        <div className="flex items-center gap-2.5 bg-white border border-line rounded-2xl px-3.5 py-3 shadow-card">
          <Search size={17} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Prioritise in order for…"
            className="flex-1 text-[13.5px] outline-none bg-transparent" />
          <span className="w-6 h-6 rounded-lg bg-brand-soft grid place-items-center text-brand"><SlidersHorizontal size={13} /></span>
        </div>
      </div>

      {/* progress */}
      <div className="mx-5 mt-4">
        <div className="flex justify-between text-xs font-semibold text-muted mb-1.5">
          <span>Shopping progress</span><span><b className="text-ink">{done}</b>/{totalItems} items</span>
        </div>
        <div className="h-2 bg-line rounded-full overflow-hidden">
          <span className="block h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#F4A15E,#E85D04)' }} />
        </div>
      </div>

      {loading && <div className="text-muted text-sm text-center py-14">Loading…</div>}

      {!loading && totalItems === 0 && (
        <div className="text-center text-muted text-sm py-16 px-6">
          No grocery list yet.{' '}
          <Link href="/planner" className="text-brand font-bold">Build a plan</Link> and tap “Save plan & generate groceries”.
        </div>
      )}

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mx-5 mt-4">
          <div className="flex items-center gap-2 bg-brand-peach border border-[#F6DCC0] px-3.5 py-2.5 rounded-2xl font-bold text-sm text-[#7a4a1c] capitalize">
            <span className="text-base">{CAT_EMOJI[cat] ?? '🛒'}</span>{cat}
            <span className="ml-auto text-[11px] text-[#9a6a37]">{items.length} items</span>
          </div>
          {items.map((i) => (
            <button key={i._id} onClick={() => toggle(i._id, i.isPurchased)}
              className="w-full flex items-center gap-3 py-3 px-1.5 border-b border-line/60 text-left">
              <span className={`w-[22px] h-[22px] rounded-md border-2 grid place-items-center transition ${i.isPurchased ? 'bg-brand border-brand text-white' : 'border-muted/50'}`}>
                {i.isPurchased && <Check size={13} strokeWidth={3} />}
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[13.5px] font-bold ${i.isPurchased ? 'line-through text-muted/60' : ''}`}>{i.name}</span>
                <span className="block text-[11.5px] text-muted font-semibold">{i.quantity} {i.unit}</span>
              </span>
              <FoodTile emoji={itemEmoji(i.name)} className="w-11 h-11" size={22} rounded="rounded-xl" />
            </button>
          ))}
        </div>
      ))}

      {totalItems > 0 && (
        <div className="px-5 mt-6">
          <button onClick={refresh}
            className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-float flex items-center justify-center gap-2">
            <RefreshCw size={17} /> Refresh grocery list
          </button>
        </div>
      )}
    </div>
  );
}
