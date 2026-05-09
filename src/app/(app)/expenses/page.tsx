import { createClient } from '@/lib/supabase/server';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { isOverdue } from '@/lib/utils/date';
import type { Expense, Category } from '@/lib/types';

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; status?: string; category_id?: string; search?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = params.month || currentMonth;
  const status = params.status || 'todas';
  const categoryId = params.category_id || null;
  const search = params.search || null;

  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user?.id)
    .eq('month', month)
    .order('due_date', { ascending: true });

  // Apply status filter
  if (status === 'vencidas') {
    const today = format(now, 'yyyy-MM-dd');
    query = query.eq('status', 'pendente').lt('due_date', today);
  } else if (status === 'pendente' || status === 'pago') {
    query = query.eq('status', status);
  }

  // Apply category filter
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Apply search filter
  if (search) {
    query = query.ilike('description', `%${search}%`);
  }

  const { data: expenses } = await query;

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const categoriesRecord: Record<string, Category> = Object.fromEntries(
    (categories || []).map((cat: Category) => [cat.id, cat])
  );

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
            >
              Contas
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Controle suas despesas mensais
            </p>
          </div>
          <Link href="/expenses/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Despesa</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </Link>
        </div>

        <ExpenseFilters categories={categories || []} />

        <ExpenseList
          expenses={(expenses || []) as Expense[]}
          categories={categoriesRecord}
        />
      </div>

      <Link
        href="/expenses/new"
        className="fixed bottom-24 right-4 md:hidden z-30"
      >
        <button
          className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #C9973A, #E8B85C)',
            boxShadow: '0 4px 20px rgba(201,151,58,0.4)',
          }}
        >
          <Plus className="h-6 w-6" style={{ color: '#0D0D12' }} />
        </button>
      </Link>
    </div>
  );
}
