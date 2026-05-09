'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { addMonths, shiftDateByMonths, toMonthKey } from '@/lib/utils/date';
import type { Expense } from '@/lib/types';

export async function createExpense(data: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('expenses').insert({
    ...data,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/expenses');
  revalidatePath('/dashboard');
}

export async function updateExpense(
  id: string,
  data: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('expenses')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/expenses');
  revalidatePath('/dashboard');
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/expenses');
  revalidatePath('/dashboard');
}

export async function markExpensePaid(id: string, paidDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      paid_date: paidDate,
      status: 'pago',
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/expenses');
  revalidatePath('/dashboard');
}

export async function markExpensePending(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      paid_date: null,
      status: 'pendente',
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/expenses');
  revalidatePath('/dashboard');
}

export async function createInstallments(
  data: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  totalInstallments: number
) {
  for (let i = 0; i < totalInstallments; i++) {
    const dueDate = shiftDateByMonths(data.due_date, i);
    const month = toMonthKey(dueDate);

    await createExpense({
      ...data,
      description: `${data.description} (${i + 1}/${totalInstallments})`,
      month,
      due_date: dueDate,
    });
  }
}

export async function createRecurring(
  data: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  months: number
) {
  for (let i = 0; i < months; i++) {
    const dueDate = shiftDateByMonths(data.due_date, i);
    const month = toMonthKey(dueDate);

    await createExpense({
      ...data,
      month,
      due_date: dueDate,
    });
  }
}
