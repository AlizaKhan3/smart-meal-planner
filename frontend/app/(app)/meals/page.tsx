'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, Flame, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Meal } from '@/lib/types';
import FoodTile from '@/components/FoodTile';
import { useToast } from '@/components/Toast';

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function Meals() {
  const toast = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filter, setFilter] = useState('All');

  function load() { api.get('/meals').then((r) => setMeals(r.data)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    try { await api.delete(`/meals/${id}`); setMeals((m) => m.filter((x) => x._id !== id)); toast('Meal deleted'); }
    catch { toast('Could not delete'); }
  }

  const shown = filter === 'All' ? meals : meals.filter((m) => m.mealType === filter.toLowerCase());

  return (
    <div className="animate-fadeUp">
      <div className="px-5 pt-6 flex items-center justify-between">
        <div>
          <div className="text-[13px] text-muted font-semibold">Your recipe library</div>
          <h1 className="text-[26px] font-extrabold tracking-tight mt-0.5">Recipes 🍴</h1>
        </div>
        <Link href="/meals/create" className="w-11 h-11 rounded-2xl bg-brand text-white grid place-items-center shadow-float">
          <Plus size={20} />
        </Link>
      </div>

      <div className="flex gap-2 px-5 mt-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`whitespace-nowrap text-[12.5px] font-bold px-4 py-2 rounded-full border transition ${
              filter === f ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-line'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4 space-y-3">
        {shown.map((m) => (
          <div key={m._id} className="bg-white border border-line rounded-3xl overflow-hidden shadow-card">
            <FoodTile emoji={m.emoji} className="h-36 w-full" size={54} rounded="rounded-none" />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">{m.name}</h3>
                  <div className="flex gap-4 text-xs text-muted font-semibold mt-1.5">
                    <span className="flex items-center gap-1"><Clock size={13} /> {m.prepTimeMin} min</span>
                    <span className="flex items-center gap-1"><Flame size={13} /> {m.nutrition.calories} cal</span>
                    <span className="capitalize">{m.mealType}</span>
                  </div>
                </div>
                <button onClick={() => remove(m._id)} className="text-muted/60 hover:text-fat p-1"><Trash2 size={17} /></button>
              </div>
              <div className="flex gap-2 mt-3">
                <Chip v={`${m.nutrition.protein}g P`} /><Chip v={`${m.nutrition.carbs}g C`} /><Chip v={`${m.nutrition.fat}g F`} />
              </div>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center text-muted text-sm py-16">
            No meals here yet.{' '}
            <Link href="/meals/create" className="text-brand font-bold">Create one</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
function Chip({ v }: { v: string }) {
  return <span className="text-[11px] font-bold text-muted bg-line px-2.5 py-1 rounded-lg">{v}</span>;
}
