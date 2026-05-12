'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/categories/ColorPicker';
import { createCreditCard, updateCreditCard } from '@/lib/actions/credit-cards';
import type { CreditCard } from '@/lib/types';

interface CreditCardFormProps {
  card?: CreditCard;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreditCardForm({ card, onSuccess, onCancel }: CreditCardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [color, setColor] = useState(card?.color || '#6366F1');
  const [dueDay, setDueDay] = useState(card?.due_day.toString() || '10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const day = parseInt(dueDay, 10);
      if (day < 1 || day > 31) {
        throw new Error('Dia deve estar entre 1 e 31');
      }

      if (!name.trim()) {
        throw new Error('Nome obrigatório');
      }

      if (card) {
        await updateCreditCard(card.id, name.trim(), color, day);
      } else {
        await createCreditCard(name.trim(), color, day);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cartão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{
            backgroundColor: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.2)',
            color: '#F87171',
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cartão</Label>
        <Input
          id="name"
          placeholder="Ex: PicPay, Nubank..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_day">Dia de Vencimento</Label>
        <Input
          id="due_day"
          type="number"
          min="1"
          max="31"
          placeholder="10"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Salvando...' : card ? 'Atualizar' : 'Adicionar'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
