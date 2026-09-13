'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not create account');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-line shadow-card p-7 animate-fadeUp">
      <div className="text-3xl mb-1">🥗</div>
      <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
      <p className="text-muted text-sm mt-1 mb-6">Set up your profile next, then start planning.</p>

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-xs font-bold text-muted">Name</span>
          <input value={form.name} onChange={set('name')} required
            className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-muted">Email</span>
          <input type="email" value={form.email} onChange={set('email')} required
            className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-muted">Password</span>
          <input type="password" value={form.password} onChange={set('password')} required minLength={6}
            className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </label>
        {error && <p className="text-fat text-sm font-semibold">{error}</p>}
        <button disabled={busy}
          className="w-full bg-brand text-white font-bold py-3.5 rounded-2xl shadow-float disabled:opacity-60">
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-brand font-bold">Log in</Link>
      </p>
    </div>
  );
}
