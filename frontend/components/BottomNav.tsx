'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, ClipboardList, ShoppingCart, UtensilsCrossed } from 'lucide-react';

const TABS = [
  { href: '/profile', label: 'Settings', icon: Settings },
  { href: '/planner', label: 'Planner', icon: ClipboardList },
  { href: '/grocery', label: 'Groceries', icon: ShoppingCart },
  { href: '/meals', label: 'Recipes', icon: UtensilsCrossed },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed md:sticky bottom-0 left-0 right-0 z-40 h-[74px] bg-white border-t border-line shadow-nav flex items-start justify-around pt-3 md:rounded-b-3xl">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 text-[10.5px] font-bold px-3 transition-colors ${
              active ? 'text-brand' : 'text-muted/70'
            }`}
          >
            <Icon size={21} className={active ? 'scale-110 -translate-y-0.5 transition' : ''} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
