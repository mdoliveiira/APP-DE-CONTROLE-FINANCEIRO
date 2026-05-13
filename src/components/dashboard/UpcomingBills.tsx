import { EmptyState } from '@/components/shared/EmptyState';
import { formatBRL } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import type { Expense, Category } from '@/lib/types';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

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
  const getUrgencyColor = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const daysUntil = differenceInDays(due, today);

    if (daysUntil < 0) {
      return { bg: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', label: 'Venceu!', color: '#F87171' };
    } else if (daysUntil === 0) {
      return { bg: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', label: 'Vence hoje!', color: '#F87171' };
    } else if (daysUntil <= 3) {
      return { bg: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)', label: `Em ${daysUntil} dia${daysUntil !== 1 ? 's' : ''}`, color: '#F97316' };
    } else {
      return { bg: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', label: `Em ${daysUntil} dias`, color: '#F59E0B' };
    }
  };

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
          const urgency = getUrgencyColor(bill.due_date);
          return (
            <Link
              key={bill.id}
              href={`/expenses/${bill.id}`}
              className="flex items-center justify-between rounded-xl p-3 transition-colors"
              style={{ backgroundColor: urgency.bg, border: urgency.border }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {category && (
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: '#E8E8EE' }}>
                    {bill.description}
                  </p>
                  <p className="text-xs" style={{ color: urgency.color }}>
                    {urgency.label}
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
