'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  paid: number;
  pending: number;
}

export function ExpenseChart({ paid, pending }: ExpenseChartProps) {
  const data = [
    { name: 'Pago', value: paid },
    { name: 'Pendente', value: pending },
  ];

  const total = paid + pending;
  const hasData = total > 0;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3
        className="mb-6 text-base font-semibold"
        style={{ color: '#E8E8EE', fontFamily: 'var(--font-sora)' }}
      >
        Resumo de Status
      </h3>

      {hasData ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              innerRadius={50}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="#22D3A8" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip
              formatter={(value) => (value != null ? `R$ ${Number(value).toFixed(2)}` : '')}
              contentStyle={{
                backgroundColor: '#1C1C24',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                color: '#E8E8EE',
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex h-[280px] items-center justify-center text-sm"
          style={{ color: '#6B7280' }}
        >
          Nenhuma despesa para exibir
        </div>
      )}
    </div>
  );
}
