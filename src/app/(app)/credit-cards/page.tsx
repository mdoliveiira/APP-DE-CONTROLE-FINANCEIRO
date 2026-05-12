import { createClient } from '@/lib/supabase/server';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { CreditCardList } from '@/components/credit-cards/CreditCardList';
import { CreditCardForm } from '@/components/credit-cards/CreditCardForm';
import { format } from 'date-fns';
import type { CreditCard, Expense } from '@/lib/types';

export default async function CreditCardsPage({
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

  const { data: creditCards } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user?.id)
    .eq('month', month)
    .not('credit_card_id', 'is', null);

  const expensesByCard = new Map<string, Expense[]>();
  (expenses || []).forEach((expense) => {
    if (expense.credit_card_id) {
      if (!expensesByCard.has(expense.credit_card_id)) {
        expensesByCard.set(expense.credit_card_id, []);
      }
      expensesByCard.get(expense.credit_card_id)!.push(expense);
    }
  });

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            Cartões de Crédito
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Gerencie seus cartões e visualize as faturas
          </p>
        </div>

        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            backgroundColor: '#141419',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h3 className="font-semibold" style={{ color: '#E8E8EE' }}>
            + Adicionar Novo Cartão
          </h3>
          <CreditCardForm />
        </div>

        {(creditCards || []).length > 0 && (
          <CreditCardList
            cards={(creditCards || []) as CreditCard[]}
            expenses={expensesByCard}
          />
        )}
      </div>
    </div>
  );
}
