'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Income } from '@/lib/types';

export async function createIncome(
  description: string,
  amount: number,
  date: string,
  month: string,
  entity_type: 'pessoal' | 'empresa',
  category_id: string | null = null,
  notes: string | null = null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('incomes').insert({
    user_id: user.id,
    description,
    amount,
    date,
    month,
    entity_type,
    category_id,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/incomes');
  revalidatePath('/dashboard');
}

export async function updateIncome(
  id: string,
  description: string,
  amount: number,
  date: string,
  month: string,
  entity_type: 'pessoal' | 'empresa',
  category_id: string | null = null,
  notes: string | null = null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('incomes')
    .update({
      description,
      amount,
      date,
      month,
      entity_type,
      category_id,
      notes,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/incomes');
  revalidatePath('/dashboard');
}

export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('incomes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/incomes');
  revalidatePath('/dashboard');
}
