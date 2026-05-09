'use client';

import type { Expense, Category } from '@/lib/types';

interface TopExpensesProps {
  expenses: Expense[];
  categories: Map<string, Category>;
}

export function TopExpenses({ expenses, categories }: TopExpensesProps) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--foreground)' }}
      >
        Maiores Despesas
      </h2>
      {expenses.length === 0 ? (
        <div style={{ color: 'var(--muted-foreground)' }}>
          Sem despesas para exibir
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => {
            const category = expense.category_id ? categories.get(expense.category_id) : null;
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--background)',
                  borderLeft: `4px solid ${category?.color || 'var(--border)'}`,
                }}
              >
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {expense.description}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {category?.name || 'Sem categoria'}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: expense.status === 'pago' ? '#22D3A8' : '#F59E0B',
                    }}
                  >
                    {expense.status === 'pago' ? 'Pago' : 'Pendente'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
