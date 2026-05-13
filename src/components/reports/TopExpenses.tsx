'use client';

import type { Expense, Category } from '@/lib/types';
import { formatBRL } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TopExpensesProps {
  expenses: Expense[];
  categories: Map<string, Category>;
}

export function TopExpenses({ expenses, categories }: TopExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: '#141419',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <h3
          className="mb-6 text-base font-semibold"
          style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
        >
          Maiores Despesas
        </h3>
        <p style={{ color: '#6B7280' }}>Nenhuma despesa paga encontrada</p>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3
        className="mb-6 text-base font-semibold"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        Maiores Despesas Pagas
      </h3>
      <div className="space-y-3">
        {expenses.map((expense, index) => {
          const category = expense.category_id ? categories.get(expense.category_id) : undefined;
          const percentage = ((expense.amount / totalExpenses) * 100).toFixed(1);
          const monthLabel = format(new Date(expense.month + '-01'), 'MMM', { locale: ptBR });

          return (
            <div
              key={expense.id}
              className="flex items-center gap-4 rounded-lg p-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${category?.color || '#6B7280'}`,
              }}
            >
              <div className="text-lg font-bold w-6" style={{ color: '#C9973A' }}>
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#E8E8EE' }}>
                  {expense.description}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {category?.name} • {monthLabel}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold" style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}>
                  {formatBRL(expense.amount)}
                </p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {percentage}% do total
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
