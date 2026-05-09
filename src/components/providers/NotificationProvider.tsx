'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { requestPermission, sendNotification } from '@/lib/notifications';
import { isToday, isBefore, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatDate } from '@/lib/utils/date';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  useEffect(() => {
    const initializeNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const localStorage_key = 'notification-permission-asked';
      const permissionAsked = localStorage.getItem(localStorage_key);

      if (!permissionAsked) {
        const granted = await requestPermission();
        localStorage.setItem(localStorage_key, 'true');

        if (!granted) return;
      }

      const today = new Date();
      const inThreeDays = addDays(today, 3);

      const { data: expenses } = await supabase
        .from('expenses')
        .select('*, categories(name, color)')
        .eq('user_id', user.id)
        .eq('status', 'pendente')
        .order('due_date', { ascending: true });

      if (!expenses || expenses.length === 0) return;

      const overdueBills = expenses.filter((e) => {
        const dueDate = parseISO(e.due_date);
        return isBefore(dueDate, today) && !isToday(dueDate);
      });

      const dueSoonBills = expenses.filter((e) => {
        const dueDate = parseISO(e.due_date);
        return (
          !isBefore(dueDate, today) &&
          !isToday(dueDate) &&
          isBefore(dueDate, inThreeDays)
        );
      });

      // Send overdue notifications
      if (overdueBills.length > 0) {
        const overdue = overdueBills[0];
        const category = overdue.categories?.name || 'Sem categoria';

        sendNotification(
          `⚠️ ${overdueBills.length} despesa${overdueBills.length > 1 ? 's' : ''} vencida${overdueBills.length > 1 ? 's' : ''}`,
          {
            body: `${overdue.description} - ${category} (${formatDate(overdue.due_date)})`,
            tag: 'overdue-expenses',
            requireInteraction: true,
            url: '/expenses',
          }
        );
      }

      // Send due soon notifications
      if (dueSoonBills.length > 0) {
        const dueSoon = dueSoonBills[0];
        const category = dueSoon.categories?.name || 'Sem categoria';

        sendNotification(
          `📅 ${dueSoonBills.length} despesa${dueSoonBills.length > 1 ? 's' : ''} vencendo em breve`,
          {
            body: `${dueSoon.description} - ${category} (${formatDate(dueSoon.due_date)})`,
            tag: 'due-soon-expenses',
            url: '/expenses',
          }
        );
      }
    };

    initializeNotifications();
  }, []);

  return <>{children}</>;
}
