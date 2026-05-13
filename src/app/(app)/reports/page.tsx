import { createClient } from '@/lib/supabase/server';
import type { Expense, Category, EntityType, Income } from '@/lib/types';
import { MonthlyBarChart } from '@/components/reports/MonthlyBarChart';
import { CategoryBarChart } from '@/components/reports/CategoryBarChart';
import { TopExpenses } from '@/components/reports/TopExpenses';
import { InsightsPanel } from '@/components/reports/InsightsPanel';
import { BalanceChart } from '@/components/reports/BalanceChart';
import { subMonths, format } from 'date-fns';
import Link from 'next/link';

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ entity_type?: string }>;
}) {
  const params = await searchParams;
  const entityType = (params.entity_type || 'pessoal') as EntityType;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, i);
    return format(d, 'yyyy-MM');
  }).reverse();

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user?.id)
    .eq('entity_type', entityType)
    .in('month', months)
    .order('due_date', { ascending: false });

  const { data: incomes } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', user?.id)
    .eq('entity_type', entityType)
    .in('month', months);

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .eq('entity_type', entityType);

  const expensesData = (expenses || []) as Expense[];
  const incomesData = (incomes || []) as Income[];
  const categoriesMap = new Map(
    (categories || []).map((cat: Category) => [cat.id, cat])
  );

  // Aggregate by month
  const monthlyData = months.map((month) => {
    const monthExpenses = expensesData.filter((e) => e.month === month);
    const monthIncomes = incomesData.filter((i) => i.month === month);
    const paid = monthExpenses
      .filter((e) => e.status === 'pago')
      .reduce((sum, e) => sum + e.amount, 0);
    const pending = monthExpenses
      .filter((e) => e.status === 'pendente')
      .reduce((sum, e) => sum + e.amount, 0);
    const income = monthIncomes.reduce((sum, i) => sum + i.amount, 0);

    return {
      month,
      paid,
      pending,
      total: paid + pending,
      income,
      balance: income - (paid + pending),
    };
  });

  // Aggregate by category (all months)
  const categoryData = Array.from(
    expensesData.reduce((acc, e) => {
      if (!e.category_id) return acc;
      const cat = acc.get(e.category_id);
      const amount = e.amount;
      acc.set(e.category_id, (cat || 0) + amount);
      return acc;
    }, new Map<string, number>())
  ).map(([categoryId, amount]) => ({
    category: categoriesMap.get(categoryId),
    amount,
  }));

  // Top 5 paid expenses
  const topExpenses = expensesData
    .filter((e) => e.status === 'pago')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Calculate metrics
  const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomesData.reduce((sum, i) => sum + i.amount, 0);
  const averageMonthly = totalExpenses / months.length;
  const worstMonth = monthlyData.reduce((worst, current) =>
    current.total > worst.total ? current : worst
  );
  const bestMonth = monthlyData.reduce((best, current) =>
    current.total < best.total && current.total > 0 ? current : best
  );

  const topCategoryByAmount = categoryData.reduce((top, current) =>
    current.amount > top.amount ? current : top,
    { category: undefined, amount: 0 }
  );

  const largestExpense = expensesData.reduce((largest, current) =>
    current.amount > largest.amount ? current : largest,
    { id: '', amount: 0 } as Expense
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            Relatórios
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Análise detalhada dos últimos 6 meses
          </p>
        </div>

        <div className="flex gap-2 border-b" style={{ borderColor: '#374151' }}>
          <Link
            href="/reports?entity_type=pessoal"
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
            href="/reports?entity_type=empresa"
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

        <InsightsPanel
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          averageMonthly={averageMonthly}
          worstMonth={worstMonth}
          bestMonth={bestMonth}
          topCategory={topCategoryByAmount}
          largestExpense={largestExpense}
          categoriesMap={categoriesMap}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MonthlyBarChart data={monthlyData} />
          <CategoryBarChart data={categoryData} />
        </div>

        {totalIncome > 0 && <BalanceChart data={monthlyData} />}

        <TopExpenses expenses={topExpenses} categories={categoriesMap} />
      </div>
    </div>
  );
}
