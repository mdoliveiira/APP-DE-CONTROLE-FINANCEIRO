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
import { createExpense, updateExpense, createInstallments, createRecurring } from '@/lib/actions/expenses';
import { formatDate, toMonthKey, monthsUntilEndOfYear } from '@/lib/utils/date';
import type { Expense, Category } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { differenceInMonths } from 'date-fns';

const expenseSchema = z.object({
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().min(1, 'Descrição obrigatória').max(200),
  amount: z.number().positive('Valor deve ser maior que zero'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  status: z.enum(['pago', 'pendente']),
  notes: z.string().nullable().optional(),
  installment_type: z.enum(['unico', 'parcelado', 'recorrente']),
  installment_count: z.number().int().min(2).max(120).nullable().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').nullable().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  categories: Category[];
}

export function ExpenseForm({ expense, categories }: ExpenseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(
    expense ? new Date(expense.due_date) : new Date()
  );
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category_id: expense?.category_id || undefined,
      description: expense?.description || '',
      amount: expense?.amount || 0,
      due_date: expense?.due_date || format(new Date(), 'yyyy-MM-dd'),
      status: expense?.status || 'pendente',
      notes: expense?.notes || null,
      installment_type: ('unico' as const),
      installment_count: 2,
      start_date: null,
    },
  });

  const status = watch('status');
  const amount = watch('amount') as unknown as number;
  const installment_type = watch('installment_type');
  const installment_count = watch('installment_count');
  const start_date = watch('start_date');
  const selectedCategoryId = watch('category_id');

  const selectedCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : null;

  const calculateMonthsToEndOfYear = (startDate: string | null | undefined) => {
    if (!startDate) return 0;
    return monthsUntilEndOfYear(new Date(startDate));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue('due_date', format(date, 'yyyy-MM-dd'));
      setDueDateOpen(false);
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    setError(null);

    try {
      const dueDate = data.installment_type !== 'unico' && data.start_date ? data.start_date : data.due_date;
      const month = toMonthKey(dueDate);

      const baseExpenseData = {
        category_id: data.category_id || null,
        description: data.description,
        amount: Number(amount),
        due_date: dueDate,
        status: data.status,
        month,
        entity_type: selectedCategory?.entity_type || 'pessoal',
        notes: data.notes || null,
        paid_date: null,
      } as Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

      if (expense) {
        await updateExpense(expense.id, {
          ...baseExpenseData,
          status: data.status,
        });
      } else {
        if (data.installment_type === 'parcelado' && data.installment_count && data.installment_count > 1) {
          await createInstallments(baseExpenseData, data.installment_count);
        } else if (data.installment_type === 'recorrente') {
          const monthsToEndOfYear = data.start_date ? calculateMonthsToEndOfYear(data.start_date) : 12;
          await createRecurring(baseExpenseData, monthsToEndOfYear);
        } else {
          await createExpense(baseExpenseData);
        }
      }

      router.push('/expenses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar despesa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}>
            {expense ? 'Editar Despesa' : 'Nova Despesa'}
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
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={watch('category_id') || ''}
            onValueChange={(value) => setValue('category_id', value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar categoria..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem categoria</SelectItem>
              {categories.filter(c => !c.parent_id).map((rootCat) => (
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
                  {categories.filter(c => c.parent_id === rootCat.id).map((subCat) => (
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
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            placeholder="Ex: Gasolina"
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
          <Label>Vence em</Label>
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as 'pago' | 'pendente')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
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

        {!expense && (
          <>
            <div className="space-y-2">
              <Label htmlFor="installment_type">Tipo de Despesa</Label>
              <Select
                value={installment_type}
                onValueChange={(value) => setValue('installment_type', value as 'unico' | 'parcelado' | 'recorrente')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unico">Pagamento Único</SelectItem>
                  <SelectItem value="parcelado">Parcelado (ex: 6x)</SelectItem>
                  <SelectItem value="recorrente">Recorrente (todo mês)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(installment_type === 'parcelado' || installment_type === 'recorrente') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger>
                      <Button variant="outline" className="w-full justify-start">
                        {selectedStartDate ? format(selectedStartDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedStartDate || undefined}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedStartDate(date);
                            setValue('start_date', format(date, 'yyyy-MM-dd'));
                            setStartDateOpen(false);
                          }
                        }}
                        disabled={loading}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {installment_type === 'parcelado' && (
                  <div className="space-y-2">
                    <Label htmlFor="installment_count">Número de Parcelas</Label>
                    <Input
                      id="installment_count"
                      type="number"
                      min="2"
                      max="60"
                      placeholder="Ex: 6"
                      {...register('installment_count', { valueAsNumber: true })}
                      disabled={loading}
                    />
                    {errors.installment_count && (
                      <p className="text-xs" style={{ color: '#F87171' }}>{errors.installment_count.message}</p>
                    )}
                  </div>
                )}

                {installment_type === 'recorrente' && start_date && (
                  <div
                    className="p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22C55E',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    {calculateMonthsToEndOfYear(start_date)} meses serão criados ({format(new Date(start_date), 'MMM', { locale: ptBR })} → dez)
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : expense ? 'Atualizar' : 'Criar Despesa'}
        </Button>
      </form>
    </Card>
  );
}
