'use client';

import { formatBRL } from '@/lib/utils/currency';
import type { Budget, Category } from '@/lib/types';

interface BudgetProgressProps {
  budgets: Budget[];
  categories: Map<string, Category>;
  spendingByCategory: Record<string, number>;
}

export function BudgetProgress({ budgets, categories, spendingByCategory }: BudgetProgressProps) {
  if (budgets.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h2
        className="mb-6 text-base font-semibold"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        Orçamento por Categoria
      </h2>

      <div className="space-y-5">
        {budgets.map((budget) => {
          const category = categories.get(budget.category_id);
          const spent = spendingByCategory[budget.category_id] || 0;
          const percentage = (spent / budget.amount_limit) * 100;
          const isOverBudget = spent > budget.amount_limit;

          const barColor = percentage >= 100
            ? '#F87171'
            : percentage >= 75
            ? '#F59E0B'
            : '#22D3A8';

          const valueColor = percentage >= 100
            ? '#F87171'
            : percentage >= 75
            ? '#F59E0B'
            : '#22D3A8';

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <span className="text-sm font-medium" style={{ color: '#E8E8EE' }}>
                    {category?.name}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: valueColor }}>
                  {formatBRL(spent)} / {formatBRL(budget.amount_limit)}
                </span>
              </div>

              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  {Math.min(percentage, 100).toFixed(0)}%
                </span>
                {isOverBudget && (
                  <span className="text-xs font-medium" style={{ color: '#F87171' }}>
                    Excedido em {formatBRL(spent - budget.amount_limit)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
