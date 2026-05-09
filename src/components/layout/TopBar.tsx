'use client';

import { LogOut, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:hidden"
      style={{
        backgroundColor: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9973A, #E8B85C)' }}
        >
          <TrendingUp className="h-3.5 w-3.5" style={{ color: 'var(--primary-foreground)' }} />
        </div>
        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--foreground)' }}>
          Finanças
        </span>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center justify-center h-8 w-8 rounded-lg transition-opacity disabled:opacity-40"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
