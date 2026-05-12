'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ColorPicker } from './ColorPicker';
import { createCategory } from '@/lib/actions/categories';
import type { Category, EntityType } from '@/lib/types';

interface CategoryFormProps {
  onSuccess?: () => void;
  categories?: Category[];
}

export function CategoryForm({ onSuccess, categories = [] }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [entityType, setEntityType] = useState<EntityType>('pessoal');
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rootCategories = categories.filter(c => !c.parent_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createCategory(name, color, entityType, parentId);
      setName('');
      setColor('#6366f1');
      setParentId(null);
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
          <Label htmlFor="entityType">Tipo</Label>
          <select
            id="entityType"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as EntityType)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid rgb(75, 85, 99)',
              backgroundColor: 'rgb(31, 41, 55)',
              color: 'rgb(229, 231, 235)',
            }}
          >
            <option value="pessoal">Pessoal</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>

        {rootCategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="parentId">Categoria Pai (opcional)</Label>
            <select
              id="parentId"
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid rgb(75, 85, 99)',
                backgroundColor: 'rgb(31, 41, 55)',
                color: 'rgb(229, 231, 235)',
              }}
            >
              <option value="">Nenhuma (categoria raiz)</option>
              {rootCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

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
