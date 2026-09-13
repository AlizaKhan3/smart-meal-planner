'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

interface Ing { name: string; quantity: number; unit: string; }
const EMOJIS = ['🍽️', '🥑', '🥗', '🍳', '🍣', '🥣', '🌈', '🍝', '🍛', '🥤', '🥡', '🍜'];

export default function CreateMeal() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [emoji, setEmoji] = useState('🍽️');
  const [prepTimeMin, setPrep] = useState(20);
  const [tags, setTags] = useState('');
  const [ings, setIngs] = useState<Ing[]>([{ name: '', quantity: 100, unit: 'g' }]);
  const [catalogue, setCatalogue] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/ingredients').then((r) => setCatalogue(r.data.map((i: any) => i.name))).catch(() => {});
  }, []);

  const setIng = (idx: number, patch: Partial<Ing>) =>
    setIngs((arr) => arr.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/meals', {
        name, mealType, emoji, prepTimeMin,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        ingredients: ings.filter((i) => i.name.trim()),
      });
      toast('Meal created — nutrition calculated ✓');
      router.push('/meals');
    } catch {
      toast('Could not create meal');
    } finally { setBusy(false); }
  }

  return (
    <div className="animate-fadeUp">
      <div className="px-5 pt-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-line grid place-items-center"><ArrowLeft size={18} /></button>
        <h1 className="text-xl font-extrabold tracking-tight">New meal</h1>
      </div>

      <form onSubmit={submit} className="px-5 mt-5 space-y-4 pb-4">
        <label className="block">
          <span className="text-xs font-bold text-muted">Meal name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Chicken Rice Bowl"
            className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold text-muted">Type</span>
            <select value={mealType} onChange={(e) => setMealType(e.target.value)}
              className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand bg-white capitalize">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-muted">Prep (min)</span>
            <input type="number" value={prepTimeMin} min={0} onChange={(e) => setPrep(+e.target.value)}
              className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
          </label>
        </div>

        <div>
          <span className="text-xs font-bold text-muted">Icon</span>
          <div className="flex gap-2 flex-wrap mt-1.5">
            {EMOJIS.map((e) => (
              <button type="button" key={e} onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-xl grid place-items-center text-lg border-2 ${emoji === e ? 'border-brand bg-brand-soft' : 'border-line'}`}>{e}</button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-muted">Tags (comma separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="high-protein, healthy"
            className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </label>

        <div>
          <span className="text-xs font-bold text-muted">Ingredients</span>
          <p className="text-[11px] text-muted mt-0.5">Nutrition is calculated automatically from the catalogue.</p>
          <div className="space-y-2 mt-2">
            {ings.map((ing, idx) => (
              <div key={idx} className="flex gap-2">
                <input list="catalogue" value={ing.name} onChange={(e) => setIng(idx, { name: e.target.value })}
                  placeholder="Ingredient" className="flex-1 min-w-0 border border-line rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand" />
                <input type="number" value={ing.quantity} onChange={(e) => setIng(idx, { quantity: +e.target.value })}
                  className="w-16 border border-line rounded-xl px-2 py-2.5 text-sm outline-none focus:border-brand" />
                <select value={ing.unit} onChange={(e) => setIng(idx, { unit: e.target.value })}
                  className="w-16 border border-line rounded-xl px-1 py-2.5 text-sm outline-none bg-white">
                  {['g', 'ml', 'pcs', 'tbsp', 'tsp'].map((u) => <option key={u}>{u}</option>)}
                </select>
                <button type="button" onClick={() => setIngs((a) => a.filter((_, i) => i !== idx))}
                  className="text-muted/60 px-1"><X size={16} /></button>
              </div>
            ))}
            <datalist id="catalogue">{catalogue.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <button type="button" onClick={() => setIngs((a) => [...a, { name: '', quantity: 100, unit: 'g' }])}
            className="mt-2 text-sm font-bold text-brand flex items-center gap-1"><Plus size={15} /> Add ingredient</button>
        </div>

        <button disabled={busy} className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-float disabled:opacity-60">
          {busy ? 'Saving…' : 'Create meal'}
        </button>
      </form>
    </div>
  );
}
