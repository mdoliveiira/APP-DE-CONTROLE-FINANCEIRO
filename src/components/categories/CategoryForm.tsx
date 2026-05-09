'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ColorPicker } from './ColorPicker';
import { createCategory } from '@/lib/actions/categories';
import type { Category } from '@/lib/types';

interface CategoryFormProps {
  onSuccess?: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createCategory(name, color);
      setName('');
      setColor('#6366f1');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#E8E8EE' }}>
            Nova Categoria
          </h3>
        </div>

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
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Alimentação"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !name.trim()}
        >
          {loading ? 'Criando...' : 'Criar Categoria'}
        </Button>
      </form>
    </Card>
  );
}
