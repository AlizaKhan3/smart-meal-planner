'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';
import { ToastProvider } from '@/components/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center text-muted">Loading…</div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F4EFE9] md:py-6">
        {/* app-like centred column that stays responsive down to full-width mobile */}
        <div className="relative mx-auto w-full max-w-md bg-white md:rounded-[34px] md:shadow-2xl min-h-screen md:min-h-0 md:overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">{children}</div>
          <BottomNav />
        </div>
      </div>
    </ToastProvider>
  );
}
