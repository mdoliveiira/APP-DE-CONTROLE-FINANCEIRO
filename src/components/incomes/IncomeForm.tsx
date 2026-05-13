'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CurrencyInput } from '@/components/shared/CurrencyInput';
import { createIncome, updateIncome } from '@/lib/actions/incomes';
import { formatDate, toMonthKey } from '@/lib/utils/date';
import type { Income, Category } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const incomeSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória').max(200),
  amount: z.number().positive('Valor deve ser maior que zero'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  category_id: z.string().uuid().nullable().optional(),
  entity_type: z.enum(['pessoal', 'empresa']),
  notes: z.string().nullable().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  income?: Income;
  categories: Category[];
  onSuccess?: () => void;
}

export function IncomeForm({ income, categories, onSuccess }: IncomeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(
    income ? new Date(income.date) : new Date()
  );
  const [dateOpen, setDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      description: income?.description || '',
      amount: income?.amount || 0,
      date: income?.date || format(new Date(), 'yyyy-MM-dd'),
      category_id: income?.category_id || undefined,
      entity_type: income?.entity_type || 'pessoal',
      notes: income?.notes || null,
    },
  });

  const amount = watch('amount') as unknown as number;
  const entity_type = watch('entity_type');

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue('date', format(date, 'yyyy-MM-dd'));
      setDateOpen(false);
    }
  };

  const onSubmit = async (data: IncomeFormData) => {
    setLoading(true);
    setError(null);

    try {
      const month = toMonthKey(data.date);

      if (income) {
        await updateIncome(
          income.id,
          data.description,
          Number(amount),
          data.date,
          month,
          data.entity_type,
          data.category_id || null,
          data.notes || null
        );
      } else {
        await createIncome(
          data.description,
          Number(amount),
          data.date,
          month,
          data.entity_type,
          data.category_id || null,
          data.notes || null
        );
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}>
            {income ? 'Editar Receita' : 'Nova Receita'}
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
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            placeholder="Ex: Salário, Freelance..."
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-xs" style={{ color: '#F87171' }}>{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <CurrencyInput
            value={amount}
            onChange={(value) => setValue('amount', value)}
            disabled={loading}
          />
          {errors.amount && (
            <p className="text-xs" style={{ color: '#F87171' }}>{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Data</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger>
              <Button variant="outline" className="w-full justify-start">
                {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={loading}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria (opcional)</Label>
          <Select
            value={watch('category_id') || ''}
            onValueChange={(value) => setValue('category_id', value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar categoria..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem categoria</SelectItem>
              {categories.filter(c => !c.parent_id && c.entity_type === entity_type).map((rootCat) => (
                <div key={rootCat.id}>
                  <SelectItem value={rootCat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: rootCat.color }}
                      />
                      {rootCat.name}
                    </div>
                  </SelectItem>
                  {categories.filter(c => c.parent_id === rootCat.id && c.entity_type === entity_type).map((subCat) => (
                    <SelectItem key={subCat.id} value={subCat.id} className="pl-8">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: subCat.color }}
                        />
                        → {subCat.name}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entity_type">Tipo</Label>
          <Select
            value={entity_type}
            onValueChange={(value) => setValue('entity_type', value as 'pessoal' | 'empresa')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoal">Pessoal</SelectItem>
              <SelectItem value="empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            placeholder="Adicionar observações..."
            {...register('notes')}
            disabled={loading}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : income ? 'Atualizar' : 'Adicionar Receita'}
        </Button>
      </form>
    </Card>
  );
}
