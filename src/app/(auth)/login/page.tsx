'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9973A, #E8B85C)' }}
        >
          <TrendingUp className="h-7 w-7" style={{ color: '#0D0D12' }} />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-sora)' }}>
            Finanças
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            Faça login em sua conta
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          backgroundColor: '#141419',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {error && (
          <div
            className="rounded-xl p-3 text-sm"
            style={{
              backgroundColor: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#F87171',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="você@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#E8E8EE',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#E8E8EE',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #C9973A, #E8B85C)',
              color: '#0D0D12',
              fontFamily: 'var(--font-sora)',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: '#6B7280' }}>
          Não tem conta?{' '}
          <Link
            href="/register"
            className="font-medium transition-colors"
            style={{ color: '#C9973A' }}
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
