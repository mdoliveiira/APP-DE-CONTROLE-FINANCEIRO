'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyData {
  month: string;
  paid: number;
  pending: number;
  total: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    monthLabel: format(parse(item.month, 'yyyy-MM', new Date()), 'MMM', { locale: ptBR }),
  }));

  return (
    <div
      className="p-4 rounded-2xl"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--foreground)' }}
      >
        Evolução Mensal
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            label={{
              value: 'R$',
              angle: -90,
              position: 'insideLeft',
              fill: 'var(--muted-foreground)',
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            formatter={(value) => {
              if (typeof value === 'number') {
                return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              }
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)' }}>
                {value === 'paid' ? 'Pago' : 'Pendente'}
              </span>
            )}
          />
          <Bar dataKey="paid" fill="#22D3A8" radius={[8, 8, 0, 0]} />
          <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
