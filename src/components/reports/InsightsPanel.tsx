import { formatBRL } from '@/lib/utils/currency';
import type { Expense, Category } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthData {
  month: string;
  paid: number;
  pending: number;
  total: number;
  income?: number;
  balance?: number;
}

interface InsightsPanelProps {
  totalExpenses: number;
  totalIncome: number;
  averageMonthly: number;
  worstMonth: MonthData;
  bestMonth: MonthData;
  topCategory?: { category?: Category; amount: number };
  largestExpense?: Expense;
  categoriesMap: Map<string, Category>;
}

export function InsightsPanel({
  totalExpenses,
  totalIncome,
  averageMonthly,
  worstMonth,
  bestMonth,
  topCategory,
  largestExpense,
  categoriesMap,
}: InsightsPanelProps) {
  const insights = [
    {
      label: 'Total gasto (6 meses)',
      value: formatBRL(totalExpenses),
      icon: '💰',
    },
    {
      label: 'Média mensal',
      value: formatBRL(averageMonthly),
      icon: '📊',
    },
    {
      label: 'Mês mais caro',
      value: `${format(new Date(worstMonth.month + '-01'), 'MMM', { locale: ptBR })} - ${formatBRL(worstMonth.total)}`,
      icon: '📈',
    },
    {
      label: 'Mês mais econômico',
      value: `${format(new Date(bestMonth.month + '-01'), 'MMM', { locale: ptBR })} - ${formatBRL(bestMonth.total)}`,
      icon: '📉',
    },
    {
      label: 'Categoria campeã',
      value: topCategory?.category ? `${topCategory.category.name} - ${formatBRL(topCategory.amount)}` : 'N/A',
      icon: '🏆',
    },
    {
      label: 'Maior gasto único',
      value: largestExpense?.amount ? `${largestExpense.description} - ${formatBRL(largestExpense.amount)}` : 'N/A',
      icon: '💳',
    },
  ];

  if (totalIncome > 0) {
    insights.push({
      label: 'Total de receitas',
      value: formatBRL(totalIncome),
      icon: '📥',
    });
  }

  return (
    <div>
      <h2
        className="mb-4 text-base font-semibold"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        Insights Financeiros
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className="rounded-xl p-4"
            style={{
              backgroundColor: '#141419',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                {insight.label}
              </p>
              <span className="text-lg">{insight.icon}</span>
            </div>
            <p
              className="text-sm font-bold"
              style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
            >
              {insight.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
