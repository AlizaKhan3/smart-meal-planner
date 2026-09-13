'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

const ToastCtx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2000);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-ink text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-2xl transition-all ${
          msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {msg}
      </div>
    </ToastCtx.Provider>
  );
}
