'use client';

import { BarChart3, Home, Tag, BarChart2, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/expenses', icon: BarChart3, label: 'Contas' },
  { href: '/reports', icon: BarChart2, label: 'Relatórios' },
  { href: '/categories', icon: Tag, label: 'Categorias' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-2xl px-2 py-2 md:hidden"
      style={{
        backgroundColor: 'var(--card)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        width: 'calc(100vw - 2rem)',
        maxWidth: '360px',
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200"
            style={active ? { backgroundColor: 'var(--color-brand-dim, rgba(201,151,58,0.14))' } : {}}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: active ? 'var(--color-brand, #C9973A)' : 'var(--muted-foreground, #6B7280)' }}
            />
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: active ? 'var(--color-brand, #C9973A)' : 'var(--muted-foreground, #6B7280)' }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
