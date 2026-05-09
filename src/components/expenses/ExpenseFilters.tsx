'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Category } from '@/lib/types';

interface ExpenseFiltersProps {
  categories: Category[];
}

export function ExpenseFilters({ categories }: ExpenseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') || 'todas');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    const month = params.get('month'); // preservar mês

    params.delete('status');
    params.delete('category_id');
    params.delete('search');

    if (status !== 'todas') params.set('status', status);
    if (categoryId) params.set('category_id', categoryId);
    if (search) params.set('search', search);
    if (month) params.set('month', month);

    const query = params.toString();
    router.push(`/expenses${query ? '?' + query : ''}`);
  }, [router, searchParams, status, categoryId, search]);

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const month = searchParams.get('month');
    if (month) params.set('month', month);

    setStatus('todas');
    setCategoryId('');
    setSearch('');

    const query = params.toString();
    router.push(`/expenses${query ? '?' + query : ''}`);
  }, [router, searchParams]);

  const hasFilters = status !== 'todas' || categoryId || search;

  return (
    <div
      className="space-y-4 rounded-xl p-4"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value || 'todas')}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="vencidas">Vencidas</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="pago">Pagas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Categoria</label>
          <Select value={categoryId} onValueChange={(value) => setCategoryId(value || '')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Buscar</label>
          <Input
            placeholder="Buscar descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Apply Button */}
        <div className="flex items-end gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Filtrar
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-10 w-10 p-0"
              title="Limpar filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
