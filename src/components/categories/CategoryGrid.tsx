'use client';

import { Input } from '@/components/ui/input';
import { deleteCategory, updateCategory } from '@/lib/actions/categories';
import { upsertBudget, deleteBudget } from '@/lib/actions/budgets';
import { formatBRL } from '@/lib/utils/currency';
import type { Category, Budget } from '@/lib/types';
import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ColorPicker } from './ColorPicker';

interface CategoryGridProps {
  categories: Category[];
  budgets?: Map<string, Budget>;
  onCategoryDeleted?: () => void;
}

const cardStyle = {
  backgroundColor: '#141419',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '0.875rem',
  padding: '1rem',
};

export function CategoryGrid({ categories, budgets, onCategoryDeleted }: CategoryGridProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [budgetEditing, setBudgetEditing] = useState<string | null>(null);
  const [budgetSaving, setBudgetSaving] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [editingEntityType, setEditingEntityType] = useState<'pessoal' | 'empresa'>('pessoal');
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingSaving, setEditingSaving] = useState(false);
  const [budgetValues, setBudgetValues] = useState<Record<string, string>>(
    Object.fromEntries(
      categories.map(cat => [cat.id, budgets?.get(cat.id)?.amount_limit.toString() || ''])
    )
  );

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm({ open: false });
      onCategoryDeleted?.();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditStart = (cat: Category) => {
    setEditingCategory(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color);
    setEditingEntityType(cat.entity_type);
    setEditingParentId(cat.parent_id || null);
  };

  const handleEditSave = async () => {
    if (!editingCategory || !editingName.trim()) return;
    setEditingSaving(true);
    try {
      await updateCategory(editingCategory, editingName.trim(), editingColor, editingEntityType, editingParentId);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    } finally {
      setEditingSaving(false);
    }
  };

  const handleBudgetSave = async (categoryId: string) => {
    const value = budgetValues[categoryId]?.trim();
    setBudgetSaving(categoryId);
    try {
      const numValue = parseFloat(value || '0');
      if (numValue > 0) {
        await upsertBudget(categoryId, numValue);
      } else if (value === '') {
        await deleteBudget(categoryId);
        setBudgetValues(prev => ({ ...prev, [categoryId]: '' }));
      }
      setBudgetEditing(null);
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setBudgetSaving(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{
          border: '1px dashed rgba(255,255,255,0.12)',
        }}
      >
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Nenhuma categoria criada. Crie uma para começar!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} style={cardStyle} className="space-y-3">
            {editingCategory === category.id ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Nome</label>
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    disabled={editingSaving}
                    placeholder="Nome da categoria"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Tipo</label>
                  <select
                    value={editingEntityType}
                    onChange={(e) => setEditingEntityType(e.target.value as 'pessoal' | 'empresa')}
                    disabled={editingSaving}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid rgb(75, 85, 99)',
                      backgroundColor: 'rgb(31, 41, 55)',
                      color: 'rgb(229, 231, 235)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="pessoal">Pessoal</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Categoria Pai</label>
                  <select
                    value={editingParentId || ''}
                    onChange={(e) => setEditingParentId(e.target.value || null)}
                    disabled={editingSaving}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid rgb(75, 85, 99)',
                      backgroundColor: 'rgb(31, 41, 55)',
                      color: 'rgb(229, 231, 235)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="">Nenhuma (categoria raiz)</option>
                    {categories.filter(c => !c.parent_id && c.id !== editingCategory).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <ColorPicker value={editingColor} onChange={setEditingColor} />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    disabled={editingSaving || !editingName.trim()}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #C9973A, #E8B85C)',
                      color: '#0D0D12',
                    }}
                  >
                    {editingSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    disabled={editingSaving}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    style={{ color: '#6B7280' }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="h-5 w-5 rounded-md shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-sm font-medium truncate block"
                        style={{ color: '#E8E8EE' }}
                      >
                        {category.parent_id ? '→ ' : ''}{category.name}
                      </span>
                      {category.parent_id && (
                        <span className="text-xs" style={{ color: '#6B7280' }}>
                          Subcategoria
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: '#6B7280' }}
                      onClick={() => handleEditStart(category)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: '#6B7280' }}
                      onClick={() => setDeleteConfirm({ open: true, id: category.id })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {budgetEditing === category.id ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
                  Limite mensal
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={budgetValues[category.id] || ''}
                    onChange={(e) => setBudgetValues(prev => ({ ...prev, [category.id]: e.target.value }))}
                    disabled={budgetSaving === category.id}
                    className="text-sm"
                  />
                  <button
                    onClick={() => handleBudgetSave(category.id)}
                    disabled={budgetSaving === category.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #C9973A, #E8B85C)',
                      color: '#0D0D12',
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer p-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => setBudgetEditing(category.id)}
              >
                <p className="text-[11px] mb-0.5" style={{ color: '#6B7280' }}>
                  Limite mensal
                </p>
                <p className="text-sm font-medium" style={{ color: '#E8E8EE' }}>
                  {budgets?.get(category.id)?.amount_limit
                    ? formatBRL(budgets.get(category.id)!.amount_limit)
                    : '—'}
                </p>
              </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Deletar Categoria"
        description="Esta ação não pode ser desfeita. Se há despesas usando esta categoria, elas não serão deletadas, apenas desvinculadas."
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
