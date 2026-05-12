import { createClient } from '@/lib/supabase/server';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { UpcomingBills } from '@/components/dashboard/UpcomingBills';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import type { Expense, Category, Budget, EntityType } from '@/lib/types';
import { addDays, isWithinInterval } from 'date-fns';
import Link from 'next/link';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; entity_type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = params.month || currentMonth;
  const entityType = (params.entity_type || 'pessoal') as EntityType;

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user?.id)
    .eq('month', month)
    .eq('entity_type', entityType)
    .order('due_date', { ascending: true });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .eq('entity_type', entityType);

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user?.id);

  const expensesData = (expenses || []) as Expense[];
  const categoriesMap = new Map(
    (categories || []).map((cat: Category) => [cat.id, cat])
  );

  const spendingByCategory = expensesData.reduce(
    (acc, e) => {
      if (e.category_id) {
        acc[e.category_id] = (acc[e.category_id] || 0) + e.amount;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAmount = expensesData.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = expensesData
    .filter((e) => e.status === 'pago')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPending = expensesData
    .filter((e) => e.status === 'pendente')
    .reduce((sum, e) => sum + e.amount, 0);
  const countPaid = expensesData.filter((e) => e.status === 'pago').length;
  const countPending = expensesData.filter((e) => e.status === 'pendente').length;

  const upcomingBills = expensesData
    .filter((e) => e.status === 'pendente')
    .filter((e) => {
      const dueDate = new Date(e.due_date);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return isWithinInterval(dueDate, { start: today, end: nextWeek });
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Resumo das suas finanças do mês
          </p>
        </div>

        <div className="flex gap-2 border-b" style={{ borderColor: '#374151' }}>
          <Link
            href={`/dashboard?month=${month}&entity_type=pessoal`}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              entityType === 'pessoal'
                ? 'border-b-2'
                : ''
            }`}
            style={
              entityType === 'pessoal'
                ? {
                    color: '#C9973A',
                    borderColor: '#C9973A',
                  }
                : { color: '#6B7280' }
            }
          >
            Pessoal
          </Link>
          <Link
            href={`/dashboard?month=${month}&entity_type=empresa`}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              entityType === 'empresa'
                ? 'border-b-2'
                : ''
            }`}
            style={
              entityType === 'empresa'
                ? {
                    color: '#C9973A',
                    borderColor: '#C9973A',
                  }
                : { color: '#6B7280' }
            }
          >
            Empresa
          </Link>
        </div>

        <SummaryCards
          totalAmount={totalAmount}
          totalPaid={totalPaid}
          totalPending={totalPending}
          countPaid={countPaid}
          countPending={countPending}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExpenseChart paid={totalPaid} pending={totalPending} />
          <UpcomingBills bills={upcomingBills} categories={categoriesMap} />
        </div>

        {(budgets || []).length > 0 && (
          <BudgetProgress
            budgets={(budgets || []) as Budget[]}
            categories={categoriesMap}
            spendingByCategory={spendingByCategory}
          />
        )}
      </div>
    </div>
  );
}
