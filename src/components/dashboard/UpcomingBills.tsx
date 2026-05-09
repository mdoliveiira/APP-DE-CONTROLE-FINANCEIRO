import { EmptyState } from '@/components/shared/EmptyState';
import { formatBRL } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import type { Expense, Category } from '@/lib/types';
import Link from 'next/link';

const cardStyle = {
  backgroundColor: '#141419',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '1rem',
  padding: '1.5rem',
};

interface UpcomingBillsProps {
  bills: Expense[];
  categories: Map<string, Category>;
}

export function UpcomingBills({ bills, categories }: UpcomingBillsProps) {
  if (bills.length === 0) {
    return (
      <div style={cardStyle}>
        <h3
          className="mb-6 text-base font-semibold"
          style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
        >
          Contas a Vencer em Breve
        </h3>
        <EmptyState
          title="Nenhuma conta pendente"
          description="Parabéns! Todas as suas contas foram pagas."
          icon="🎉"
        />
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3
        className="mb-4 text-base font-semibold"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        Contas a Vencer em Breve
      </h3>
      <div className="space-y-2">
        {bills.map((bill) => {
          const category = bill.category_id ? categories.get(bill.category_id) : undefined;
          return (
            <Link
              key={bill.id}
              href={`/expenses/${bill.id}`}
              className="flex items-center justify-between rounded-xl p-3 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {category && (
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#E8E8EE' }}>
                    {bill.description}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    Vence: {formatDate(bill.due_date)}
                  </p>
                </div>
              </div>
              <p
                className="font-semibold text-sm shrink-0"
                style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
              >
                {formatBRL(bill.amount)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
