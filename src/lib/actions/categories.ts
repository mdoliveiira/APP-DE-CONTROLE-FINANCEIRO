'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string, color: string, entityType: 'pessoal' | 'empresa' = 'pessoal', parentId: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name,
    color,
    entity_type: entityType,
    parent_id: parentId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/categories');
}

export async function updateCategory(id: string, name: string, color: string, entityType?: 'pessoal' | 'empresa', parentId?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const updateData: any = { name, color };
  if (entityType) updateData.entity_type = entityType;
  if (parentId !== undefined) updateData.parent_id = parentId;

  const { error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/categories');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/categories');
}
