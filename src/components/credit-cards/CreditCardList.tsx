'use client';

import { useState } from 'react';
import { formatBRL } from '@/lib/utils/currency';
import { deleteCreditCard } from '@/lib/actions/credit-cards';
import type { CreditCard, Expense } from '@/lib/types';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CreditCardForm } from './CreditCardForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface CreditCardListProps {
  cards: CreditCard[];
  expenses: Map<string, Expense[]>;
  onCardDeleted?: () => void;
}

const cardStyle = {
  backgroundColor: '#141419',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '0.875rem',
  padding: '1rem',
};

export function CreditCardList({ cards, expenses, onCardDeleted }: CreditCardListProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleting(true);
    try {
      await deleteCreditCard(deleteConfirm.id);
      setDeleteConfirm({ open: false });
      onCardDeleted?.();
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{
          border: '1px dashed rgba(255,255,255,0.12)',
        }}
      >
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Nenhum cartão adicionado. Crie um para começar!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {cards.map((card) => {
          const cardExpenses = expenses.get(card.id) || [];
          const total = cardExpenses.reduce((sum, e) => sum + e.amount, 0);
          const isEditing = editingCard === card.id;
          const isExpanded = expandedCard === card.id;

          return (
            <div key={card.id} style={cardStyle} className="space-y-3">
              {isEditing ? (
                <CreditCardForm
                  card={card}
                  onSuccess={() => setEditingCard(null)}
                  onCancel={() => setEditingCard(null)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="h-5 w-5 rounded-md shrink-0"
                        style={{ backgroundColor: card.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: '#E8E8EE' }}>
                          {card.name}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          Vence dia {card.due_day}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
                        style={{ color: '#6B7280' }}
                        onClick={() => setEditingCard(card.id)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
                        style={{ color: '#6B7280' }}
                        onClick={() => setDeleteConfirm({ open: true, id: card.id })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <p className="text-[11px] mb-0.5" style={{ color: '#6B7280' }}>
                      Fatura do mês
                    </p>
                    <p className="text-sm font-medium" style={{ color: '#E8E8EE' }}>
                      {formatBRL(total)}
                    </p>
                  </div>

                  {cardExpenses.length > 0 && (
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg transition-colors text-xs"
                      style={{ color: '#9CA3AF' }}
                    >
                      <span>Ver despesas ({cardExpenses.length})</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}

                  {isExpanded && cardExpenses.length > 0 && (
                    <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                      {cardExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between text-xs">
                          <span style={{ color: '#9CA3AF' }}>
                            {expense.description}
                          </span>
                          <span style={{ color: '#E8E8EE' }}>
                            {formatBRL(expense.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Deletar Cartão"
        description="Esta ação não pode ser desfeita. As despesas vinculadas ao cartão não serão deletadas, apenas desvinculadas."
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
