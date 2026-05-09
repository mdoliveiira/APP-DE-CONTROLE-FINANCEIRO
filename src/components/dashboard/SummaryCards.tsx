import { formatBRL } from '@/lib/utils/currency';
import { BarChart3, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  countPaid: number;
  countPending: number;
}

export function SummaryCards({
  totalAmount,
  totalPaid,
  totalPending,
  countPaid,
  countPending,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total do Mês',
      value: formatBRL(totalAmount),
      icon: DollarSign,
      iconBg: 'rgba(201,151,58,0.15)',
      iconColor: '#C9973A',
    },
    {
      title: 'Pago',
      value: formatBRL(totalPaid),
      count: `${countPaid} conta${countPaid !== 1 ? 's' : ''}`,
      icon: CheckCircle,
      iconBg: 'rgba(34,211,168,0.14)',
      iconColor: '#22D3A8',
    },
    {
      title: 'Pendente',
      value: formatBRL(totalPending),
      count: `${countPending} conta${countPending !== 1 ? 's' : ''}`,
      icon: Clock,
      iconBg: 'rgba(245,158,11,0.14)',
      iconColor: '#F59E0B',
    },
    {
      title: 'Total de Contas',
      value: String(countPaid + countPending),
      icon: BarChart3,
      iconBg: 'rgba(129,140,248,0.14)',
      iconColor: '#818CF8',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#141419',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: '#6B7280' }}
              >
                {card.title}
              </p>
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon className="h-4 w-4" style={{ color: card.iconColor }} />
              </div>
            </div>
            <p
              className="text-xl font-bold leading-tight"
              style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
            >
              {card.value}
            </p>
            {card.count && (
              <p className="text-[11px] mt-1" style={{ color: '#6B7280' }}>
                {card.count}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
