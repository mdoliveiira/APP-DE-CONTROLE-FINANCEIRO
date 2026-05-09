import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function toMonthKey(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(d, 'yyyy-MM');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(d, 'dd/MM/yyyy');
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, 'MMMM yyyy', { locale: ptBR });
}

export function getMonthKeyFromDate(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function addMonths(monthKey: string, n: number): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1 + n);
  return format(date, 'yyyy-MM');
}

export function shiftDateByMonths(isoDate: string, n: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const d = new Date(year, month - 1 + n, day);
  return format(d, 'yyyy-MM-dd');
}

export function isOverdue(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(isoDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
