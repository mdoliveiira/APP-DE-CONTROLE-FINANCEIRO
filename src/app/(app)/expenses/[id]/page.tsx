import { createClient } from '@/lib/supabase/server';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ExpenseEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpenseEditPage({ params }: ExpenseEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: expense } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single();

  if (!expense) {
    notFound();
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const { data: creditCards } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-2xl">
          <div className="mb-6">
            <Link href="/expenses">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          <ExpenseForm
            expense={expense}
            categories={categories || []}
            creditCards={creditCards || []}
          />
        </div>
      </div>
    </div>
  );
}
