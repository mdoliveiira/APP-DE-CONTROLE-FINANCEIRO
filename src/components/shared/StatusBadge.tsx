import { Badge } from '@/components/ui/badge';
import type { ExpenseStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ExpenseStatus;
  overdue?: boolean;
}

export function StatusBadge({ status, overdue }: StatusBadgeProps) {
  if (status === 'pago') {
    return (
      <Badge className="bg-green-600 text-white hover:bg-green-700">
        Pago
      </Badge>
    );
  }

  if (overdue) {
    return (
      <Badge className="bg-red-600 text-white hover:bg-red-700">
        Vencida
      </Badge>
    );
  }

  return (
    <Badge className="bg-amber-600 text-white hover:bg-amber-700">
      Pendente
    </Badge>
  );
}
