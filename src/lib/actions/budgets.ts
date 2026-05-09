'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertBudget(categoryId: string, amountLimit: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('budgets')
    .upsert(
      {
        user_id: user.id,
        category_id: categoryId,
        amount_limit: amountLimit,
      },
      {
        onConflict: 'user_id,category_id',
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/categories');
  revalidatePath('/dashboard');
}

export async function deleteBudget(categoryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('user_id', user.id)
    .eq('category_id', categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/categories');
  revalidatePath('/dashboard');
}
