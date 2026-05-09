'use server';

import { createClient } from '@/lib/supabase/server';

export async function linkWhatsApp(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const { error } = await supabase
      .from('whatsapp_users')
      .upsert(
        {
          user_id: user.id,
          phone_number: phoneNumber,
        },
        {
          onConflict: 'phone_number',
        }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function unlinkWhatsApp(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const { error } = await supabase
      .from('whatsapp_users')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function getLinkedPhone(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('whatsapp_users')
      .select('phone_number')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return data.phone_number;
  } catch {
    return null;
  }
}
