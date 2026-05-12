'use client';

import { useState } from 'react';
import { ExpenseRow } from './ExpenseRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { markExpensePaid, markExpensePending, deleteExpense } from '@/lib/actions/expenses';
import type { Expense, Category, CreditCard } from '@/lib/types';
import { format } from 'date-fns';
import { isOverdue } from '@/lib/utils/date';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Record<string, Category>;
  creditCards?: Record<string, CreditCard>;
}

export function ExpenseList({ expenses, categories, creditCards = {} }: ExpenseListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Nenhuma despesa"
        description="Crie sua primeira despesa para começar a acompanhar suas finanças"
        icon="📊"
      />
    );
  }

  const overdue = expenses.filter(e => e.status === 'pendente' && isOverdue(e.due_date));
  const pending = expenses.filter(e => e.status === 'pendente' && !isOverdue(e.due_date));
  const paid = expenses.filter(e => e.status === 'pago');

  const sections = [
    { key: 'vencida', label: 'Vencidas', items: overdue },
    { key: 'pendente', label: 'Pendentes', items: pending },
    { key: 'pago', label: 'Pagas', items: paid },
  ].filter(s => s.items.length > 0);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;

    setDeleting(true);
    try {
      await deleteExpense(deleteConfirm.id);
      setDeleteConfirm({ open: false });
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markExpensePaid(id, format(new Date(), 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
    }
  };

  const handleMarkPending = async (id: string) => {
    try {
      await markExpensePending(id);
    } catch (error) {
      console.error('Erro ao marcar como pendente:', error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.key}>
            <h3
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{
                color: section.key === 'vencida'
                  ? '#F87171'
                  : section.key === 'pendente'
                  ? '#F59E0B'
                  : '#6B7280',
              }}
            >
              {section.label} ({section.items.length})
            </h3>
            <div className="space-y-2">
              {section.items.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  category={
                    expense.category_id ? categories[expense.category_id] : undefined
                  }
                  creditCard={
                    expense.credit_card_id ? creditCards[expense.credit_card_id] : undefined
                  }
                  onMarkPaid={handleMarkPaid}
                  onMarkPending={handleMarkPending}
                  onDelete={() => setDeleteConfirm({ open: true, id: expense.id })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Deletar Despesa"
        description="Esta ação não pode ser desfeita."
        cancelLabel="Cancelar"
        confirmLabel="Deletar"
        variant="destructive"
        loading={deleting}
        onCancel={() => setDeleteConfirm({ open: false })}
        onConfirm={handleDelete}
      />
    </>
  );
}
