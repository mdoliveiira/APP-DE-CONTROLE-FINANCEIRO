import { createClient } from '@/lib/supabase/server';
import type { Expense, Category } from '@/lib/types';
import { MonthlyBarChart } from '@/components/reports/MonthlyBarChart';
import { CategoryPieChart } from '@/components/reports/CategoryPieChart';
import { TopExpenses } from '@/components/reports/TopExpenses';
import { subMonths, format } from 'date-fns';

export default async function ReportsPage() {
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
    .in('month', months)
    .order('due_date', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id);

  const expensesData = (expenses || []) as Expense[];
  const categoriesMap = new Map(
    (categories || []).map((cat: Category) => [cat.id, cat])
  );

  // Aggregate by month
  const monthlyData = months.map((month) => {
    const monthExpenses = expensesData.filter((e) => e.month === month);
    const paid = monthExpenses
      .filter((e) => e.status === 'pago')
      .reduce((sum, e) => sum + e.amount, 0);
    const pending = monthExpenses
      .filter((e) => e.status === 'pendente')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      month,
      paid,
      pending,
      total: paid + pending,
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

  // Top 5 expenses
  const topExpenses = expensesData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sora)' }}
          >
            Relatórios
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Análise de suas despesas nos últimos 6 meses
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MonthlyBarChart data={monthlyData} />
          <CategoryPieChart data={categoryData} />
        </div>

        <TopExpenses expenses={topExpenses} categories={categoriesMap} />
      </div>
    </div>
  );
}
