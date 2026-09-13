'use client';
import Link from 'next/link';
import { ArrowRight, Calendar, ShoppingCart, Activity } from 'lucide-react';
import FoodTile from '@/components/FoodTile';

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFE9D4] via-[#FDF6EF] to-white">
      <header className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-extrabold text-lg">
          <span className="w-8 h-8 rounded-xl bg-brand text-white grid place-items-center">🥗</span>
          NourishPlan
        </div>
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link href="/login" className="text-ink/70 hover:text-ink">Log in</Link>
          <Link href="/register" className="bg-brand text-white px-4 py-2 rounded-xl shadow-float">
            Get started
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block text-xs font-bold text-brand bg-brand-soft px-3 py-1.5 rounded-full mb-5">
            Plan · Track · Shop
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
            Your week of meals,<br />sorted in minutes.
          </h1>
          <p className="text-muted text-base mt-4 leading-relaxed max-w-md">
            Build a balanced weekly plan, see calories and macros calculated automatically,
            then generate a categorised grocery list from everything you picked.
          </p>
          <div className="flex gap-3 mt-7">
            <Link href="/register" className="bg-brand text-white font-bold px-6 py-3.5 rounded-2xl shadow-float flex items-center gap-2">
              Start planning <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="font-bold px-6 py-3.5 rounded-2xl border border-line bg-white">
              I have an account
            </Link>
          </div>
          <p className="text-xs text-muted mt-4">Demo login: demo@nourishplan.app · password123</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { e: '🥑', n: 'Avocado Toast', c: '400 cal' },
            { e: '🥗', n: 'Quinoa Bowl', c: '750 cal' },
            { e: '🍣', n: 'Seared Salmon', c: '620 cal' },
            { e: '🍛', n: 'Coconut Curry', c: '590 cal' },
          ].map((m) => (
            <div key={m.n} className="bg-white rounded-3xl p-3 shadow-card border border-line">
              <FoodTile emoji={m.e} className="h-28 w-full" />
              <div className="font-bold text-sm mt-2.5 px-1">{m.n}</div>
              <div className="text-xs text-muted px-1">{m.c}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {[
          { icon: Calendar, t: 'Weekly planner', d: 'Breakfast, lunch, dinner and snacks across seven days with daily totals.' },
          { icon: Activity, t: 'Nutrition tracking', d: 'Calories and macros calculated from ingredient quantities as you build.' },
          { icon: ShoppingCart, t: 'Auto grocery list', d: 'Duplicate ingredients combined and grouped by aisle, ready to shop.' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="bg-white rounded-3xl p-6 border border-line shadow-card">
            <div className="w-11 h-11 rounded-2xl bg-brand-soft text-brand grid place-items-center mb-4">
              <Icon size={22} />
            </div>
            <h3 className="font-extrabold text-lg">{t}</h3>
            <p className="text-muted text-sm mt-1.5 leading-relaxed">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
