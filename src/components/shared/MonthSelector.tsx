'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { addMonths, getMonthLabel } from '@/lib/utils/date';

export function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monthParam = searchParams.get('month');

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = monthParam || currentMonth;

  const handlePrevMonth = () => {
    const prev = addMonths(month, -1);
    const params = new URLSearchParams(searchParams);
    params.set('month', prev);
    router.push(`?${params.toString()}`);
  };

  const handleNextMonth = () => {
    const next = addMonths(month, 1);
    const params = new URLSearchParams(searchParams);
    params.set('month', next);
    router.push(`?${params.toString()}`);
  };

  const handleToday = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('month');
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className="flex items-center justify-between gap-2 px-4 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevMonth}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" style={{ color: '#6B7280' }} />
      </Button>
      <button
        onClick={handleToday}
        className="text-sm font-semibold capitalize min-w-40 text-center"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        {getMonthLabel(month)}
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNextMonth}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" style={{ color: '#6B7280' }} />
      </Button>
    </div>
  );
}
