'use client';

import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatBRL } from '@/lib/utils/currency';
import { formatDate, isOverdue } from '@/lib/utils/date';
import type { Expense, Category } from '@/lib/types';
import Link from 'next/link';

interface ExpenseRowProps {
  expense: Expense;
  category?: Category;
  onMarkPaid?: (id: string) => void;
  onMarkPending?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseRow({
  expense,
  category,
  onMarkPaid,
  onMarkPending,
  onDelete,
}: ExpenseRowProps) {
  const overdue = expense.status === 'pendente' && isOverdue(expense.due_date);

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl p-4"
      style={{
        backgroundColor: overdue ? 'rgba(248,113,113,0.06)' : '#141419',
        border: overdue
          ? '1px solid rgba(248,113,113,0.28)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {category && (
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}
          <h4
            className="font-medium truncate text-sm"
            style={{ color: '#E8E8EE' }}
          >
            {expense.description}
          </h4>
        </div>
        <p
          className="text-xs font-medium"
          style={{ color: overdue ? '#F87171' : '#6B7280' }}
        >
          {overdue ? '⚠ Venceu: ' : 'Vence: '}{formatDate(expense.due_date)}
          {expense.paid_date && (
            <span style={{ color: '#6B7280' }}> · Pago: {formatDate(expense.paid_date)}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p
            className="font-semibold text-sm"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            {formatBRL(expense.amount)}
          </p>
          <StatusBadge status={expense.status} overdue={overdue} />
        </div>

        <div className="flex gap-0.5">
          {expense.status === 'pendente' && (
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: '#6B7280' }}
              onClick={() => onMarkPaid?.(expense.id)}
              title="Marcar como pago"
            >
              <Circle className="h-4 w-4" />
            </button>
          )}
          {expense.status === 'pago' && (
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
              onClick={() => onMarkPending?.(expense.id)}
              title="Marcar como pendente"
            >
              <CheckCircle className="h-4 w-4" style={{ color: '#22D3A8' }} />
            </button>
          )}

          <Link href={`/expenses/${expense.id}`}>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: '#6B7280' }}
              title="Editar"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </Link>

          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#6B7280' }}
            onClick={() => onDelete?.(expense.id)}
            title="Deletar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
