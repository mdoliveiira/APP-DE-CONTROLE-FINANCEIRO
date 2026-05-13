import { createClient } from '@/lib/supabase/server';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { IncomeForm } from '@/components/incomes/IncomeForm';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { deleteIncome } from '@/lib/actions/incomes';
import { formatBRL } from '@/lib/utils/currency';
import type { Income, Category } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function IncomesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = params.month || currentMonth;

  const { data: incomes } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', user?.id)
    .eq('month', month)
    .order('date', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const categoriesRecord: Record<string, Category> = Object.fromEntries(
    (categories || []).map((cat: Category) => [cat.id, cat])
  );

  const totalIncome = (incomes || []).reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
            >
              Receitas
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Controle suas entradas de dinheiro
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: '#141419',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="mb-4">
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Total do mês</p>
            <p className="text-2xl font-bold" style={{ color: '#22C55E' }}>
              {formatBRL(totalIncome)}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            backgroundColor: '#141419',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h3 className="font-semibold" style={{ color: '#E8E8EE' }}>
            + Nova Receita
          </h3>
          <IncomeForm categories={categories || []} />
        </div>

        {(incomes || []).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              Receitas do mês ({incomes!.length})
            </h3>
            {incomes!.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between gap-4 rounded-xl p-4"
                style={{
                  backgroundColor: '#141419',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {income.category_id && categoriesRecord[income.category_id] && (
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: categoriesRecord[income.category_id].color }}
                      />
                    )}
                    <h4
                      className="font-medium truncate text-sm"
                      style={{ color: '#E8E8EE' }}
                    >
                      {income.description}
                    </h4>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                    {format(new Date(income.date), 'dd/MM/yyyy', { locale: ptBR })}
                    {income.category_id && categoriesRecord[income.category_id] && (
                      <span> · {categoriesRecord[income.category_id].name}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: '#22C55E', fontFamily: 'var(--font-sora)' }}
                    >
                      +{formatBRL(income.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
