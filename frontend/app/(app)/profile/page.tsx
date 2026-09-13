'use client';
import { useEffect, useState } from 'react';
import { LogOut, Crown, Info, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { NutritionSummary } from '@/lib/types';
import CalorieRing from '@/components/CalorieRing';
import MacroBar from '@/components/MacroBar';
import { useToast } from '@/components/Toast';

const GOALS = [
  { v: 'weight_loss', l: 'Weight loss' },
  { v: 'maintenance', l: 'Maintenance' },
  { v: 'muscle_gain', l: 'Muscle gain' },
];
const ACTIVITY = [
  { v: 'sedentary', l: 'Sedentary' }, { v: 'light', l: 'Light' },
  { v: 'moderate', l: 'Moderate' }, { v: 'active', l: 'Active' },
  { v: 'very_active', l: 'Very active' },
];
const DIETS = [
  { v: 'non_vegetarian', l: 'Non-veg' }, { v: 'vegetarian', l: 'Vegetarian' },
  { v: 'vegan', l: 'Vegan' }, { v: 'high_protein', l: 'High protein' }, { v: 'keto', l: 'Keto' },
];

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const toast = useToast();
  const [summary, setSummary] = useState<NutritionSummary | null>(null);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/nutrition/summary').then((r) => setSummary(r.data)).catch(() => {});
  }, []);
  useEffect(() => {
    if (user) setForm({
      name: user.name, sex: user.sex, age: user.age, heightCm: user.heightCm,
      weightKg: user.weightKg, goal: user.goal, activityLevel: user.activityLevel,
      dietType: user.dietType, dailyCalorieTarget: user.dailyCalorieTarget,
    });
  }, [user]);

  if (!user || !form) return null;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  async function save() {
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', {
        ...form, age: +form.age, heightCm: +form.heightCm,
        weightKg: +form.weightKg, dailyCalorieTarget: +form.dailyCalorieTarget,
      });
      setUser(data);
      toast('Profile updated ✓');
    } catch { toast('Could not save'); } finally { setSaving(false); }
  }

  // live estimate preview (Mifflin-St Jeor, mirrors the backend)
  function estimate() {
    const w = +form.weightKg, h = +form.heightCm, a = +form.age;
    const bmr = form.sex === 'female' ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5;
    const fac: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const adj: any = { weight_loss: -400, maintenance: 0, muscle_gain: 300 };
    return Math.max(1200, Math.round((bmr * fac[form.activityLevel] + adj[form.goal]) / 10) * 10);
  }

  return (
    <div className="animate-fadeUp pb-4">
      <div className="relative px-5 pt-7 pb-9 text-white" style={{ background: 'linear-gradient(120deg,#F4701F,#E85D04)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/25 grid place-items-center text-2xl font-extrabold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">{user.name}</div>
            <div className="text-sm opacity-90">{user.email}</div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full mt-1.5 capitalize">
              {user.subscriptionPlan === 'premium' ? <><Crown size={12} /> Premium</> : 'Free plan'}
            </span>
          </div>
        </div>
      </div>

      {/* nutrition snapshot */}
      <div className="-mt-5 mx-5 bg-white border border-line rounded-3xl shadow-card p-5 flex items-center gap-5 relative z-10">
        <CalorieRing consumed={summary?.consumed.calories ?? 0} target={form.dailyCalorieTarget} size={104} />
        <div className="flex-1">
          <div className="text-[13px] text-muted font-semibold mb-3">Today's macros</div>
          <MacroBar label="Protein" value={summary?.consumed.protein ?? 0} goal={120} color="#2FB07C" />
          <MacroBar label="Carbs" value={summary?.consumed.carbs ?? 0} goal={220} color="#F0A93B" />
          <MacroBar label="Fat" value={summary?.consumed.fat ?? 0} goal={60} color="#EB6F6F" />
        </div>
      </div>

      {/* dietary profile */}
      <div className="px-5 mt-6">
        <h2 className="font-extrabold text-lg tracking-tight mb-3">Dietary profile</h2>

        <div className="grid grid-cols-2 gap-3">
          <F label="Age"><input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} className={inp} /></F>
          <F label="Sex">
            <select value={form.sex} onChange={(e) => set('sex', e.target.value)} className={`${inp} bg-white capitalize`}>
              <option value="male">Male</option><option value="female">Female</option>
            </select>
          </F>
          <F label="Height (cm)"><input type="number" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} className={inp} /></F>
          <F label="Weight (kg)"><input type="number" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} className={inp} /></F>
        </div>

        <Group label="Goal" options={GOALS} value={form.goal} onChange={(v) => set('goal', v)} />
        <Group label="Activity level" options={ACTIVITY} value={form.activityLevel} onChange={(v) => set('activityLevel', v)} />
        <Group label="Diet type" options={DIETS} value={form.dietType} onChange={(v) => set('dietType', v)} />

        <F label="Daily calorie target (kcal)" className="mt-4">
          <input type="number" value={form.dailyCalorieTarget} onChange={(e) => set('dailyCalorieTarget', e.target.value)} className={inp} />
        </F>
        <button onClick={() => set('dailyCalorieTarget', estimate())}
          className="mt-2 text-sm font-bold text-brand flex items-center gap-1">
          <Sparkles size={15} /> Use estimate ({estimate()} kcal)
        </button>

        <div className="flex gap-2 items-start text-[11.5px] text-muted mt-4 bg-line/60 rounded-2xl p-3">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>Calorie estimates use the Mifflin-St Jeor formula and your activity level. This is a guideline only and not medical advice.</span>
        </div>

        <button onClick={save} disabled={saving}
          className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-float mt-5 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save profile'}
        </button>

        <button onClick={logout}
          className="w-full mt-3 text-fat font-bold py-3.5 rounded-2xl border border-line flex items-center justify-center gap-2">
          <LogOut size={17} /> Log out
        </button>
      </div>
    </div>
  );
}

const inp = 'mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand';
function F({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="text-xs font-bold text-muted">{label}</span>{children}</label>;
}
function Group({ label, options, value, onChange }: {
  label: string; options: { v: string; l: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <span className="text-xs font-bold text-muted">{label}</span>
      <div className="flex gap-2 flex-wrap mt-1.5">
        {options.map((o) => (
          <button key={o.v} onClick={() => onChange(o.v)}
            className={`text-[12.5px] font-bold px-3.5 py-2 rounded-full border transition ${
              value === o.v ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-line'}`}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
