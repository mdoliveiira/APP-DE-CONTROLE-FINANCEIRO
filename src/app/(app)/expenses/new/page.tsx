import { createClient } from '@/lib/supabase/server';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewExpensePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from('categories')
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

          <ExpenseForm categories={categories || []} />
        </div>
      </div>
    </div>
  );
}
