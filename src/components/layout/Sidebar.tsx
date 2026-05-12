'use client';

import { BarChart3, Home, LogOut, Tag, TrendingUp, Moon, Sun, BarChart2, Settings, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/expenses', icon: BarChart3, label: 'Contas' },
  { href: '/credit-cards', icon: CreditCard, label: 'Cartões' },
  { href: '/reports', icon: BarChart2, label: 'Relatórios' },
  { href: '/categories', icon: Tag, label: 'Categorias' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className="hidden md:flex flex-col w-60 h-screen sticky top-0 shrink-0"
      style={{
        backgroundColor: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-7 flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9973A, #E8B85C)' }}
        >
          <TrendingUp className="h-4 w-4" style={{ color: 'var(--primary-foreground)' }} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-sora)', color: 'var(--sidebar-foreground)' }}>
            Finanças
          </p>
          <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Controle pessoal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={active ? {
                backgroundColor: 'rgba(201,151,58,0.12)',
                color: '#E8B85C',
              } : {
                color: '#6B7280',
              }}
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                style={{ color: active ? '#C9973A' : 'inherit' }}
              />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#C9973A' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: '#6B7280' }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        </button>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          style={{ color: '#6B7280' }}
        >
          <LogOut className="h-4 w-4" />
          {loading ? 'Saindo…' : 'Sair'}
        </button>
      </div>
    </aside>
  );
}
