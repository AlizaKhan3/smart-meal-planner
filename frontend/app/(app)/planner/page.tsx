'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, ShoppingCart, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/lib/types';
import FoodTile from '@/components/FoodTile';
import { useToast } from '@/components/Toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOT_STYLE: Record<string, string> = {
  breakfast: 'text-brand bg-brand-soft',
  lunch: 'text-pro bg-[#E6F6EF]',
  dinner: 'text-[#3B93E8] bg-[#E9F2FC]',
};

export default function Planner() {
  const { user } = useAuth();
  const toast = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selected, setSelected] = useState<Meal | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/meals').then((r) => setMeals(r.data)).catch(() => {});
  }, []);

  // Build a simple week from the available meals grouped by slot.
  const week = useMemo(() => {
    const byType = (t: string) => meals.filter((m) => m.mealType === t);
    const b = byType('breakfast'), l = byType('lunch'), d = byType('dinner');
    if (!meals.length) return [];
    return DAYS.map((day, i) => ({
      day,
      breakfast: b[i % Math.max(1, b.length)],
      lunch: l[i % Math.max(1, l.length)],
      dinner: d[i % Math.max(1, d.length)],
    }));
  }, [meals]);

  async function saveAndGenerate() {
    if (!week.length) return;
    setSaving(true);
    try {
      const start = new Date();
      const days = week.map((wd, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const iso = date.toISOString().slice(0, 10);
        const dayMeals = [wd.breakfast, wd.lunch, wd.dinner]
          .filter(Boolean)
          .map((m) => ({ mealId: (m as Meal)._id, mealType: (m as Meal).mealType, servings: 1 }));
        return { date: iso, meals: dayMeals };
      });
      const plan = await api.post('/meal-plans', {
        weekStartDate: start.toISOString().slice(0, 10), days,
      });
      await api.post('/grocery/generate', { mealPlanId: plan.data._id });
      toast('Plan saved & grocery list generated ✓');
    } catch {
      toast('Could not save the plan');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="animate-fadeUp">
      {/* hero */}
      <div className="relative px-5 pt-6 pb-7 text-white overflow-hidden"
        style={{ background: 'linear-gradient(120deg,#F4701F,#E85D04)' }}>
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold opacity-90">Welcome back · this week</div>
          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center"><Bell size={17} /></button>
            <Link href="/grocery" className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center"><ShoppingCart size={17} /></Link>
          </div>
        </div>
        <div className="text-[30px] font-extrabold tracking-tight mt-1">Hello {user?.name?.split(' ')[0]}!</div>
        <div className="text-sm font-bold opacity-95 mt-5">This week's diet 🍽️</div>
      </div>

      {week.map((wd) => {
        const total =
          (wd.breakfast?.nutrition.calories ?? 0) +
          (wd.lunch?.nutrition.calories ?? 0) +
          (wd.dinner?.nutrition.calories ?? 0);
        return (
          <div key={wd.day}>
            <div className="flex items-center gap-2.5 mx-5 mt-5 mb-3">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <h3 className="font-bold text-[15px]">{wd.day}</h3>
              <span className="ml-auto text-xs font-bold text-brand bg-brand-soft px-2.5 py-1 rounded-full">
                {total.toLocaleString()} kcal
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5">
              <MealCard meal={wd.breakfast} slot="breakfast" onClick={setSelected} />
              <MealCard meal={wd.lunch} slot="lunch" onClick={setSelected} />
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 mt-3">
              <MealCard meal={wd.dinner} slot="dinner" onClick={setSelected} />
            </div>
          </div>
        );
      })}

      {week.length === 0 && (
        <div className="text-center text-muted text-sm py-16 px-6">
          No meals yet.{' '}
          <Link href="/meals/create" className="text-brand font-bold">Create your first meal</Link> to build a plan.
        </div>
      )}

      <div className="px-5 mt-6">
        <button
          onClick={saveAndGenerate} disabled={saving || !week.length}
          className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-float disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save plan & generate groceries'}
        </button>
      </div>

      {/* meal detail sheet */}
      <MealSheet meal={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function MealCard({ meal, slot, onClick }: { meal?: Meal; slot: string; onClick: (m: Meal) => void }) {
  if (!meal) {
    return (
      <Link href="/meals/create" className="border border-dashed border-line rounded-2xl grid place-items-center h-[168px] text-muted">
        <div className="text-center text-xs"><Plus className="mx-auto mb-1" size={18} />Add {slot}</div>
      </Link>
    );
  }
  return (
    <button onClick={() => onClick(meal)} className="text-left bg-white border border-line rounded-2xl p-2 shadow-card active:scale-[.97] transition">
      <span className={`inline-block text-[10.5px] font-bold px-2.5 py-1 rounded-lg mb-2 capitalize ${SLOT_STYLE[slot]}`}>{slot}</span>
      <FoodTile emoji={meal.emoji} className="h-24 w-full" size={34} />
      <div className="font-bold text-[13px] mt-2.5 px-1 leading-tight">{meal.name}</div>
      <div className="text-[11px] text-muted italic px-1 mt-0.5">{meal.nutrition.calories} cal · {meal.prepTimeMin} min</div>
    </button>
  );
}

function MealSheet({ meal, onClose }: { meal: Meal | null; onClose: () => void }) {
  const toast = useToast();
  async function log() {
    if (!meal) return;
    try { await api.post('/nutrition/log', { mealId: meal._id }); toast('Logged as eaten ✓'); onClose(); }
    catch { toast('Could not log meal'); }
  }
  return (
    <>
      <div onClick={onClose}
        className={`fixed inset-0 bg-black/45 z-40 transition-opacity ${meal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <div className={`fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-md bg-white rounded-t-[30px] z-50 max-h-[88%] overflow-y-auto no-scrollbar transition-transform duration-300 ${meal ? 'translate-y-0' : 'translate-y-full'}`}>
        {meal && (
          <div>
            <div className="w-11 h-1.5 rounded-full bg-line mx-auto mt-3" />
            <FoodTile emoji={meal.emoji} className="h-44 mx-4 mt-2" size={64} />
            <div className="p-5">
              <div className="flex gap-2 flex-wrap mb-2">
                {meal.tags.map((t) => <span key={t} className="text-[10.5px] font-bold text-pro bg-[#E6F6EF] px-2.5 py-1 rounded-lg">{t}</span>)}
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">{meal.name}</h2>
              <div className="flex gap-4 text-xs text-muted font-semibold mt-2 mb-4">
                <span>⏱ {meal.prepTimeMin} min</span><span>🍽 {meal.servings} serving</span><span className="capitalize">{meal.mealType}</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-4">
                <b className="text-3xl font-extrabold text-brand">{meal.nutrition.calories}</b>
                <span className="text-sm text-muted font-semibold">kcal per serving</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                <Nt v={`${meal.nutrition.protein}g`} l="PROTEIN" cls="bg-[#E6F6EF] text-pro" />
                <Nt v={`${meal.nutrition.carbs}g`} l="CARBS" cls="bg-[#FEF3E0] text-carb" />
                <Nt v={`${meal.nutrition.fat}g`} l="FAT" cls="bg-[#FCEBEB] text-fat" />
                <Nt v={`${meal.nutrition.fiber}g`} l="FIBRE" cls="bg-line text-ink" />
              </div>
              <h3 className="font-bold text-sm mt-5 mb-2">Ingredients</h3>
              {meal.ingredients.map((i) => (
                <div key={i.name} className="flex justify-between py-2.5 border-b border-line text-[13px]">
                  <span className="font-semibold">{i.name}</span><span className="text-muted font-semibold">{i.quantity} {i.unit}</span>
                </div>
              ))}
              <button onClick={log} className="mt-5 w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-float">
                Log as eaten
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function Nt({ v, l, cls }: { v: string; l: string; cls: string }) {
  return (
    <div className={`rounded-2xl py-3 text-center ${cls}`}>
      <b className="text-[17px] font-extrabold block">{v}</b>
      <small className="text-[10px] font-bold opacity-80">{l}</small>
    </div>
  );
}
