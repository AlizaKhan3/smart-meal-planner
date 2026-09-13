'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Meal, NutritionSummary } from '@/lib/types';
import CalorieRing from '@/components/CalorieRing';
import MacroBar from '@/components/MacroBar';
import FoodTile from '@/components/FoodTile';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<NutritionSummary | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    api.get('/nutrition/summary').then((r) => setSummary(r.data)).catch(() => {});
    api.get('/meals').then((r) => setMeals(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const target = summary?.target ?? user?.dailyCalorieTarget ?? 1800;
  const consumed = summary?.consumed.calories ?? 0;

  return (
    <div className="animate-fadeUp">
      {/* hero */}
      <div className="relative px-5 pt-6 pb-7 text-white overflow-hidden"
        style={{ background: 'linear-gradient(120deg,#F4701F,#E85D04)' }}>
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold opacity-90">Welcome back</div>
          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center"><Bell size={17} /></button>
            <Link href="/grocery" className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center"><ShoppingCart size={17} /></Link>
          </div>
        </div>
        <div className="text-[30px] font-extrabold tracking-tight mt-1">
          Hello {user?.name?.split(' ')[0]}!
        </div>
        <div className="text-sm font-bold opacity-95 mt-5">Here's your day 🍽️</div>
      </div>

      {/* calorie ring */}
      <div className="-mt-4 mx-5 bg-white border border-line rounded-3xl shadow-card p-5 flex items-center gap-5 relative z-10">
        <CalorieRing consumed={consumed} target={target} />
        <div className="flex-1">
          <div className="text-[13px] text-muted font-semibold">
            <b className="text-ink">{summary?.remaining ?? target} kcal</b> remaining today
          </div>
          <div className="mt-3">
            <MacroBar label="Protein" value={summary?.consumed.protein ?? 0} goal={120} color="#2FB07C" />
            <MacroBar label="Carbs" value={summary?.consumed.carbs ?? 0} goal={220} color="#F0A93B" />
            <MacroBar label="Fat" value={summary?.consumed.fat ?? 0} goal={60} color="#EB6F6F" />
          </div>
        </div>
      </div>

      {/* quick recipes */}
      <div className="flex items-center justify-between px-5 mt-7 mb-3">
        <h2 className="text-lg font-extrabold tracking-tight">Your recipes</h2>
        <Link href="/meals" className="text-brand font-bold text-sm">View all</Link>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-2">
        {meals.map((m) => (
          <Link key={m._id} href={`/meals`} className="shrink-0 w-40 bg-white border border-line rounded-2xl p-2 shadow-card">
            <FoodTile emoji={m.emoji} className="h-24 w-full" />
            <div className="font-bold text-[13px] mt-2 px-1 leading-tight">{m.name}</div>
            <div className="text-[11px] text-muted px-1 mt-0.5">{m.nutrition.calories} cal · {m.prepTimeMin} min</div>
          </Link>
        ))}
        {meals.length === 0 && <div className="text-muted text-sm py-6">Loading recipes…</div>}
      </div>
    </div>
  );
}
