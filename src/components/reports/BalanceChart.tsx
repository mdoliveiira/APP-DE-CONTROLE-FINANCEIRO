'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { formatBRL } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthData {
  month: string;
  paid: number;
  pending: number;
  total: number;
  income: number;
  balance: number;
}

interface BalanceChartProps {
  data: MonthData[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: format(new Date(item.month + '-01'), 'MMM', { locale: ptBR }),
  }));

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3 className="mb-6 text-sm font-semibold" style={{ color: '#E8E8EE' }}>
        Receitas vs Despesas
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="monthLabel" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.5rem',
              color: '#E8E8EE',
            }}
            labelStyle={{ color: '#E8E8EE' }}
          />
          <Legend />
          <Bar dataKey="income" fill="#22D3A8" name="Receitas" />
          <Bar dataKey="total" fill="#F59E0B" name="Despesas" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8B5CF6"
            name="Saldo"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
