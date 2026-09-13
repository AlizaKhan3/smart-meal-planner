'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@nourishplan.app');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not log in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-line shadow-card p-7 animate-fadeUp">
      <div className="text-3xl mb-1">🥗</div>
      <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="text-muted text-sm mt-1 mb-6">Log in to pick up your meal plan.</p>

      <form onSubmit={submit} className="space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="text-fat text-sm font-semibold">{error}</p>}
        <button
          disabled={busy}
          className="w-full bg-brand text-white font-bold py-3.5 rounded-2xl shadow-float disabled:opacity-60"
        >
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-5">
        New here?{' '}
        <Link href="/register" className="text-brand font-bold">Create an account</Link>
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted">{label}</span>
      <input
        type={type} value={value} required
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
