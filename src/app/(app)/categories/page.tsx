import { createClient } from '@/lib/supabase/server';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import type { Budget } from '@/lib/types';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user?.id);

  const budgetsMap = new Map(
    (budgets || []).map((b: Budget) => [b.category_id, b])
  );

  return (
    <div className="flex flex-col h-full">
      <MonthSelector />
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            Categorias
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Organize suas despesas por categoria
          </p>
        </div>

        <CategoryForm categories={categories || []} />

        <div>
          <h2
            className="text-base font-semibold mb-4"
            style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
          >
            Suas Categorias
          </h2>
          <CategoryGrid categories={categories || []} budgets={budgetsMap} />
        </div>
      </div>
    </div>
  );
}
